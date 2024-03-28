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

/**
 * Internal dependencies.
 */
import { getCurrentTab } from '../../../../utils/getCurrentTabId';
import { useCookie } from '../cookie';
import setDomainsInAllowList from './utils/setDomainsInAllowList';
import getDotPrefixedDomain from './utils/getDotPrefixedDomain';
import Context from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const { tabUrl, cookies } = useCookie(({ state }) => ({
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

export default Provider;
