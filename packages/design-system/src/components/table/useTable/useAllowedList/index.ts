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
import { useRef, useEffect, useCallback, useState } from 'react';
import { CookieTableData } from '@ps-analysis-tool/common';
import { CookieStore } from '@ps-analysis-tool/extension/src/localStore';

/**
 * Internal dependencies.
 */
import type { TableRow } from '..';

const useAllowedList = (
  row: TableRow,
  domainsInAllowList: Set<string>,
  setDomainsInAllowList: (domainList: Set<string>) => void
) => {
  const pageUrl = useRef<string>('');
  const isIncognito = useRef<boolean>(false);

  const [parentDomain, setParentDomain] = useState<string>('');

  const domain =
    (row?.originalData as CookieTableData)?.parsedCookie?.domain ?? '';

  const isDomainInAllowList = domainsInAllowList.has(domain);
  const allowListSessionStorage = CookieStore.getDomainsInAllowList();

  const onAllowListClick = useCallback(
    (domainForAllowList: string) => {
      if (pageUrl.current === '' || domainForAllowList === '') {
        return;
      }

      const secondaryPattern = pageUrl.current.endsWith('/')
        ? pageUrl.current + '*'
        : pageUrl.current + '/*';

      let primaryPattern = domainForAllowList;

      primaryPattern =
        'https://' +
        (primaryPattern.startsWith('.') ? '*' : '') +
        primaryPattern +
        '/*';

      const scope = isIncognito.current ? 'incognito_session_only' : 'regular';
      const domainObject = {
        primaryDomain: domainForAllowList,
        primaryPattern,
        secondaryPattern,
        scope,
      };

      if (isDomainInAllowList) {
        domainsInAllowList.delete(domainForAllowList);
        setDomainsInAllowList(domainsInAllowList);
        chrome.contentSettings.cookies.clear({});

        CookieStore.removeDomainFromAllowList(domainObject).then(() => {
          // Set remaining settings after removing one setting.
          CookieStore.getDomainsInAllowList().then((listOfDomainObject) => {
            listOfDomainObject.forEach((domainObjectItem) => {
              chrome.contentSettings.cookies
                .set({
                  primaryPattern: domainObjectItem.primaryPattern,
                  secondaryPattern: domainObjectItem.secondaryPattern,
                  setting: 'session_only',
                  scope: domainObjectItem.scope as
                    | 'incognito_session_only'
                    | 'regular',
                })
                // @ts-ignore - The chrome-type definition is outdated,
                // this returns a promise instead of a void.
                .catch((error: Error) => {
                  console.log(
                    error.message,
                    `Primary pattern: ${domainObjectItem.primaryPattern}`,
                    `Secondary pattern: ${domainObjectItem.secondaryPattern}`
                  );
                });
            });
          });
        });

        return;
      }

      CookieStore.getDomainsInAllowList()
        .then((listOfDomainObject) => {
          console.log(listOfDomainObject, domainForAllowList);
          listOfDomainObject.forEach((domainObjectItem) => {
            // Check if more specific patterns was added to allow-list,
            // and remove it as the general pattern will be applied.
            if (
              domainObjectItem.primaryDomain.endsWith(domainForAllowList) ||
              `.${domainObjectItem.primaryDomain}` === domainForAllowList
            ) {
              domainsInAllowList.delete(domainObjectItem.primaryDomain);
              chrome.contentSettings.cookies.clear({});

              CookieStore.removeDomainFromAllowList(domainObjectItem).then(
                () => {
                  // Set remaining settings after removing one setting.
                  CookieStore.getDomainsInAllowList().then(
                    (newListOfDomainObject) => {
                      newListOfDomainObject.forEach((newDomainObjectItem) => {
                        chrome.contentSettings.cookies
                          .set({
                            primaryPattern: newDomainObjectItem.primaryPattern,
                            secondaryPattern:
                              newDomainObjectItem.secondaryPattern,
                            setting: 'session_only',
                            scope: newDomainObjectItem.scope as
                              | 'incognito_session_only'
                              | 'regular',
                          })
                          // @ts-ignore - The chrome-type definition is outdated,
                          // this returns a promise instead of a void.
                          .catch((error: Error) => {
                            console.log(
                              error.message,
                              `Primary pattern: ${newDomainObjectItem.primaryPattern}`,
                              `Secondary pattern: ${newDomainObjectItem.secondaryPattern}`
                            );
                          });
                      });
                    }
                  );
                }
              );
            }
          });
        })
        .then(() => {
          chrome.contentSettings.cookies
            .set({
              primaryPattern,
              secondaryPattern,
              setting: 'session_only',
              scope,
            })
            // @ts-ignore - The chrome-type definition is outdated,
            // this returns a promise instead of a void.
            .then(() => {
              domainsInAllowList.add(domainForAllowList);
              setDomainsInAllowList(domainsInAllowList);
              CookieStore.addDomainToAllowList(domainObject);
            })
            .catch((error: Error) => {
              console.log(
                error.message,
                `Primary pattern: ${primaryPattern}`,
                `Secondary pattern: ${secondaryPattern}`
              );
            });
        });
    },
    [isDomainInAllowList, domainsInAllowList, setDomainsInAllowList]
  );

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
    if (!pageUrl.current && domain) {
      return;
    }

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

    // Set whether the domain is a subdomain match or the exact match.
    allowListSessionStorage.then((listOfDomainObject) => {
      let parentDomainValue = '';
      const numberOfDomainsInAllowList = listOfDomainObject
        ? listOfDomainObject.length
        : 0;

      for (let i = 0; i < numberOfDomainsInAllowList; i++) {
        if (
          domain.endsWith(listOfDomainObject[i].primaryDomain) &&
          domain !== listOfDomainObject[i].primaryDomain
        ) {
          parentDomainValue = listOfDomainObject[i].primaryDomain;
          break;
        }
      }

      if (parentDomain !== parentDomainValue) {
        setParentDomain(parentDomainValue);
      }
    });
  }, [
    row,
    domain,
    isIncognito,
    domainsInAllowList,
    setDomainsInAllowList,
    allowListSessionStorage,
    parentDomain,
  ]);

  return {
    parentDomain,
    onAllowListClick,
    isDomainInAllowList,
  };
};

export default useAllowedList;
