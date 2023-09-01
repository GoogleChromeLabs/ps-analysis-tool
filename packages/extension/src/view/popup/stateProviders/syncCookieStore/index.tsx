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

/**
 * Internal dependencies.
 */
import {
  getCurrentTab,
  getCurrentTabId,
} from '../../../../utils/getCurrentTabId';
import type { CookiesCount } from '../../types';
import prepareCookiesCount from '../../../../utils/prepareCookiesCount';
import { CookieStore } from '../../../../localStore';
import { noop } from '../../../../utils/noop';
import { ALLOWED_NUMBER_OF_TABS } from '../../../../utils/constants';

export interface CookieStoreContext {
  state: {
    tabCookieStats: CookiesCount | null;
    isCurrentTabBeingListenedTo: boolean;
    loading: boolean;
    returningToSingleTab: boolean;
    showLoadingText: boolean;
    tabId: number | null;
    onChromeUrl: boolean;
    allowedNumberOfTabs: string | null;
    stopRequestProcessing: boolean;
  };
  actions: {
    changeListeningToThisTab: () => void;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookieStats: {
      total: 0,
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
    showLoadingText: false,
    returningToSingleTab: false,
    onChromeUrl: false,
    tabId: null,
    allowedNumberOfTabs: null,
    stopRequestProcessing: false,
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

  const [stopRequestProcessing, setStopRequestProcessing] =
    useState<boolean>(false);

  const [tabCookieStats, setTabCookieStats] =
    useState<CookieStoreContext['state']['tabCookieStats']>(null);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);

  const [showLoadingText, setShowLoadingText] = useState<boolean>(false);
  const [onChromeUrl, setOnChromeUrl] = useState<boolean>(false);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadingTextTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 6500);

    loadingTextTimeout.current = setTimeout(() => {
      setShowLoadingText(true);
    }, 2500);

    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }

      if (loadingTextTimeout.current) {
        clearTimeout(loadingTextTimeout.current);
      }
    };
  }, []);

  const setDebouncedStats = useDebouncedCallback((value) => {
    setTabCookieStats(value);
    setLoading(false);
    setShowLoadingText(false);
  }, 100);

  const intitialSync = useCallback(async () => {
    const [tab] = await getCurrentTab();

    const extensionStorage = await chrome.storage.sync.get();

    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
    if (extensionStorage?.stopRequestProcessing) {
      setStopRequestProcessing(
        extensionStorage?.stopRequestProcessing === 'true'
      );
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
    const _tabUrl = tab.url;

    setTabId(tab.id);
    setTabUrl(tab.url);

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
        tab?.id.toString() !== getTabBeingListenedTo?.tabToRead
      ) {
        setIsCurrentTabBeingListenedTo(false);
        setLoading(false);
        return;
      } else {
        setIsCurrentTabBeingListenedTo(true);
      }
    }

    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];

    if (tabData && tabData.cookies) {
      setDebouncedStats(prepareCookiesCount(tabData.cookies, _tabUrl));
    }
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
          prepareCookiesCount(
            changes[tabId.toString()].newValue.cookies,
            tabUrl
          )
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

  const changeSyncStorageListener = useCallback(async () => {
    const extensionStorage = await chrome.storage.sync.get();
    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
    if (extensionStorage?.stopRequestProcessing) {
      setStopRequestProcessing(
        extensionStorage?.stopRequestProcessing === 'true'
      );
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
          showLoadingText,
          tabId,
          returningToSingleTab,
          onChromeUrl,
          allowedNumberOfTabs,
          stopRequestProcessing,
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
