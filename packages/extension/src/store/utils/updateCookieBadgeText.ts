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
 * External dependencies
 */
import type { CookieData } from '@google-psat/common';
/**
 * Update cookie badge text.
 * @param storage {object} The storage object from local store.
 * @param tabId {string} The tabId of the the tab where badge text need to be updated.
 */
export default function updateCookieBadgeText(
  storage: {
    [key: string]: CookieData;
  },
  tabId: string
) {
  try {
    if (!tabId) {
      return;
    }

    const numCookies = Object.keys(storage).filter(
      (cookieKey) =>
        storage?.[cookieKey]?.parsedCookie &&
        storage?.[cookieKey]?.frameIdList &&
        storage?.[cookieKey]?.frameIdList?.length >= 0
    ).length;

    if (numCookies >= 0) {
      chrome.action.setBadgeText(
        {
          tabId: Number(tabId),
          text: numCookies.toString(),
        },
        () => {
          if (chrome.runtime.lastError) {
            //Fail silently since we know that it will throw the error of tab Id not being available.
          }
        }
      );
    }
  } catch (error) {
    // do nothing
  }
}
