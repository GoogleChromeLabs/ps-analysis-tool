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
import type { CookieData } from '../../localStore';
import type { ICookieStore } from '../../localStore/cookieStore';
import {
  fetchDictionary,
  type CookieDatabase,
} from '../../utils/fetchCookieDictionary';
import parseRequestCookieHeader from '../parseRequestCookieHeader';
import parseResponseCookieHeader from '../parseResponseCookieHeader';

const initialize = async (CookieStore: ICookieStore) => {
  const cookieDb = await fetchDictionary();
  chrome.webRequest.onResponseStarted.addListener(
    onResponseStartedListener(CookieStore, cookieDb),
    { urls: ['*://*/*'] },
    ['extraHeaders', 'responseHeaders']
  );

  chrome.webRequest.onBeforeSendHeaders.addListener(
    onBeforeSendHeadersListener(CookieStore, cookieDb),
    { urls: ['*://*/*'] },
    ['extraHeaders', 'requestHeaders']
  );
};

/**
 * @param cookieStore CookieStore
 * @param cookieDb Lookup object for cookie analytics
 * @returns EventHandler that intercepts a response
 * and caches name and domain of a cookie sent in the reponse
 */
const onResponseStartedListener =
  (cookieStore: ICookieStore, cookieDb: CookieDatabase) =>
  async (details: chrome.webRequest.WebResponseCacheDetails) => {
    const { tabId, url, responseHeaders } = details;

    if (!responseHeaders) {
      return;
    }

    const cookies = responseHeaders.reduce<CookieData[]>(
      (accumulator, header) => {
        if (header.name.toLowerCase() === 'set-cookie' && header.value) {
          const cookie = parseResponseCookieHeader(url, header.value, cookieDb);
          return [...accumulator, cookie];
        }
        return accumulator;
      },
      []
    );

    if (!cookies.length) {
      return;
    }

    await cookieStore.addCookiesToTabEntry(tabId, cookies);
  };

/**
 * @param cookieStore CookieStore
 * @param cookieDb Lookup object for cookie analytics
 * @returns EventHandler that intercepts a response
 * and caches name and domain of a cookie sent in the reponse
 */
const onBeforeSendHeadersListener =
  (cookieStore: ICookieStore, cookieDb: CookieDatabase) =>
  (details: chrome.webRequest.WebRequestHeadersDetails) => {
    (async () => {
      const { tabId, url, requestHeaders } = details;
      if (!requestHeaders) {
        return;
      }

      const cookies = requestHeaders.reduce<CookieData[]>(
        (accumulator, header) => {
          if (header.name.toLowerCase() === 'cookie' && header.value && url) {
            const cookieList = parseRequestCookieHeader(
              url,
              header.value,
              cookieDb
            );
            return [...accumulator, ...cookieList];
          }
          return accumulator;
        },
        []
      );

      if (!cookies.length) {
        return;
      }

      await cookieStore.addCookiesToTabEntry(tabId, cookies);
    })();
  };

const interceptNetworkRoutine = {
  initialize,
};

export default interceptNetworkRoutine;
