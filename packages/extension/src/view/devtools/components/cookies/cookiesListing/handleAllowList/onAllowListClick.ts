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

import { CookieStore } from '../../../../../../localStore';

const onAllowListClick = (
  domainForAllowList: string,
  pageUrl: string,
  isIncognito: boolean,
  isDomainInAllowList: boolean,
  domainsInAllowList: Set<string>,
  setDomainsInAllowList: (list: Set<string>) => void
) => {
  if (!pageUrl || !domainForAllowList) {
    return;
  }

  const secondaryPattern = pageUrl.endsWith('/')
    ? pageUrl + '*'
    : pageUrl + '/*';

  let primaryPattern = domainForAllowList;

  primaryPattern =
    'https://' +
    (primaryPattern.startsWith('.') ? '*' : '') +
    primaryPattern +
    '/*';

  const scope = isIncognito ? 'incognito_session_only' : 'regular';
  const domainObject = {
    primaryDomain: domainForAllowList,
    primaryPattern,
    secondaryPattern,
    scope,
  };

  if (isDomainInAllowList) {
    domainsInAllowList.delete(domainForAllowList);
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
            .catch(() => {
              // console.log(
              //   error.message,
              //   `Primary pattern: ${domainObjectItem.primaryPattern}`,
              //   `Secondary pattern: ${domainObjectItem.secondaryPattern}`
              // );
            });
        });
      });
    });
  } else {
    CookieStore.getDomainsInAllowList()
      .then((listOfDomainObject) => {
        // console.log(listOfDomainObject, domainForAllowList);
        listOfDomainObject.forEach((domainObjectItem) => {
          // Check if more specific patterns was added to allow-list,
          // and remove it as the general pattern will be applied.
          if (
            domainObjectItem.primaryDomain.endsWith(domainForAllowList) ||
            `.${domainObjectItem.primaryDomain}` === domainForAllowList
          ) {
            domainsInAllowList.delete(domainObjectItem.primaryDomain);
            chrome.contentSettings.cookies.clear({});

            CookieStore.removeDomainFromAllowList(domainObjectItem).then(() => {
              // Set remaining settings after removing one setting.
              CookieStore.getDomainsInAllowList().then(
                (newListOfDomainObject) => {
                  newListOfDomainObject.forEach((newDomainObjectItem) => {
                    chrome.contentSettings.cookies
                      .set({
                        primaryPattern: newDomainObjectItem.primaryPattern,
                        secondaryPattern: newDomainObjectItem.secondaryPattern,
                        setting: 'session_only',
                        scope: newDomainObjectItem.scope as
                          | 'incognito_session_only'
                          | 'regular',
                      })
                      // @ts-ignore - The chrome-type definition is outdated,
                      // this returns a promise instead of a void.
                      .catch(() => {
                        // console.log(
                        //   error.message,
                        //   `Primary pattern: ${newDomainObjectItem.primaryPattern}`,
                        //   `Secondary pattern: ${newDomainObjectItem.secondaryPattern}`
                        // );
                      });
                  });
                }
              );
            });
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
            CookieStore.addDomainToAllowList(domainObject);
          })
          .catch(() => {
            // console.log(
            //   error.message,
            //   `Primary pattern: ${primaryPattern}`,
            //   `Secondary pattern: ${secondaryPattern}`
            // );
          });
      });
  }
  setDomainsInAllowList(domainsInAllowList);
};

export default onAllowListClick;
