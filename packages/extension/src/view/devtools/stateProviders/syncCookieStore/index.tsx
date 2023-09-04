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
import { useContextSelector, createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
} from 'react';

/**
 * Internal dependencies.
 */
import { CookieStore, type CookieData } from '../../../../localStore';
import type { TabCookies, TabFrames } from '../../cookies.types';
import { noop } from '../../../../utils/noop';
import { getCurrentTabId } from '../../../../utils/getCurrentTabId';
import { ALLOWED_NUMBER_OF_TABS } from '../../../../utils/constants';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
    returningToSingleTab: boolean;
    isCurrentTabBeingListenedTo: boolean;
    allowedNumberOfTabs: string | null;
  };
  actions: {
    setSelectedFrame: React.Dispatch<React.SetStateAction<string | null>>;
    changeListeningToThisTab: () => void;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
    tabFrames: null,
    selectedFrame: null,
    isCurrentTabBeingListenedTo: false,
    returningToSingleTab: false,
    allowedNumberOfTabs: null,
  },
  actions: {
    setSelectedFrame: noop,
    changeListeningToThisTab: noop,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);
  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );

  const [tabCookies, setTabCookies] =
    useState<CookieStoreContext['state']['tabCookies']>(null);

  const [selectedFrame, setSelectedFrame] =
    useState<CookieStoreContext['state']['selectedFrame']>(null);

  const [tabUrl, setTabUrl] =
    useState<CookieStoreContext['state']['tabUrl']>(null);
  const [tabFrames, setTabFrames] =
    useState<CookieStoreContext['state']['tabFrames']>(null);

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

      setTabFrames((prevState) => {
        const modifiedTabFrames: {
          [key: string]: { frameIds: number[] };
        } = {
          ...prevState,
        };

        currentTabFrames?.forEach(({ url, frameId }) => {
          if (url && url.includes('http')) {
            const parsedUrl = regexForFrameUrl.exec(url);
            if (parsedUrl && parsedUrl[0]) {
              if (modifiedTabFrames[parsedUrl[0]]) {
                modifiedTabFrames[parsedUrl[0]].frameIds.push(frameId);
              } else {
                modifiedTabFrames[parsedUrl[0]] = { frameIds: [frameId] };
              }
            }
          }
        });

        return modifiedTabFrames;
      });
    },
    []
  );

  const intitialSync = useCallback(async () => {
    const _tabId = chrome.devtools.inspectedWindow.tabId;
    await getAllFramesForCurrentTab(_tabId);
    setTabId(_tabId);

    const extensionStorage = await chrome.storage.sync.get();

    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }

    if (_tabId) {
      if (extensionStorage?.allowedNumberOfTabs === 'single-tab') {
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
          return;
        } else {
          setIsCurrentTabBeingListenedTo(true);
        }
      }
    }

    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];

    if (tabData && tabData.cookies) {
      const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
        {};

      await Promise.all(
        Object.entries(tabData.cookies as { [key: string]: CookieData }).map(
          async ([key, value]: [string, CookieData]) => {
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isCookieSet,
            };
          }
        )
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
  }, [getAllFramesForCurrentTab]);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        tabId &&
        Object.keys(changes).includes(tabId.toString()) &&
        changes[tabId.toString()]?.newValue?.cookies
      ) {
        const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
          {};

        await Promise.all(
          Object.entries(
            changes[tabId.toString()].newValue.cookies as {
              [key: string]: CookieData;
            }
          ).map(async ([key, value]) => {
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isCookieSet,
            };
          })
        );
        await getAllFramesForCurrentTab(tabId);
        setTabCookies(_cookies);
      }

      if (tabId) {
        const extensionStorage = await chrome.storage.sync.get();

        if (extensionStorage?.allowedNumberOfTabs === 'single-tab') {
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
            return;
          } else {
            setIsCurrentTabBeingListenedTo(true);
            chrome.tabs.query({ active: true }, (tab) => {
              if (tab[0]?.url) {
                setTabUrl(tab[0]?.url);
              }
            });
          }
        }
      }
    },
    [tabId, getAllFramesForCurrentTab]
  );

  const changeListeningToThisTab = useCallback(async () => {
    const changedTabId = await getCurrentTabId();
    if (!changedTabId) {
      return;
    }
    await CookieStore.addTabData(changedTabId?.toString());
    const storedTabData = Object.keys(await chrome.storage.local.get());
    // eslint-disable-next-line guard-for-in
    storedTabData.map(async (tabIdToBeDeleted) => {
      if (
        tabIdToBeDeleted !== changedTabId &&
        tabIdToBeDeleted !== 'tabToRead'
      ) {
        await CookieStore.removeTabData(tabIdToBeDeleted);
        await chrome.action.setBadgeText({
          tabId: parseInt(tabIdToBeDeleted),
          text: '',
        });
      }
      return Promise.resolve();
    });

    chrome.tabs.query({ active: true }, (tab) => {
      if (tab[0]?.url) {
        setTabUrl(tab[0]?.url);
      }
    });

    await chrome.tabs.reload(Number(changedTabId));
    setIsCurrentTabBeingListenedTo(true);
  }, []);

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        setTabUrl(changeInfo.url);
        setSelectedFrame(null);
        setTabFrames(null);
        await getAllFramesForCurrentTab(_tabId);
      }
    },
    [tabId, getAllFramesForCurrentTab]
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

  const changeSyncStorageListener = useCallback(async () => {
    const extensionStorage = await chrome.storage.sync.get();
    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
  }, []);

  useEffect(() => {
    intitialSync();
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
    };
  }, [
    intitialSync,
    storeChangeListener,
    tabUpdateListener,
    tabRemovedListener,
    changeSyncStorageListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          tabUrl,
          tabFrames,
          selectedFrame,
          isCurrentTabBeingListenedTo,
          returningToSingleTab,
          allowedNumberOfTabs,
        },
        actions: {
          setSelectedFrame,
          changeListeningToThisTab,
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
