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
import { CookieStore } from '../localStore';

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    const { tabId, url, responseHeaders } = details;

    // Adds the cookies from the request headers to the cookies object.
    CookieStore.addFromRequest(tabId, {
      url,
      headers: responseHeaders,
    });
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

/**
 * Fired before sending an HTTP request, once the request headers are available.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onBeforeSendHeaders
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    const { tabId, url, requestHeaders } = details;

    CookieStore.addFromRequest(tabId, {
      url,
      headers: requestHeaders,
    });
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);

/**
 * Update tab metadata when the browser is about to navigate to a new page.
 * @see https://developer.chrome.com/docs/extensions/reference/webNavigation/
 */
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const { tabId, url, frameType } = details;

  if (url && frameType === 'outermost_frame') {
    // Updates the location of the tab in the cookies object.
    CookieStore.updateTabLocation(tabId, new URL(url), Date.now());
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
  CookieStore.removeTabData(tabId);
});

chrome.windows.onRemoved.addListener((windowId) => {
  CookieStore.removeWindowData(windowId);
});
