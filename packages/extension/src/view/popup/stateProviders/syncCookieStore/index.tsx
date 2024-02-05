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
import { type CookieData, type CookiesCount } from '@ps-analysis-tool/common';

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
    isUsingCDP: boolean;
  };
  actions: {
    changeListeningToThisTab: () => void;
    setIsUsingCDP: (newValue: boolean) => void;
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
    isUsingCDP: false,
  },
  actions: {
    changeListeningToThisTab: noop,
    setIsUsingCDP: noop,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );

  const [tabToRead, setTabToRead] = useState<string>('');
  const [isUsingCDP, setIsUsingCDP] = useState(false);

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

  const _setUsingCDP = useCallback((newValue: boolean) => {
    chrome.runtime.sendMessage({
      type: 'Popup::ServiceWorker::CHANGE_CDP_SETTING',
      payload: {
        isUsingCDP: newValue,
      },
    });
    setIsUsingCDP(newValue);
  }, []);

  const intitialSync = useCallback(async () => {
    const tab = await getCurrentTab();

    const extensionStorage = await chrome.storage.sync.get();

    if (Object.keys(extensionStorage).includes('allowedNumberOfTabs')) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
    if (Object.keys(extensionStorage).includes('isUsingCDP')) {
      setIsUsingCDP(extensionStorage?.isUsingCDP);
    }

    const availableTabs = await chrome.tabs.query({});

    if (
      availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
      availableTabs.filter(
        (processingTab) => processingTab.id?.toString() === tabToRead
      )
    ) {
      setReturningToSingleTab(true);
    }

    if (!tab || !tab[0].id || !tab[0].url) {
      return;
    }

    if (tab[0].url.startsWith('chrome:')) {
      setOnChromeUrl(true);
    } else {
      setOnChromeUrl(false);
    }

    setTabId(tab[0].id);
  }, [tabToRead]);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'Popup::ServiceWorker::POPUP_STATE_OPEN',
      payload: {
        tabId: tabId,
      },
    });

    return () => {
      chrome.runtime.sendMessage({
        type: 'Popup::ServiceWorker::POPUP_STATE_CLOSE',
        payload: {
          tabId: tabId,
        },
      });
    };
  }, [tabId]);

  const changeListeningToThisTab = useCallback(() => {
    chrome.runtime.sendMessage({
      type: 'Popup::ServiceWorker::SET_TAB_TO_READ',
      payload: {
        tabId,
      },
    });
  }, [tabId]);

  useEffect(() => {
    const listener = (message: {
      type: string;
      payload: {
        tabId?: string;
        cookieData?: { [key: string]: CookieData };
        tabToRead?: string;
        tabProcessingMode?: string;
        isUsingCDPNewValue?: boolean;
        tabMode?: string;
      };
    }) => {
      if (message.type === 'ServiceWorker::SET_TAB_TO_READ') {
        setTabToRead(message?.payload?.tabId || '');
        setIsCurrentTabBeingListenedTo(true);
        setLoading(false);
      }

      if (
        message.type === 'ServiceWorker::Popup::CHANGE_CDP_SETTING' &&
        typeof message?.payload?.isUsingCDPNewValue !== 'undefined'
      ) {
        setIsUsingCDP(message?.payload?.isUsingCDPNewValue);
      }

      if (message.type === 'ServiceWorker::Popup::NEW_COOKIE_DATA') {
        if (
          message?.payload?.tabId &&
          tabId?.toString() === message?.payload?.tabId.toString()
        ) {
          setTabCookieStats(
            prepareCookiesCount(message?.payload?.cookieData ?? null)
          );
          setLoading(false);
        }
      }

      if (message.type === 'ServiceWorker::Popup::INITIAL_SYNC') {
        if (message?.payload?.tabMode === 'unlimited') {
          setIsCurrentTabBeingListenedTo(true);
          setTabToRead('');
        } else {
          setIsCurrentTabBeingListenedTo(
            tabId?.toString() === message?.payload?.tabToRead
          );
          setTabToRead(message?.payload?.tabToRead || '');
        }
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [setDebouncedStats, tabId, allowedNumberOfTabs]);

  const changeSyncStorageListener = useCallback(async () => {
    const extensionStorage = await chrome.storage.sync.get();
    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
  }, []);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  useEffect(() => {
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    return () => {
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
    };
  }, [changeSyncStorageListener]);

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
          isUsingCDP,
        },
        actions: {
          changeListeningToThisTab,
          setIsUsingCDP: _setUsingCDP,
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
