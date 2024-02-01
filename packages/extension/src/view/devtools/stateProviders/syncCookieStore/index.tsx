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
  UNKNOWN_FRAME_KEY,
} from '@ps-analysis-tool/common';

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
    tabToRead: string | null;
  };
  actions: {
    setSelectedFrame: (key: string | null) => void;
    setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
    changeListeningToThisTab: () => void;
    getCookiesSetByJavascript: () => void;
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
    tabToRead: null,
  },
  actions: {
    setSelectedFrame: noop,
    changeListeningToThisTab: noop,
    setIsInspecting: noop,
    getCookiesSetByJavascript: noop,
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
  const [tabToRead, setTabToRead] = useState<string | null>(null);
  const [contextInvalidated, setContextInvalidated] = useState<boolean>(false);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

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

  // This was converted to useRef because setting state was creating a race condition in rerendering the provider.
  const isCurrentTabBeingListenedToRef = useRef(false);

  const { allowedNumberOfTabs } = useSettingsStore(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

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

    setTabId(_tabId);

    if (isCurrentTabBeingListenedToRef.current) {
      await getAllFramesForCurrentTab(_tabId);
    }

    await setDocumentCookies(_tabId?.toString());

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabUrl(result);
        }
      }
    );

    setLoading(false);
  }, [getAllFramesForCurrentTab]);

  const getCookiesSetByJavascript = useCallback(async () => {
    if (tabId) {
      await setDocumentCookies(tabId.toString());
    }
  }, [tabId]);

  const changeListeningToThisTab = useCallback(() => {
    if (!tabId) {
      return;
    }
    chrome.runtime.sendMessage({
      type: 'DevTools::ServiceWorker::SET_TAB_TO_READ',
      payload: {
        tabId,
      },
    });
    setTabToRead(tabId.toString());
  }, [tabId]);

  useEffect(() => {
    if (
      !isCurrentTabBeingListenedToRef.current &&
      allowedNumberOfTabs === 'single' &&
      tabFrames &&
      Object.keys(tabFrames).length > 0
    ) {
      setTabFrames(null);
    }
  }, [allowedNumberOfTabs, tabFrames]);

  useEffect(() => {
    const listener = async (message: {
      type: string;
      payload: {
        tabId?: number;
        cookieData?: TabCookies;
        tabToRead?: string;
        tabMode?: string;
      };
    }) => {
      if (message.type === 'ServiceWorker::SET_TAB_TO_READ') {
        chrome.devtools.inspectedWindow.eval(
          'window.location.href',
          (result, isException) => {
            if (!isException && typeof result === 'string') {
              setTabUrl(result);
            }
          }
        );
        isCurrentTabBeingListenedToRef.current =
          tabId?.toString() === message?.payload?.tabId;
        setTabFrames(null);
        setLoading(false);
        setCanStartInspecting(false);
      }

      if (message.type === 'ServiceWorker::DevTools::INITIAL_SYNC') {
        if (message?.payload?.tabMode === 'unlimited') {
          isCurrentTabBeingListenedToRef.current = true;
          setTabToRead(null);
        } else {
          if (tabId?.toString() !== message?.payload?.tabToRead) {
            setTabFrames(null);
          }
          isCurrentTabBeingListenedToRef.current =
            tabId?.toString() === message?.payload?.tabToRead;
          setTabToRead(message?.payload?.tabToRead || null);
        }
      }

      if (message.type === 'ServiceWorker::DevTools::NEW_COOKIE_DATA') {
        const data = message?.payload?.cookieData ?? {};
        if (
          message?.payload?.tabId &&
          tabId?.toString() === message?.payload?.tabId.toString()
        ) {
          if (isCurrentTabBeingListenedToRef.current) {
            await getAllFramesForCurrentTab(tabId);
            setTabToRead(tabId.toString());
            setTabCookies(Object.keys(data).length > 0 ? data : null);
          } else {
            setTabFrames(null);
          }
        }
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [getAllFramesForCurrentTab, tabId]);

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        setIsInspecting(false);
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
    const availableTabs = await chrome.tabs.query({});

    if (
      availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
      availableTabs.filter(
        (processingTab) => processingTab.id?.toString() === tabToRead
      )
    ) {
      setReturningToSingleTab(true);
    }
  }, [tabToRead]);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
    };
  }, [tabUpdateListener, tabRemovedListener]);

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

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'DevTools::ServiceWorker::DEVTOOLS_STATE_OPEN',
      payload: {
        tabId: tabId,
      },
    });

    return () => {
      chrome.runtime.sendMessage({
        type: 'DevTools::ServiceWorker::DEVTOOLS_STATE_CLOSE',
        payload: {
          tabId: tabId,
        },
      });
    };
  }, [tabId]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          tabUrl,
          tabFrames,
          loading,
          selectedFrame,
          isCurrentTabBeingListenedTo: isCurrentTabBeingListenedToRef.current,
          returningToSingleTab,
          contextInvalidated,
          isInspecting,
          canStartInspecting,
          tabToRead,
        },
        actions: {
          setSelectedFrame,
          changeListeningToThisTab,
          getCookiesSetByJavascript,
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
