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
import { type CookieData, CookieStore } from '../localStore';
import parseResponseCookieHeader from './parseResponseCookieHeader';
import type { Header } from './types';
import { getTab } from '../utils/getTab';

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  async (details: chrome.webRequest.WebResponseCacheDetails) => {
    const { tabId, url, responseHeaders } = details;

    const tab = await getTab(tabId);

    if (!tab || !responseHeaders) {
      return;
    }

    // @todo: Fix ts error.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const cookies: CookieData[] | [] = responseHeaders
      .map((header: Header): CookieData | null =>
        parseResponseCookieHeader(url, tab?.url, header)
      )
      .filter((x: CookieData | null) => Boolean(x));

    if (!cookies.length) {
      return;
    }

    // Adds the cookies from the request headers to the cookies object.
    await CookieStore.update(tabId.toString(), cookies);
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

/**
 * Update tab metadata when the browser is about to navigate to a new page.
 * @see https://developer.chrome.com/docs/extensions/reference/webNavigation/
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, frameType } = details;

  if (url && frameType === 'outermost_frame') {
    // Updates the location of the tab in the cookies object.
    CookieStore.updateTabLocation(
      tabId.toString(),
      new URL(url).origin,
      Date.now()
    );
  }
});

/**
 * Update tab focus when a tab is activated(focused) or created.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/
 */
chrome.tabs.onActivated.addListener((activeInfo) => {
  CookieStore.updateTabFocus(activeInfo);
});

chrome.tabs.onRemoved.addListener((tabId) => {
  CookieStore.removeTabData(tabId.toString());
});

chrome.windows.onRemoved.addListener((windowId) => {
  CookieStore.removeWindowData(windowId);
});
