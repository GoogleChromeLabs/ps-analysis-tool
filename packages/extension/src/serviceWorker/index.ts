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
import {
  type CookieData,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
} from '@ps-analysis-tool/common';
import { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import parseResponseCookieHeader from './parseResponseCookieHeader';
import parseRequestCookieHeader from './parseRequestCookieHeader';
import {
  type CookieDatabase,
  fetchDictionary,
} from '../utils/fetchCookieDictionary';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';
import SynchnorousCookieStore from '../localStore/synchnorousCookieStore';
import canProcessCookies from '../utils/canProcessCookies';

let cookieDB: CookieDatabase | null = null;
const syncCookieStore = new SynchnorousCookieStore();

const cdpURLToRequestMap: {
  [tabId: string]: {
    [requestId: string]: string;
  };
} = {};

let tabMode = 'single';
let tabToRead = '';

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfor',
  'Audits.issueAdded',
];

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  (details: chrome.webRequest.WebResponseCacheDetails) => {
    (async () => {
      const { tabId, url, responseHeaders, frameId } = details;
      const tabUrl = syncCookieStore.getTabUrl(tabId);

      if (
        !canProcessCookies(tabMode, tabUrl, tabToRead, tabId, responseHeaders)
      ) {
        return;
      }

      let cdpCookies: { [key: string]: Protocol.Network.Cookie[] };
      //Since we are using CDP we might as well use it to get the proper cookies in the request this will further reduce the load of domain calculation
      try {
        cdpCookies = await chrome.debugger.sendCommand(
          { tabId: tabId },
          'Network.getCookies',
          { urls: [url] }
        );
      } catch (error) {
        // Fail silently
      }
      const cookies = responseHeaders?.reduce<CookieData[]>(
        (accumulator, header) => {
          if (
            header.name.toLowerCase() === 'set-cookie' &&
            header.value &&
            tabUrl &&
            cookieDB
          ) {
            const cookie = parseResponseCookieHeader(
              url,
              header.value,
              cookieDB,
              tabUrl,
              frameId,
              cdpCookies?.cookies ?? []
            );

            return [...accumulator, cookie];
          }
          return accumulator;
        },
        []
      );

      if (!cookies || (cookies && cookies?.length === 0)) {
        return;
      }
      // Adds the cookies from the request headers to the cookies object.
      syncCookieStore.update(tabId, cookies);
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

/**
 * Fires before sending an HTTP request, once the request headers are available.
 * @see https://developer.chrome.com/docs/extensions/reference/api/webRequest#event-onBeforeSendHeaders
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url, requestHeaders, tabId, frameId }) => {
    (async () => {
      const tabUrl = syncCookieStore.getTabUrl(tabId);
      if (
        !canProcessCookies(tabMode, tabUrl, tabToRead, tabId, requestHeaders)
      ) {
        return;
      }

      let cdpCookies: { [key: string]: Protocol.Network.Cookie[] };
      try {
        cdpCookies = await chrome.debugger.sendCommand(
          { tabId: tabId },
          'Network.getCookies',
          { urls: [url] }
        );
      } catch (error) {
        // Fail silently
      }

      const cookies = requestHeaders?.reduce<CookieData[]>(
        (accumulator, header) => {
          if (
            header.name.toLowerCase() === 'cookie' &&
            header.value &&
            url &&
            tabUrl &&
            cookieDB
          ) {
            const cookieList = parseRequestCookieHeader(
              url,
              header.value,
              cookieDB,
              tabUrl,
              frameId,
              cdpCookies?.cookies ?? []
            );
            return [...accumulator, ...cookieList];
          }
          return accumulator;
        },
        []
      );

      if (!cookies || (cookies && cookies?.length === 0)) {
        return;
      }

      syncCookieStore.update(tabId, cookies);
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);

/**
 * Fires when a tab is created.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 */
chrome.tabs.onCreated.addListener((tab) => {
  if (!tab.id) {
    return;
  }

  if (tabMode && tabMode !== 'unlimited') {
    const doesTabExist = tabToRead;
    if (
      Object.keys(syncCookieStore.cachedTabsData).length >=
        ALLOWED_NUMBER_OF_TABS &&
      doesTabExist
    ) {
      return;
    }
    tabToRead = tab.id.toString();
    syncCookieStore.addTabData(tab.id, tabMode);
  } else {
    syncCookieStore.addTabData(tab.id, tabMode);
  }
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  syncCookieStore.removeTabData(tabId);
});

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    await chrome.debugger.attach({ tabId }, '1.3');
    chrome.debugger.sendCommand({ tabId }, 'Network.enable');
    chrome.debugger.sendCommand({ tabId }, 'Audits.enable');
  } catch (error) {
    //Fail silently
  }
  if (!tab.url) {
    return;
  }

  syncCookieStore.updateUrl(tabId, tab.url);

  if (changeInfo.status === 'loading' && tab.url) {
    syncCookieStore.update(tabId, [], 'clear');
  }
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/windows/#event-onRemoved
 */
chrome.windows.onRemoved.addListener((windowId) => {
  syncCookieStore.removeWindowData(windowId);
});

/**
 * Fires when the extension is first installed,
 * when clicked on the extension refresh button from chrome://extensions/
 * when the extension is updated to a new version,
 * when Chrome is updated to a new version.
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onInstalled
 * @todo Shouldn't have to reinstall the extension.
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  await chrome.storage.local.clear();
  if (!cookieDB) {
    cookieDB = await fetchDictionary();
  }
  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
    });
  }
  if (details.reason === 'update') {
    const preSetSettings = await chrome.storage.sync.get();
    if (preSetSettings?.allowedNumberOfTabs) {
      return;
    }
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
    });
  }
});

/**
 * Fires whenever debugging target issues instrumentation event.
 * @see https://developer.chrome.com/docs/extensions/reference/api/debugger
 */
// eslint-disable-next-line complexity
chrome.debugger.onEvent.addListener((source, method, params) => {
  if (!ALLOWED_EVENTS.includes(method)) {
    return;
  }

  let tabId = '';
  if (!source?.tabId) {
    return;
  }

  tabId = source?.tabId?.toString();

  const url = syncCookieStore.getTabUrl(source?.tabId);

  if (tabMode && tabMode !== 'unlimited' && tabToRead !== tabId) {
    return;
  }

  if (method === 'Network.responseReceived' && params) {
    const request = params as Protocol.Network.ResponseReceivedEvent;
    if (!cdpURLToRequestMap[tabId]) {
      cdpURLToRequestMap[tabId] = {
        [request.requestId]: request?.response.url,
      };
    } else {
      cdpURLToRequestMap[tabId] = {
        ...cdpURLToRequestMap[tabId],
        [request.requestId]: request?.response.url,
      };
    }
  }

  if (method === 'Network.requestWillBeSentExtraInfo' && params) {
    const requestParams =
      params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

    if (requestParams.associatedCookies.length === 0) {
      return;
    }

    const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
      requestParams,
      cookieDB ?? {},
      cdpURLToRequestMap[tabId],
      url ?? ''
    );

    if (cookies.length === 0) {
      return;
    }

    syncCookieStore.update(Number(tabId), cookies);
  }

  if (method === 'Network.responseReceivedExtraInfo' && params) {
    const responseParams =
      params as Protocol.Network.ResponseReceivedExtraInfoEvent;
    // Added this because sometimes CDP gives set-cookie and sometimes it gives Set-Cookie.
    if (
      !responseParams.headers['set-cookie'] &&
      !responseParams.headers['Set-Cookie']
    ) {
      return;
    }
    const allCookies = parseResponseReceivedExtraInfo(
      responseParams,
      cdpURLToRequestMap[tabId],
      url ?? '',
      cookieDB ?? {}
    );

    syncCookieStore.update(Number(tabId), allCookies);
  }

  if (method === 'Audits.issueAdded' && params) {
    const auditParams = params as Protocol.Audits.IssueAddedEvent;
    const { code, details } = auditParams.issue;
    if (code !== 'CookieIssue' && !details.cookieIssueDetails) {
      return;
    }

    if (
      !details.cookieIssueDetails?.cookie &&
      !details.cookieIssueDetails?.cookieWarningReasons &&
      !details.cookieIssueDetails?.cookieExclusionReasons
    ) {
      return;
    }
    const { cookie, cookieExclusionReasons, cookieWarningReasons } =
      details.cookieIssueDetails;
    const primaryDomain = cookie?.domain.startsWith('.')
      ? cookie.domain
      : '.' + cookie?.domain;
    const secondaryDomain = cookie?.domain.startsWith('.')
      ? cookie.domain.slice(1)
      : cookie?.domain;

    // Adding alternate domains here because our extension calculates domain differently that the application tab.
    // This is done to capture both NID.google.com/ and NIDgoogle.com/ so that if we find either of the cookie we add issues to the cookie object
    try {
      syncCookieStore.addCookieExclusionWarningReason(
        cookie?.name + primaryDomain + cookie?.path,
        //@ts-ignore since The details has been checked before sending them as parameter.
        cookie?.name + secondaryDomain + cookie?.path,
        cookieExclusionReasons,
        cookieWarningReasons,
        source.tabId
      );
    } catch (error) {
      // fail silently
    }
  }
});

const listenToNewTab = (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();

  if (!newTabId) {
    return '';
  }

  if (tabMode && tabMode !== 'unlimited') {
    const storedTabData = Object.keys(syncCookieStore.cachedTabsData);
    storedTabData.some((tabIdToDelete) => {
      syncCookieStore.removeTabData(Number(tabIdToDelete));
      try {
        chrome.debugger.detach({ tabId: Number(tabIdToDelete) });
      } catch (error) {
        // Fail silently
      }
      chrome.action.setBadgeText({
        tabId: Number(newTabId),
        text: '',
      });
      return tabIdToDelete;
    });
  }

  syncCookieStore.addTabData(Number(newTabId), tabMode);
  syncCookieStore.updateDevToolsState(Number(newTabId), true);

  return newTabId;
};

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
chrome.runtime.onMessage.addListener(async (request) => {
  if (request?.type === 'SET_TAB_TO_READ') {
    const newTab = listenToNewTab(request?.payload?.tabId);
    tabToRead = newTab;
    chrome.runtime.sendMessage({
      type: 'TAB_TO_READ_DATA',
      payload: {
        tabToRead: tabToRead,
      },
    });
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    chrome.runtime.sendMessage({
      type: 'syncCookieStore:SET_TAB_TO_READ',
      payload: {
        tabId: newTab,
      },
    });

    await chrome.tabs.reload(Number(newTab));
  }

  if (request?.type === 'DEVTOOLS_STATE_OPEN') {
    if (!request?.payload?.tabId) {
      return;
    }

    chrome.runtime.sendMessage({
      type: 'TAB_TO_READ_DATA',
      payload: {
        tabToRead: tabToRead,
      },
    });

    if (syncCookieStore.cachedTabsData[Number(tabToRead)]) {
      chrome.runtime.sendMessage({
        type: 'NEW_COOKIE_DATA',
        payload: {
          tabId: Number(tabToRead),
          cookieData: JSON.stringify(
            syncCookieStore.cachedTabsData[Number(tabToRead)]
          ),
        },
      });
    }

    syncCookieStore.updateDevToolsState(request?.payload?.tabId, true);
  }

  if (request?.type === 'DEVTOOLS_STATE_CLOSE') {
    if (!request?.payload?.tabId) {
      return;
    }
    syncCookieStore.updateDevToolsState(request?.payload?.tabId, false);
  }
});

/**
 * Listen to local storage changes.
 * @see https://developer.chrome.com/docs/extensions/reference/api/storage#event-onChanged
 */
chrome.storage.local.onChanged.addListener(
  (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (!changes?.tabToRead || !changes?.tabToRead?.oldValue) {
      return;
    }

    const tabId = changes.tabToRead.oldValue;
    tabToRead = changes.tabToRead.newValue;

    if (!tabId || (tabMode && tabMode !== 'unlimited')) {
      return;
    }

    syncCookieStore.removeTabData(tabId);
  }
);

chrome.storage.sync.onChanged.addListener(
  (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes && Object.keys(changes).includes('allowedNumberOfTabs')) {
      tabMode = changes.allowedNumberOfTabs.newValue;
    }
  }
);
