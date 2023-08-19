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
import { getCurrentTab } from '../../../../utils/getCurrentTabId';
import type { CookiesCount } from '../../types';
import prepareCookiesCount from '../../../../utils/prepareCookiesCount';

export interface CookieStoreContext {
  state: {
    tabCookieStats: CookiesCount | null;
    loading: boolean;
    showLoadingText: boolean;
  };
  actions: object;
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
    loading: true,
    showLoadingText: false,
  },
  actions: {},
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabUrl, setTabUrl] = useState<string | null>(null);

  const [tabCookieStats, setTabCookieStats] =
    useState<CookieStoreContext['state']['tabCookieStats']>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [showLoadingText, setShowLoadingText] = useState<boolean>(false);

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
    if (!tab.id || !tab.url) {
      return;
    }
    const _tabId = tab.id;
    const _tabUrl = tab.url;

    setTabId(tab.id);
    setTabUrl(tab.url);

    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];

    if (tabData && tabData.cookies) {
      setDebouncedStats(prepareCookiesCount(tabData.cookies, _tabUrl));
    }
  }, [setDebouncedStats]);

  const storeChangeListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
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
    },
    [setDebouncedStats, tabId, tabUrl]
  );

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
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
    };
  }, [intitialSync, storeChangeListener, tabUpdateListener]);

  return (
    <Context.Provider
      value={{
        state: { tabCookieStats, loading, showLoadingText },
        actions: {},
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
