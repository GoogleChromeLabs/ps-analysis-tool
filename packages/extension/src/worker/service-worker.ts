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
import { getTab } from '../utils/getTab';
import { fetchDictionary } from '../utils/fetchCookieDictionary';

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

    const dictionary = await fetchDictionary();
    const cookies = responseHeaders.reduce<CookieData[]>((acc, header) => {
      if (header.name.toLowerCase() === 'set-cookie' && header.value) {
        const cookie = parseResponseCookieHeader(
          url,
          tab?.url,
          header.value,
          dictionary
        );
        return [...acc, cookie];
      }
      return acc;
    }, []);

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
 * Fires when the tab is focused,
 * When a new window is opened,
 * Not when the tab is refreshed or a new website is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await CookieStore.updateTabFocus(activeInfo.tabId.toString());
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {
  await CookieStore.removeTabData(tabId.toString());
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/windows/#event-onRemoved
 */
chrome.windows.onRemoved.addListener(async (windowId) => {
  await CookieStore.removeWindowData(windowId);
});

/**
 * Fires when the extension is first installed,
 * when clicked on the extension refresh button from chrome://extensions/
 * when the extension is updated to a new version,
 * when Chrome is updated to a new version.
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onInstalled
 */
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.clear();
});
