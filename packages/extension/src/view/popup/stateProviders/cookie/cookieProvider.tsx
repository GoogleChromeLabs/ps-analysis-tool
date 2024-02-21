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
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { prepareCookiesCount } from '@ps-analysis-tool/design-system';
import { type CookieData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { getCurrentTab } from '../../../../utils/getCurrentTabId';
import {
  ALLOWED_NUMBER_OF_TABS,
  INITIAL_SYNC,
  NEW_COOKIE_DATA,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SET_TAB_TO_READ,
} from '../../../../constants';
import { useSettings } from '../settings';
import Context, { type CookieStoreContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabToRead, setTabToRead] = useState<string | null>(null);
  const [tabCookieStats, setTabCookieStats] =
    useState<CookieStoreContext['state']['tabCookieStats']>(null);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const [loading, setLoading] = useState<boolean>(true);

  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);

  const [onChromeUrl, setOnChromeUrl] = useState<boolean>(false);

  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { setSettingsChanged } = useSettings(({ actions }) => ({
    setSettingsChanged: actions.setSettingsChanged,
  }));

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
    const tab = await getCurrentTab();

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
      type: POPUP_OPEN,
      payload: {
        tabId: tabId,
      },
    });

    return () => {
      chrome.runtime.sendMessage({
        type: POPUP_CLOSE,
        payload: {
          tabId: tabId,
        },
      });
    };
  }, [tabId]);

  const changeListeningToThisTab = useCallback(() => {
    chrome.runtime.sendMessage({
      type: SET_TAB_TO_READ,
      payload: {
        tabId,
      },
    });
  }, [tabId]);

  useEffect(() => {
    const listener = (message: {
      type: string;
      payload: {
        tabId?: number;
        cookieData?: { [key: string]: CookieData };
        tabToRead?: string;
        tabProcessingMode?: string;
        isUsingCDPNewValue?: boolean;
        tabMode?: string;
      };
    }) => {
      if (!message.type) {
        return;
      }

      const incomingMessageType = message.type;

      if (SET_TAB_TO_READ === incomingMessageType) {
        setTabToRead(message?.payload?.tabId?.toString() || null);
        setIsCurrentTabBeingListenedTo(true);
        setLoading(false);
      }

      if (NEW_COOKIE_DATA === incomingMessageType) {
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

      if (INITIAL_SYNC === incomingMessageType) {
        if (message?.payload?.tabMode === 'unlimited') {
          setIsCurrentTabBeingListenedTo(true);
          setTabToRead(null);
        } else {
          setIsCurrentTabBeingListenedTo(
            tabId?.toString() === message?.payload?.tabToRead
          );
          setTabToRead(message?.payload?.tabToRead || null);
        }
        setLoading(false);
      }

      if (SERVICE_WORKER_RELOAD_MESSAGE === incomingMessageType) {
        setSettingsChanged(false);
      }
    };

    chrome.runtime.onMessage.addListener(listener);

    return () => {
      chrome.runtime.onMessage.removeListener(listener);
    };
  }, [setDebouncedStats, tabId, setSettingsChanged]);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

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

export default Provider;
