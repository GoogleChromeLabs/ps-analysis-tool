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
import { Protocol } from 'devtools-protocol';
import {
  type CookieDatabase,
  type CookieData,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';
import SynchnorousCookieStore from '../store/synchnorousCookieStore';
import { getTab } from '../utils/getTab';
import parseHeaders from '../utils/parseHeaders';

let cookieDB: CookieDatabase | null = null;
let syncCookieStore: SynchnorousCookieStore | undefined;

const requestIdToCDPURLMapping: {
  [tabId: string]: {
    [requestId: string]: string;
  };
} = {};

let tabMode: 'single' | 'unlimited' = 'single';
let tabToRead = '';
let globalIsUsingCDP = false;

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfo',
  'Audits.issueAdded',
];

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/api/webRequest
 */
chrome.webRequest.onResponseStarted.addListener(
  ({ tabId, url, responseHeaders, frameId, requestId }) => {
    (async () => {
      const tabUrl = syncCookieStore?.getTabUrl(tabId) ?? '';

      if (!cookieDB) {
        cookieDB = await fetchDictionary();
      }

      const cookies = await parseHeaders(
        globalIsUsingCDP,
        'response',
        tabToRead,
        tabMode,
        tabId,
        url,
        cookieDB,
        tabUrl,
        frameId,
        requestId,
        responseHeaders
      );

      if (!cookies || (cookies && cookies?.length === 0)) {
        return;
      }

      // Adds the cookies from the request headers to the cookies object.
      syncCookieStore?.update(tabId, cookies);
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
  ({ url, requestHeaders, tabId, frameId, requestId }) => {
    (async () => {
      const tabUrl = syncCookieStore?.getTabUrl(tabId) ?? '';

      if (!cookieDB) {
        cookieDB = await fetchDictionary();
      }

      const cookies = await parseHeaders(
        globalIsUsingCDP,
        'request',
        tabToRead,
        tabMode,
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
      syncCookieStore?.update(tabId, cookies);
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

  if (!syncCookieStore) {
    syncCookieStore = new SynchnorousCookieStore();
  }

  if (tabMode && tabMode !== 'unlimited') {
    const doesTabExist = tabToRead;
    if (
      Object.keys(syncCookieStore?.tabsData ?? {}).length >=
        ALLOWED_NUMBER_OF_TABS &&
      doesTabExist
    ) {
      return;
    }
    tabToRead = tab.id.toString();
    syncCookieStore?.addTabData(tab.id);
  } else {
    syncCookieStore?.addTabData(tab.id);
  }
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  syncCookieStore?.removeTabData(tabId);
});

chrome.runtime.onStartup.addListener(async () => {
  const storage = await chrome.storage.sync.get();

  if (!syncCookieStore) {
    syncCookieStore = new SynchnorousCookieStore();
  }

  if (Object.keys(storage).includes('allowedNumberOfTabs')) {
    tabMode = storage.allowedNumberOfTabs;
  }

  if (Object.keys(storage).includes('isUsingCDP')) {
    globalIsUsingCDP = storage.isUsingCDP;
  }
});

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  try {
    if (globalIsUsingCDP) {
      await chrome.debugger.attach({ tabId }, '1.3');
      await chrome.debugger.sendCommand({ tabId }, 'Network.enable');
      await chrome.debugger.sendCommand({ tabId }, 'Audits.enable');
    } else {
      await chrome.debugger.detach({ tabId });
    }
  } catch (error) {
    //Fail silently
  }

  if (!tab.url) {
    return;
  }

  syncCookieStore?.updateUrl(tabId, tab.url);

  if (changeInfo.status === 'loading' && tab.url) {
    syncCookieStore?.removeCookieData(tabId);
  }
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved
 */
chrome.windows.onRemoved.addListener((windowId) => {
  syncCookieStore?.removeWindowData(windowId);
});

/**
 * Fires when the extension is first installed,
 * when clicked on the extension refresh button from chrome://extensions/
 * when the extension is updated to a new version,
 * when Chrome is updated to a new version.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled
 * @todo Shouldn't have to reinstall the extension.
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  syncCookieStore = new SynchnorousCookieStore();
  syncCookieStore?.clear();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(syncCookieStore?.tabsData ?? {}).length === 0) {
      return;
    }

    Object.keys(syncCookieStore?.tabsData ?? {}).forEach((key) => {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
    });
  }

  if (details.reason === 'update') {
    const preSetSettings = await chrome.storage.sync.get();
    tabMode = preSetSettings?.allowedNumberOfTabs ?? 'single';
    globalIsUsingCDP = preSetSettings?.isUsingCDP ?? false;
    if (
      preSetSettings?.allowedNumberOfTabs &&
      Object.keys(preSetSettings).includes('isUsingCDP')
    ) {
      return;
    }

    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
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

  if (!params) {
    return;
  }

  const url = syncCookieStore?.getTabUrl(source?.tabId);

  tabId = source?.tabId?.toString();

  if (tabMode && tabMode !== 'unlimited' && tabToRead !== tabId) {
    return;
  }

  if (method === 'Network.responseReceived') {
    const request = params as Protocol.Network.ResponseReceivedEvent;

    // To get domain from the request URL if not given in the cookie line.
    if (!requestIdToCDPURLMapping[tabId]) {
      requestIdToCDPURLMapping[tabId] = {
        [request.requestId]: request?.response.url,
      };
    } else {
      requestIdToCDPURLMapping[tabId] = {
        ...requestIdToCDPURLMapping[tabId],
        [request.requestId]: request?.response.url,
      };
    }
  }

  if (method === 'Network.requestWillBeSentExtraInfo') {
    const requestParams =
      params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

    const { associatedCookies, requestId } = requestParams;

    if (associatedCookies.length === 0) {
      return;
    }

    const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
      associatedCookies,
      cookieDB ?? {},
      requestIdToCDPURLMapping[tabId],
      url ?? '',
      requestId
    );

    if (cookies.length === 0) {
      return;
    }

    syncCookieStore?.update(Number(tabId), cookies);
  }

  if (method === 'Network.responseReceivedExtraInfo') {
    const responseParams =
      params as Protocol.Network.ResponseReceivedExtraInfoEvent;

    const {
      headers,
      blockedCookies,
      requestId,
      cookiePartitionKey = '',
    } = responseParams;

    // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
    if (!headers['set-cookie'] && !headers['Set-Cookie']) {
      return;
    }

    const cookies: CookieData[] = parseResponseReceivedExtraInfo(
      headers,
      blockedCookies,
      cookiePartitionKey,
      requestIdToCDPURLMapping[tabId],
      url ?? '',
      cookieDB ?? {},
      requestId
    );

    if (cookies.length === 0) {
      return;
    }

    syncCookieStore?.update(Number(tabId), cookies);
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
      syncCookieStore?.addCookieExclusionWarningReason(
        cookie?.name + primaryDomain + cookie?.path,
        //@ts-ignore since the details has been checked before sending them as parameter.
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

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();

  if (!newTabId) {
    return '';
  }

  if (tabMode && tabMode !== 'unlimited') {
    const storedTabData = Object.keys(syncCookieStore?.tabsData ?? {});
    await Promise.all(
      storedTabData.map(async (tabIdToDelete) => {
        syncCookieStore?.removeTabData(Number(tabIdToDelete));
        try {
          await chrome.action.setBadgeText({
            tabId: Number(tabIdToDelete),
            text: '',
          });
          await chrome.debugger.detach({ tabId: Number(tabIdToDelete) });
        } catch (error) {
          // Fail silently
        }
        return tabIdToDelete;
      })
    );
  }

  syncCookieStore?.addTabData(Number(newTabId));
  syncCookieStore?.updateDevToolsState(Number(newTabId), true);
  syncCookieStore?.updatePopUpState(Number(newTabId), true);

  return newTabId;
};

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
// eslint-disable-next-line complexity
chrome.runtime.onMessage.addListener(async (request) => {
  if (
    request?.type === 'DevTools::ServiceWorker::SET_TAB_TO_READ' ||
    request?.type === 'Popup::ServiceWorker::SET_TAB_TO_READ'
  ) {
    tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);

    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    chrome.runtime.sendMessage({
      type: 'ServiceWorker::SET_TAB_TO_READ',
      payload: {
        tabId: newTab,
      },
    });

    await chrome.tabs.reload(Number(newTab), { bypassCache: true });
  }

  if (
    request.type === 'DevTools::ServiceWorker::CHANGE_CDP_SETTING' ||
    request.type === 'Popup::ServiceWorker::CHANGE_CDP_SETTING'
  ) {
    if (typeof request.payload?.isUsingCDP !== 'undefined') {
      globalIsUsingCDP = request.payload?.isUsingCDP;
      const storage = await chrome.storage.sync.get();
      await chrome.storage.sync.set({
        ...storage,
        isUsingCDP: globalIsUsingCDP,
      });
    }
  }

  if (
    request?.type === 'DevTools::ServiceWorker::DEVTOOLS_STATE_OPEN' &&
    request?.payload?.tabId
  ) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }
    chrome.runtime.sendMessage({
      type: 'ServiceWorker::DevTools::INITIAL_SYNC',
      payload: dataToSend,
    });

    if (
      !syncCookieStore?.tabs[request.payload.tabId] &&
      tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(request.payload.tabId);

      syncCookieStore?.addTabData(request?.payload?.tabId);
      syncCookieStore?.updateUrl(
        request?.payload?.tabId,
        currentTab?.url || ''
      );
    }

    syncCookieStore?.updateDevToolsState(request?.payload?.tabId, true);

    if (syncCookieStore?.tabsData[request.payload.tabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        request.payload.tabId,
        true
      );
    }
  }

  if (
    request?.type === 'Popup::ServiceWorker::POPUP_STATE_OPEN' &&
    request?.payload?.tabId
  ) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }
    chrome.runtime.sendMessage({
      type: 'ServiceWorker::Popup::INITIAL_SYNC',
      payload: dataToSend,
    });

    syncCookieStore?.updatePopUpState(request?.payload?.tabId, true);

    if (syncCookieStore?.tabsData[request?.payload?.tabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        request?.payload?.tabId,
        true
      );
    }
  }

  if (
    request?.type === 'DevTools::ServiceWorker::DEVTOOLS_STATE_CLOSE' &&
    request?.payload?.tabId
  ) {
    syncCookieStore?.updateDevToolsState(request?.payload?.tabId, false);
  }

  if (
    request?.type === 'Popup::ServiceWorker::POPUP_STATE_CLOSE' &&
    request?.payload?.tabId
  ) {
    syncCookieStore?.updatePopUpState(request?.payload?.tabId, false);
  }

  if (
    request?.type === 'DevTools::ServiceWorker::SET_JAVASCRIPT_COOKIE' &&
    request?.payload?.tabId
  ) {
    syncCookieStore?.update(
      request?.payload?.tabId,
      JSON.parse(request?.payload?.cookieData)
    );
  }
});

/**
 * Fires when the browser window is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onCreated
 */
chrome.windows.onCreated.addListener(async () => {
  const totalWindows = await chrome.windows.getAll();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // We do not want to clear content settings if a user has create one more window.
  if (totalWindows.length < 2) {
    chrome.contentSettings.cookies.clear({});
  }
});

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.allowedNumberOfTabs ||
      !changes?.allowedNumberOfTabs?.newValue ||
      !changes?.allowedNumberOfTabs?.oldValue
    ) {
      return;
    }
    tabMode = changes.allowedNumberOfTabs.newValue;

    const tabs = await chrome.tabs.query({});

    if (changes?.allowedNumberOfTabs?.newValue === 'single') {
      tabToRead = '';

      chrome.runtime.sendMessage({
        type: 'ServiceWorker::DevTools::INITIAL_SYNC',
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });

      chrome.runtime.sendMessage({
        type: 'ServiceWorker::Popup::INITIAL_SYNC',
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });

      tabs.map((tab) => {
        if (!tab?.id) {
          return tab;
        }

        chrome.action.setBadgeText({
          tabId: tab?.id,
          text: '',
        });

        syncCookieStore?.removeTabData(tab.id);

        chrome.tabs.reload(Number(tab?.id), { bypassCache: true });
        return tab;
      });
    } else {
      chrome.runtime.sendMessage({
        type: 'ServiceWorker::Popup::INITIAL_SYNC',
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });

      chrome.runtime.sendMessage({
        type: 'ServiceWorker::DevTools::INITIAL_SYNC',
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });

      await Promise.all(
        tabs.map(async (tab) => {
          if (!tab?.id) {
            return;
          }
          syncCookieStore?.addTabData(tab.id);
          syncCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
          syncCookieStore?.updateDevToolsState(tab.id, true);
          await chrome.tabs.reload(Number(tab?.id), { bypassCache: true });
        })
      );
    }
  }
);

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.isUsingCDP ||
      typeof changes?.isUsingCDP?.newValue === 'undefined' ||
      typeof changes?.isUsingCDP?.oldValue === 'undefined'
    ) {
      return;
    }

    globalIsUsingCDP = changes?.isUsingCDP?.newValue;

    chrome.runtime.sendMessage({
      type: 'ServiceWorker::Popup::CHANGE_CDP_SETTING',
      payload: {
        isUsingCDP: changes?.isUsingCDP?.newValue,
      },
    });

    chrome.runtime.sendMessage({
      type: 'ServiceWorker::DevTools::CHANGE_CDP_SETTING',
      payload: {
        isUsingCDP: changes?.isUsingCDP?.newValue,
      },
    });

    const tabs = await chrome.tabs.query({});

    if (!changes?.isUsingCDP?.newValue) {
      await Promise.all(
        tabs.map(async (tab) => {
          if (!tab.id) {
            return;
          }

          try {
            await chrome.debugger.detach({ tabId: tab.id });
            syncCookieStore?.removeCookieData(tab.id);
            syncCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          } finally {
            await chrome.tabs.reload(tab.id, { bypassCache: true });
          }
        })
      );
    } else {
      await Promise.all(
        tabs.map(async (tab) => {
          if (!tab.id) {
            return;
          }

          syncCookieStore?.removeCookieData(tab.id);
          syncCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
          await chrome.tabs.reload(tab.id, { bypassCache: true });
        })
      );
    }
  }
);
