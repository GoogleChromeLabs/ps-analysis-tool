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
import { prepareCookiesCount } from '@google-psat/design-system';
import { type CookieData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { getCurrentTab } from '../../../../utils/getCurrentTab';
import {
  INITIAL_SYNC,
  NEW_COOKIE_DATA,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
} from '../../../../constants';
import { useSettings } from '../settings';
import Context, { type CookieStoreContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabCookieStats, setTabCookieStats] =
    useState<CookieStoreContext['state']['tabCookieStats']>(null);

  const [loading, setLoading] = useState<boolean>(true);

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
    const tab = await getCurrentTab(true);

    if (!tab || !tab.id || !tab.url) {
      return;
    }

    if (tab.url.startsWith('chrome:')) {
      setOnChromeUrl(true);
    } else {
      setOnChromeUrl(false);
    }

    setTabId(tab.id);
  }, []);

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

  useEffect(() => {
    const listener = (message: {
      type: string;
      payload: {
        tabId?: number;
        cookieData?: { [key: string]: CookieData };
        tabProcessingMode?: string;
        isUsingCDPNewValue?: boolean;
      };
    }) => {
      if (!message.type) {
        return;
      }

      const incomingMessageType = message.type;

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
          loading,
          tabId,
          onChromeUrl,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
