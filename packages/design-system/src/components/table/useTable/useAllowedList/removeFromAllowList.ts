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
 * Internal dependencies.
 */
import {
  CookieStore,
  type AllowedDomainObject,
} from '@ps-analysis-tool/extension/src/localStore';

/**
 * Remove object from allow list.
 * @param domainObject Object to be updated.
 * @returns Promise;
 */
const removeFromAllowList = (domainObject: AllowedDomainObject) => {
  chrome.contentSettings.cookies.clear({});

  return CookieStore.removeDomainFromAllowList(domainObject).then(
    (remainingAllowedDomainObjects) => {
      // Set remaining settings after removing one setting becuase chrome.contentSettings.cookies.clear({}); clears everything.
      remainingAllowedDomainObjects.forEach((domainObjectItem) => {
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
    }
  );
};

export default removeFromAllowList;
