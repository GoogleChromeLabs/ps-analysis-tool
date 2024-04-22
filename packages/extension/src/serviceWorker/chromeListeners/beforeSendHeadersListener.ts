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
import type { CookieDatabase } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { fetchDictionary } from '../../utils/fetchCookieDictionary';
import parseHeaders from '../../utils/parseHeaders';
import synchnorousCookieStore from '../../store/synchnorousCookieStore';
import { getTab } from '../../utils/getTab';

let cookieDB: CookieDatabase | null = null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url, requestHeaders, tabId, frameId, requestId }) => {
    if (synchnorousCookieStore.globalIsUsingCDP) {
      return;
    }
    (async () => {
      const tab = await getTab(tabId);
      let tabUrl = synchnorousCookieStore?.getTabUrl(tabId);

      if (tab && tab.pendingUrl) {
        tabUrl = tab.pendingUrl;
      }

      if (!cookieDB) {
        cookieDB = await fetchDictionary();
      }

      const cookies = await parseHeaders(
        synchnorousCookieStore.globalIsUsingCDP,
        'request',
        synchnorousCookieStore.tabToRead,
        synchnorousCookieStore.tabMode,
        tabId,
        url,
        cookieDB,
        tabUrl,
        frameId,
        requestId,
        requestHeaders
      );

      if (!cookies || (cookies && cookies?.length === 0)) {
        return;
      }

      // Adds the cookies from the request headers to the cookies object.
      synchnorousCookieStore?.update(tabId, cookies);
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);
