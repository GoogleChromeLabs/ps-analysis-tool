/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * External dependencies.
 */
import { createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { noop } from '@ps-analysis-tool/design-system';
import {
  type TabCookies,
  type TabFrames,
  type CookieData,
  UNKNOWN_FRAME_KEY,
  filterCookiesByFrame,
  generateCookieTableCSV,
} from '@ps-analysis-tool/common';
import { saveAs } from 'file-saver';

/**
 * Internal dependencies.
 */
import useContextSelector from '../../../../utils/useContextSelector';
import { ALLOWED_NUMBER_OF_TABS } from '../../../../constants';
import setDocumentCookies from '../../../../utils/setDocumentCookies';
import isOnRWS from '../../../../contentScript/utils/isOnRWS';
import { useSettingsStore } from '../syncSettingsStore';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    loading: boolean;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
    returningToSingleTab: boolean;
    isCurrentTabBeingListenedTo: boolean;
    isInspecting: boolean;
    contextInvalidated: boolean;
    canStartInspecting: boolean;
  };
  actions: {
    setSelectedFrame: (key: string | null) => void;
    setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
    changeListeningToThisTab: () => void;
    getCookiesSetByJavascript: () => void;
    exportFrameCookies: () => void;
    setContextInvalidated: React.Dispatch<React.SetStateAction<boolean>>;
    setCanStartInspecting: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
    tabFrames: null,
    selectedFrame: null,
    loading: true,
    isCurrentTabBeingListenedTo: false,
    returningToSingleTab: false,
    isInspecting: false,
    contextInvalidated: false,
    canStartInspecting: false,
  },
  actions: {
    setSelectedFrame: noop,
    changeListeningToThisTab: noop,
    setIsInspecting: noop,
    getCookiesSetByJavascript: noop,
    exportFrameCookies: noop,
    setContextInvalidated: noop,
    setCanStartInspecting: noop,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  // TODO: Refactor: create smaller providers and reduce state from here.
  const [tabId, setTabId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);
  const [contextInvalidated, setContextInvalidated] = useState<boolean>(false);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const { allowedNumberOfTabs } = useSettingsStore(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  const [canStartInspecting, setCanStartInspecting] = useState<boolean>(false);

  const [tabCookies, setTabCookies] =
    useState<CookieStoreContext['state']['tabCookies']>(null);

  const [isInspecting, setIsInspecting] =
    useState<CookieStoreContext['state']['isInspecting']>(false);

  const [selectedFrame, setSelectedFrame] =
    useState<CookieStoreContext['state']['selectedFrame']>(null);

  const [tabUrl, setTabUrl] =
    useState<CookieStoreContext['state']['tabUrl']>(null);
  const [tabFrames, setTabFrames] =
    useState<CookieStoreContext['state']['tabFrames']>(null);

  /**
   * Set tab frames state for frame ids and frame URLs from using chrome.webNavigation.getAllFrames
   *
   * TODO: Refactor: move it to a utility function.
   */
  const getAllFramesForCurrentTab = useCallback(
    async (_tabId: number | null) => {
      if (!_tabId) {
        return;
      }

      const regexForFrameUrl =
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;

      const currentTabFrames = await chrome.webNavigation.getAllFrames({
        tabId: _tabId,
      });
      const modifiedTabFrames: TabFrames = {};

      currentTabFrames?.forEach(({ url, frameId, frameType }) => {
        if (url && url.includes('http')) {
          const parsedUrl = regexForFrameUrl.exec(url);
          if (parsedUrl && parsedUrl[0]) {
            if (modifiedTabFrames[parsedUrl[0]]) {
              modifiedTabFrames[parsedUrl[0]].frameIds.push(frameId);
            } else {
              modifiedTabFrames[parsedUrl[0]] = {
                frameIds: [frameId],
                frameType,
              };
            }
          }
        }
      });
      await Promise.all(
        Object.keys(modifiedTabFrames).map(async (tabFrame) => {
          modifiedTabFrames[tabFrame].isOnRWS = await isOnRWS(tabFrame);
          return tabFrame;
        })
      );
      modifiedTabFrames[UNKNOWN_FRAME_KEY] = { frameIds: [] };
      setTabFrames(modifiedTabFrames);
    },
    []
  );

  /**
   * Sets current frames for sidebar, detected if the current tab is to be analysed,
   * parses data currently in store, set current tab URL.
   *
   * TODO: Refactor: Break in smaller parts.
   */
  const intitialSync = useCallback(async () => {
    const _tabId = chrome.devtools.inspectedWindow.tabId;

    await getAllFramesForCurrentTab(_tabId);

    setTabId(_tabId);

    if (_tabId) {
      if (allowedNumberOfTabs === 'single') {
        const getTabBeingListenedTo = await chrome.storage.local.get();
        const availableTabs = await chrome.tabs.query({});
        if (
          availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
          availableTabs.filter(
            (processingTab) =>
              processingTab.id?.toString() === getTabBeingListenedTo?.tabToRead
          )
        ) {
          setReturningToSingleTab(true);
        }

        if (
          getTabBeingListenedTo &&
          _tabId.toString() !== getTabBeingListenedTo?.tabToRead
        ) {
          setIsCurrentTabBeingListenedTo(false);
          setLoading(false);
          setSelectedFrame(null);
          setTabFrames(null);
          setCanStartInspecting(false);
          return;
        } else {
          setIsCurrentTabBeingListenedTo(true);
        }
      }
    }
    await setDocumentCookies(_tabId?.toString());
    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];
    if (tabData && tabData.cookies) {
      const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
        {};

      Object.entries(tabData.cookies as { [key: string]: CookieData }).map(
        ([key, value]: [string, CookieData]) => {
          const isCookieBlocked =
            value?.isBlocked ||
            (value?.blockedReasons && value?.blockedReasons?.length > 0) ||
            false;

          _cookies[key] = {
            ...value,
            isBlocked: isCookieBlocked,
          };
          return [key, value];
        }
      );

      setTabCookies(_cookies);
    }

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabUrl(result);
        }
      }
    );

    setLoading(false);
  }, [allowedNumberOfTabs, getAllFramesForCurrentTab]);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        tabId &&
        Object.keys(changes).includes(tabId.toString()) &&
        changes[tabId.toString()]?.newValue?.cookies
      ) {
        const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
          {};

        Object.entries(
          changes[tabId.toString()].newValue.cookies as {
            [key: string]: CookieData;
          }
        ).map(([key, value]) => {
          const isCookieBlocked =
            value?.isBlocked ||
            (value?.blockedReasons && value?.blockedReasons?.length > 0) ||
            false;

          _cookies[key] = {
            ...value,
            isBlocked: isCookieBlocked,
          };
          return [key, value];
        });

        await getAllFramesForCurrentTab(tabId);
        setTabCookies(_cookies);
      }

      if (tabId) {
        const extensionStorage = await chrome.storage.sync.get();

        if (extensionStorage?.allowedNumberOfTabs === 'single') {
          const getTabBeingListenedTo = await chrome.storage.local.get();
          const availableTabs = await chrome.tabs.query({});

          if (
            availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
            availableTabs.filter(
              (processingTab) =>
                processingTab.id?.toString() ===
                getTabBeingListenedTo?.tabToRead
            )
          ) {
            setReturningToSingleTab(true);
          }

          if (
            getTabBeingListenedTo &&
            tabId.toString() !== getTabBeingListenedTo?.tabToRead
          ) {
            setIsCurrentTabBeingListenedTo(false);
            setTabFrames(null);
            setSelectedFrame(null);
            setLoading(false);
            setCanStartInspecting(false);
            return;
          } else {
            setIsCurrentTabBeingListenedTo(true);
            chrome.devtools.inspectedWindow.eval(
              'window.location.href',
              (result, isException) => {
                if (!isException && typeof result === 'string') {
                  setTabUrl(result);
                }
              }
            );
          }
        }
      }
      setLoading(false);
    },
    [tabId, getAllFramesForCurrentTab]
  );

  const getCookiesSetByJavascript = useCallback(async () => {
    if (tabId) {
      await setDocumentCookies(tabId.toString());
    }
  }, [tabId]);

  const exportFrameCookies = useCallback(() => {
    const cookies = filterCookiesByFrame(tabCookies, tabFrames, selectedFrame);
    const csvTextBlob = generateCookieTableCSV(cookies);

    saveAs(csvTextBlob, 'out.csv');
  }, [selectedFrame, tabCookies, tabFrames]);

  const changeListeningToThisTab = useCallback(() => {
    chrome.runtime.sendMessage({
      type: 'SET_TAB_TO_READ',
      payload: {
        tabId,
      },
    });
  }, [tabId]);

  useEffect(() => {
    const listener = (message: {
      type: string;
      payload: { tabId: number };
    }) => {
      if (message.type === 'syncCookieStore:SET_TAB_TO_READ') {
        chrome.devtools.inspectedWindow.eval(
          'window.location.href',
          (result, isException) => {
            if (!isException && typeof result === 'string') {
              setTabUrl(result);
            }
          }
        );

        setIsCurrentTabBeingListenedTo(true);
        setLoading(false);
        setCanStartInspecting(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        try {
          const nextURL = new URL(changeInfo.url);
          const nextDomain = nextURL?.hostname;
          const currentURL = new URL(tabUrl ?? '');
          const currentDomain = currentURL?.hostname;

          if (selectedFrame && nextDomain === currentDomain) {
            setSelectedFrame(nextURL.origin);
          } else {
            setSelectedFrame(null);
          }

          setTabUrl(changeInfo.url);
        } catch (error) {
          setSelectedFrame(null);
        } finally {
          setTabFrames(null);
          await getAllFramesForCurrentTab(_tabId);
        }
      }
    },
    [tabId, tabUrl, getAllFramesForCurrentTab, selectedFrame]
  );

  const tabRemovedListener = useCallback(async () => {
    const getTabBeingListenedTo = await chrome.storage.local.get();
    const availableTabs = await chrome.tabs.query({});

    if (
      availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
      availableTabs.filter(
        (processingTab) =>
          processingTab.id?.toString() === getTabBeingListenedTo?.tabToRead
      )
    ) {
      setReturningToSingleTab(true);
    }
  }, []);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  useEffect(() => {
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
    };
  }, [storeChangeListener, tabUpdateListener, tabRemovedListener]);

  useEffect(() => {
    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 6500);

    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          tabUrl,
          tabFrames,
          loading,
          selectedFrame,
          isCurrentTabBeingListenedTo,
          returningToSingleTab,
          contextInvalidated,
          isInspecting,
          canStartInspecting,
        },
        actions: {
          setSelectedFrame,
          changeListeningToThisTab,
          getCookiesSetByJavascript,
          exportFrameCookies,
          setIsInspecting,
          setContextInvalidated,
          setCanStartInspecting,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCookieStore(): CookieStoreContext;
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T | CookieStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
