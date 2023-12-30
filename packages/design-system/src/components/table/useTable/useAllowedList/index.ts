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
import { useRef, useEffect, useCallback } from 'react';
import { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { TableRow } from '..';

const useAllowedList = (
  domainsInAllowList: Set<string>,
  row: TableRow,
  setDomainsInAllowList: (domainList: Set<string>) => void
) => {
  const pageUrl = useRef<string>('');
  const isIncognito = useRef<boolean>(false);

  const domain =
    (row?.originalData as CookieTableData)?.parsedCookie?.domain ?? '';
  const isDomainInAllowList = domainsInAllowList.has(domain);

  const handleAllowListClick = useCallback(() => {
    if (pageUrl.current === '' || domain === '') {
      return;
    }

    const secondaryPattern = pageUrl.current.endsWith('/')
      ? pageUrl.current + '*'
      : pageUrl.current + '/*';

    let primaryPattern = domain;
    primaryPattern =
      '*://' +
      (primaryPattern.startsWith('.') ? '*' : '') +
      primaryPattern +
      '/*';

    const scope = isIncognito.current ? 'incognito_session_only' : 'regular';
    if (isDomainInAllowList) {
      chrome.contentSettings.cookies.clear({});
    } else {
      chrome.contentSettings.cookies
        .set({
          primaryPattern: primaryPattern,
          secondaryPattern: secondaryPattern,
          setting: 'session_only',
          scope: scope,
        })
        // @ts-ignore - The chrome-type definition is outdated,
        // this returns a promise instead of a void.
        .catch((error: Error) => {
          console.log(
            error.message,
            `Primary pattern: ${primaryPattern}  |  Secondary pattern: ${secondaryPattern}`
          );
        });
    }

    if (isDomainInAllowList) {
      domainsInAllowList.clear();
    } else {
      domainsInAllowList.add(domain);
    }

    setDomainsInAllowList(domainsInAllowList);
  }, [domain, domainsInAllowList, isDomainInAllowList, setDomainsInAllowList]);

  useEffect(() => {
    // @todo Is there an alternative way to do it?
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

      if (pageUrl.current !== '' && domain !== '') {
        let primaryUrl = domain;

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
                !domainsInAllowList.has(domain)
              ) {
                domainsInAllowList.add(domain);
                setDomainsInAllowList(domainsInAllowList);
              } else if (
                details.setting !== 'session_only' &&
                domainsInAllowList.has(domain)
              ) {
                domainsInAllowList.delete(domain);
                setDomainsInAllowList(domainsInAllowList);
              }
            }
          }
        );
      }
    });
  }, [domain, domainsInAllowList, isIncognito, row, setDomainsInAllowList]);

  return {
    handleAllowListClick,
    isDomainInAllowList,
  };
};

export default useAllowedList;
