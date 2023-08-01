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
import type { CookieData } from '../../../../localStore';
import { checkIbcCompliance } from '../../../../utils/checkIbcCompliance';

export interface CookieStoreContext {
  state: {
    tabCookies: {
      [key: string]: CookieData;
    } | null;
    tabUrl: string | null;
  };
  actions: object;
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
  },
  actions: {},
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);

  const [tabCookies, setTabCookies] =
    useState<CookieStoreContext['state']['tabCookies']>(null);

  const [tabUrl, setTabUrl] =
    useState<CookieStoreContext['state']['tabUrl']>(null);

  const intitialSync = useCallback(async () => {
    const _tabId = chrome.devtools.inspectedWindow.tabId;
    setTabId(_tabId);

    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];

    if (tabData && tabData.cookies) {
      const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
        {};

      await Promise.all(
        Object.entries(tabData.cookies as { [key: string]: CookieData }).map(
          async ([key, value]: [string, CookieData]) => {
            const isIbcCompliant = await checkIbcCompliance(
              value.parsedCookie.samesite,
              value.parsedCookie.secure,
              key,
              value.url
            );
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isIbcCompliant,
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
  }, []);

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
            const isIbcCompliant = await checkIbcCompliance(
              value.parsedCookie.samesite,
              value.parsedCookie.secure,
              key,
              value.url
            );
            const isCookieSet = Boolean(
              await chrome.cookies.get({ name: key, url: value.url })
            );
            _cookies[key] = {
              ...value,
              isIbcCompliant,
              isCookieSet,
            };
          })
        );

        setTabCookies(_cookies);
      }
    },
    [tabId]
  );

  const tabUpdateListener = useCallback(
    (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        setTabUrl(changeInfo.url);
      }
    },
    [tabId]
  );

  const cookieChangeListener = useCallback(
    async (changeInfo: chrome.cookies.CookieChangeInfo) => {
      if (
        tabCookies &&
        Object.keys(tabCookies).includes(changeInfo.cookie.name)
      ) {
        const isIbcCompliant = await checkIbcCompliance(
          changeInfo.cookie.sameSite,
          changeInfo.cookie.secure,
          changeInfo.cookie.name,
          tabCookies[changeInfo.cookie.name].url
        );

        const isCookieSet = Boolean(
          await chrome.cookies.get({
            name: changeInfo.cookie.name,
            url: tabCookies[changeInfo.cookie.name].url,
          })
        );

        const newCookieData = {
          ...tabCookies[changeInfo.cookie.name],
          isIbcCompliant,
          isCookieSet,
        };

        setTabCookies({
          ...tabCookies,
          [changeInfo.cookie.name]: newCookieData,
        });
      }
    },
    [tabCookies]
  );

  useEffect(() => {
    intitialSync();
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.cookies.onChanged.addListener(cookieChangeListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.cookies.onChanged.removeListener(cookieChangeListener);
    };
  }, [
    cookieChangeListener,
    intitialSync,
    storeChangeListener,
    tabUpdateListener,
  ]);

  return (
    <Context.Provider
      value={{
        state: { tabCookies, tabUrl },
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
