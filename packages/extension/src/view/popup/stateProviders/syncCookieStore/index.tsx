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
  useRef,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { noop, prepareCookiesCount } from '@ps-analysis-tool/design-system';
import { type CookiesCount } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { getCurrentTab } from '../../../../utils/getCurrentTabId';
import { ALLOWED_NUMBER_OF_TABS } from '../../../../constants';

export interface CookieStoreContext {
  state: {
    tabCookieStats: CookiesCount | null;
    isCurrentTabBeingListenedTo: boolean;
    loading: boolean;
    returningToSingleTab: boolean;
    tabId: number | null;
    onChromeUrl: boolean;
    allowedNumberOfTabs: string | null;
  };
  actions: {
    changeListeningToThisTab: () => void;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookieStats: {
      total: 0,
      blockedCookies: {
        total: 0,
      },
      firstParty: {
        total: 0,
        functional: 0,
        marketing: 0,
        analytics: 0,
        uncategorized: 0,
      },
      thirdParty: {
        total: 0,
        functional: 0,
        marketing: 0,
        analytics: 0,
        uncategorized: 0,
      },
    },
    isCurrentTabBeingListenedTo: false,
    loading: true,
    returningToSingleTab: false,
    onChromeUrl: false,
    tabId: null,
    allowedNumberOfTabs: null,
  },
  actions: {
    changeListeningToThisTab: noop,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabUrl, setTabUrl] = useState<string | null>(null);

  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );

  const [tabCookieStats, setTabCookieStats] =
    useState<CookieStoreContext['state']['tabCookieStats']>(null);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);

  const [onChromeUrl, setOnChromeUrl] = useState<boolean>(false);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const setDebouncedStats = useDebouncedCallback((value) => {
    setTabCookieStats(value);
    setLoading(false);
  }, 100);

  const intitialSync = useCallback(async () => {
    const [tab] = await getCurrentTab();

    const extensionStorage = await chrome.storage.sync.get();

    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }

    if (!tab.id || !tab.url) {
      return;
    }

    if (tab.url.startsWith('chrome:')) {
      setOnChromeUrl(true);
    } else {
      setOnChromeUrl(false);
    }

    const _tabId = tab.id;

    setTabId(tab.id);
    setTabUrl(tab.url);

    if (extensionStorage?.allowedNumberOfTabs === 'single') {
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
        tab?.id.toString() !== getTabBeingListenedTo?.tabToRead
      ) {
        setIsCurrentTabBeingListenedTo(false);
        setLoading(false);
        return;
      } else {
        setIsCurrentTabBeingListenedTo(true);
      }
    }

    const tabData = (await chrome.storage.local.get([_tabId?.toString()]))[
      _tabId?.toString()
    ];

    if (tabData && tabData.cookies) {
      setDebouncedStats(prepareCookiesCount(tabData.cookies));
    }
    setLoading(false);
  }, [setDebouncedStats]);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        tabId &&
        tabUrl &&
        Object.keys(changes).includes(tabId.toString()) &&
        changes[tabId.toString()]?.newValue?.cookies
      ) {
        setDebouncedStats(
          prepareCookiesCount(changes[tabId.toString()].newValue.cookies)
        );
      }
      if (tabUrl) {
        if (tabUrl.startsWith('chrome:')) {
          setOnChromeUrl(true);
        } else {
          setOnChromeUrl(false);
        }
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
            setLoading(false);
            return;
          } else {
            setIsCurrentTabBeingListenedTo(true);
          }
        }
      }
    },
    [setDebouncedStats, tabId, tabUrl]
  );

  const changeListeningToThisTab = useCallback(() => {
    chrome.runtime.sendMessage({
      type: 'SET_TAB_TO_READ',
      payload: {
        tabId,
      },
    });
  }, [tabId]);

  useEffect(() => {
    const listener = async (message: {
      type: string;
      payload: { tabId: string };
    }) => {
      if (message.type === 'syncCookieStore:SET_TAB_TO_READ') {
        const tab = await getCurrentTab();

        if (tab?.[0]?.url) {
          setTabUrl(tab[0]?.url);
        }

        setIsCurrentTabBeingListenedTo(true);
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, []);

  const changeSyncStorageListener = useCallback(async () => {
    const extensionStorage = await chrome.storage.sync.get();
    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
  }, []);

  const tabUpdateListener = useCallback(
    (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        setTabUrl(changeInfo.url);
      }
    },
    [tabId]
  );

  useEffect(() => {
    intitialSync();
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
    };
  }, [
    intitialSync,
    storeChangeListener,
    tabUpdateListener,
    changeSyncStorageListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookieStats,
          isCurrentTabBeingListenedTo,
          loading,
          tabId,
          returningToSingleTab,
          onChromeUrl,
          allowedNumberOfTabs,
        },
        actions: {
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
