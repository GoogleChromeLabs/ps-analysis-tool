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
import { useRef, useEffect, useState } from 'react';
import { CookieTableData } from '@ps-analysis-tool/common';
import {
  CookieStore,
  type AllowedDomainObject,
} from '@ps-analysis-tool/extension/src/localStore';

/**
 * Internal dependencies.
 */
import type { TableRow } from '..';
import handleAllowListClick from './handlAllowListClick';

const useAllowedList = (
  row: TableRow,
  domainsInAllowList: Set<string>,
  setDomainsInAllowList: (domainList: Set<string>) => void
) => {
  const pageUrl = useRef<string>('');
  const isIncognito = useRef<boolean>(false);

  const [parentDomain, setParentDomain] = useState<string>('');

  const rowDomain =
    (row?.originalData as CookieTableData)?.parsedCookie?.domain ?? '';

  const isDomainInAllowList = domainsInAllowList.has(rowDomain);
  const allowListSessionStorage = CookieStore.getDomainsInAllowList();

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      if (currentTab?.url) {
        try {
          const origin = new URL(currentTab.url).origin;
          if (pageUrl.current !== origin) {
            pageUrl.current = origin;
          }
        } catch (e) {
          // Ignore.
        }
      }

      if (currentTab?.incognito) {
        isIncognito.current = currentTab.incognito;
      }
    });
  }, []);

  useEffect(() => {
    if (!pageUrl.current && rowDomain) {
      return;
    }

    let primaryUrl = rowDomain;

    primaryUrl = primaryUrl.startsWith('.')
      ? `https://${primaryUrl.substring(1)}/`
      : `https://${primaryUrl}/`;

    chrome.contentSettings.cookies.get(
      {
        primaryUrl: primaryUrl,
        secondaryUrl: pageUrl.current,
        incognito: isIncognito.current,
      },
      (details) => {
        if (details?.setting) {
          if (
            details.setting === 'session_only' &&
            !domainsInAllowList.has(rowDomain)
          ) {
            domainsInAllowList.add(rowDomain);
            setDomainsInAllowList(new Set([...domainsInAllowList]));
          } else if (
            details.setting !== 'session_only' &&
            domainsInAllowList.has(rowDomain)
          ) {
            domainsInAllowList.delete(rowDomain);
            setDomainsInAllowList(new Set([...domainsInAllowList]));
          }
        }
      }
    );
  }, [rowDomain, isIncognito, domainsInAllowList, setDomainsInAllowList]);

  useEffect(() => {
    // Set whether the domain is a subdomain match or the exact match.
    allowListSessionStorage.then(
      (allowedDomainObjects: AllowedDomainObject[]) => {
        let parentDomainValue = '';

        if (!allowedDomainObjects || allowedDomainObjects?.length === 0) {
          return;
        }

        for (let i = 0; i < allowedDomainObjects.length; i++) {
          const storedAllowedDomain = allowedDomainObjects[i].primaryDomain;
          // For example xyz.bbc.com and .bbc.com
          if (
            rowDomain.endsWith(storedAllowedDomain) &&
            rowDomain !== storedAllowedDomain
          ) {
            parentDomainValue = storedAllowedDomain;
            break;
          }
        }

        // For example .bbc.com will be parent domain of xyz.bbc.com
        if (parentDomain !== parentDomainValue) {
          setParentDomain(parentDomainValue);
        }
      }
    );
  }, [allowListSessionStorage, rowDomain, parentDomain]);

  const onAllowListClick = (domainOrParentDomain: string) =>
    handleAllowListClick(
      domainOrParentDomain,
      pageUrl.current,
      isIncognito.current,
      isDomainInAllowList,
      domainsInAllowList,
      setDomainsInAllowList
    );

  return {
    parentDomain,
    onAllowListClick,
    isDomainInAllowList,
  };
};

export default useAllowedList;
