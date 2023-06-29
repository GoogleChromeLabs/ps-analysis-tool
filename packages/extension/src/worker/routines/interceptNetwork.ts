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
import { parse } from 'simple-cookie';
import type { CookieDataFromNetwork } from '../../localStore';
import type { ICookieStore } from '../../localStore/cookieStore';

const initialize = (CookieStore: ICookieStore) => {
  chrome.webRequest.onResponseStarted.addListener(
    onResponseStartedListener(CookieStore),
    { urls: ['*://*/*'] },
    ['extraHeaders', 'responseHeaders']
  );
};

/**
 * @param CookieStore CookieStore
 * @returns EventHandler that intercepts a response
 * and caches name and domain of a cookie sent in the reponse
 */
const onResponseStartedListener =
  (CookieStore: ICookieStore) =>
  async (details: chrome.webRequest.WebResponseCacheDetails) => {
    const { tabId, url, responseHeaders } = details;

    if (!responseHeaders) {
      return;
    }

    const cookies = responseHeaders.reduce<CookieDataFromNetwork[]>(
      (accumulator, header) => {
        if (header.name.toLowerCase() === 'set-cookie' && header.value) {
          const cookie = parse(header.value);
          return [
            ...accumulator,
            {
              name: cookie.name,
              url,
              headerType: 'response',
            },
          ];
        }
        return accumulator;
      },
      []
    );

    if (!cookies.length) {
      return;
    }

    await CookieStore.addCookiesToTabEntry(tabId, cookies);
  };

const interceptNetworkRoutine = {
  initialize,
};

export default interceptNetworkRoutine;
