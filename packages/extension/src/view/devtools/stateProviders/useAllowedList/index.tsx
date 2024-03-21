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
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  noop,
  createContext,
  useContextSelector,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { getCurrentTab } from '../../../../utils/getCurrentTabId';
import { useCookieStore } from '../syncCookieStore';
import setDomainsInAllowList from './utils/setDomainsInAllowList';
import getDotPrefixedDomain from './utils/getDotPrefixedDomain';

export interface AllowedListContext {
  state: {
    domainsInAllowList: Set<string>;
    isIncognito: boolean;
  };
  actions: {
    setDomainsInAllowListCallback: (list: Set<string>) => void;
  };
}

const initialState: AllowedListContext = {
  state: {
    domainsInAllowList: new Set(),
    isIncognito: false,
  },
  actions: {
    setDomainsInAllowListCallback: noop,
  },
};

export const Context = createContext<AllowedListContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const { tabUrl, cookies } = useCookieStore(({ state }) => ({
    tabUrl: state.tabUrl,
    cookies: state.tabCookies,
  }));

  const isIncognito = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      const tabs = await getCurrentTab();

      if (tabs?.length) {
        isIncognito.current = tabs[0].incognito;
      }
    })();
  }, []);

  const [domainsInAllowList, setDomainsInAllowListCallback] = useState<
    Set<string>
  >(new Set());

  const domainsInAllowListRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    domainsInAllowListRef.current = domainsInAllowList;
  }, [domainsInAllowList]);

  useEffect(() => {
    (async () => {
      const setter = (list: Set<string>) => {
        domainsInAllowListRef.current = list;
      };

      await Promise.all(
        Object.values(cookies || {}).map(async (cookie) => {
          if (cookie.parsedCookie?.domain) {
            const domain = getDotPrefixedDomain(
              cookie.parsedCookie.domain || ''
            );

            let isDomainInAllowList = domainsInAllowListRef.current.has(domain);

            if (!isDomainInAllowList) {
              isDomainInAllowList = [...domainsInAllowListRef.current].some(
                (storedDomain) => {
                  // For example xyz.bbc.com and .bbc.com
                  return (
                    domain.endsWith(storedDomain) && domain !== storedDomain
                  );
                }
              );
            }

            await setDomainsInAllowList(
              tabUrl || '',
              isIncognito.current,
              domain,
              domainsInAllowListRef.current,
              setter
            );
          }
        })
      );

      setDomainsInAllowListCallback(domainsInAllowListRef.current);
    })();
  }, [cookies, tabUrl]);

  return (
    <Context.Provider
      value={{
        state: {
          domainsInAllowList,
          isIncognito: isIncognito.current,
        },
        actions: {
          setDomainsInAllowListCallback,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useAllowedList(): AllowedListContext;
export function useAllowedList<T>(
  selector: (state: AllowedListContext) => T
): T;

/**
 * Allowed list hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useAllowedList<T>(
  selector: (state: AllowedListContext) => T | AllowedListContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
