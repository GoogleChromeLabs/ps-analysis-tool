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
import {
  ALLOWED_NUMBER_OF_TABS,
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  INITIAL_SYNC,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  SET_TAB_TO_READ,
  TABID_STORAGE,
} from '../constants';
import SynchnorousCookieStore from '../store/synchnorousCookieStore';
import { getTab } from '../utils/getTab';
import parseHeaders from '../utils/parseHeaders';
import resetCookieBadgeText from '../store/utils/resetCookieBadgeText';
import getQueryParams from '../utils/getQueryParams';
import reloadCurrentTab from '../utils/reloadCurrentTab';

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
      const tab = await getTab(tabId);
      let tabUrl = syncCookieStore?.getTabUrl(tabId);

      // Sometimes, a site may send out requests while it is still in the preloading state. Any cookie set from these requests are classified as third-party cookies.
      // For example nikkei.com. The cookie domain may be nikkei.com however the tab URL would be xyz.com so it becomes third-party
      if (tab && tab.pendingUrl) {
        tabUrl = tab.pendingUrl;
      }

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
      const tab = await getTab(tabId);
      let tabUrl = syncCookieStore?.getTabUrl(tabId);

      if (tab && tab.pendingUrl) {
        tabUrl = tab.pendingUrl;
      }

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
 * Fires when a profile with extension is started.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup
 */
chrome.runtime.onStartup.addListener(async () => {
  const storage = await chrome.storage.sync.get();

  if (!syncCookieStore) {
    syncCookieStore = new SynchnorousCookieStore();
  }

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // We're doing this to keep the service worker active, preventing data loss.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // Sync cookie data between popup and Devtool.
  // @todo Only send the data from the active tab and the differences.
  setInterval(() => {
    const data = syncCookieStore?.tabsData ?? {};

    if (Object.keys(data).length === 0) {
      return;
    }

    Object.keys(data).forEach((key) => {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (Object.keys(storage).includes('allowedNumberOfTabs')) {
    tabMode = storage.allowedNumberOfTabs;
  }

  if (Object.keys(storage).includes('isUsingCDP')) {
    globalIsUsingCDP = storage.isUsingCDP;
  }
});

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
    const tabExists = tabToRead;
    const data = syncCookieStore?.tabsData ?? {};

    if (Object.keys(data).length >= ALLOWED_NUMBER_OF_TABS && tabExists) {
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

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url) {
    return;
  }

  const queryParams = getQueryParams(tab.url);

  if (queryParams.psat_cdp || queryParams.psat_multitab) {
    await chrome.storage.sync.set({
      allowedNumberOfTabs:
        queryParams.psat_multitab === 'on' ? 'unlimited' : 'single',
      isUsingCDP: queryParams.psat_cdp === 'on',
    });

    globalIsUsingCDP = queryParams.psat_cdp === 'on';
    tabMode = queryParams.psat_multitab === 'on' ? 'unlimited' : 'single';
  }

  syncCookieStore?.updateUrl(tabId, tab.url);

  if (changeInfo.status === 'loading' && tab.url) {
    syncCookieStore?.removeCookieData(tabId);
  }
  try {
    await chrome.tabs.sendMessage(tabId, {
      tabId,
      payload: {
        type: TABID_STORAGE,
        tabId,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

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
    await chrome.storage.local.clear();
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
  if (!ALLOWED_EVENTS.includes(method) || !source?.tabId || !params) {
    return;
  }

  const url = syncCookieStore?.getTabUrl(source?.tabId);

  const tabId = source.tabId.toString();

  if (tabMode !== 'unlimited' && tabToRead !== tabId) {
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
      exemptedCookies = [],
    } = responseParams;

    // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
    if (!headers['set-cookie'] && !headers['Set-Cookie']) {
      return;
    }

    const cookies: CookieData[] = parseResponseReceivedExtraInfo(
      headers,
      blockedCookies,
      exemptedCookies,
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

    const domainToUse = cookie?.domain.startsWith('.')
      ? cookie.domain.slice(1)
      : cookie?.domain;

    if (!cookie?.name || !domainToUse) {
      return;
    }
    try {
      const modifiedCookieExclusionReasons = cookieExclusionReasons.map(
        (reason) => {
          if (reason.toLowerCase().startsWith('exclude')) {
            return reason.substring(7) as Protocol.Network.CookieBlockedReason;
          }
          return reason as Protocol.Network.CookieBlockedReason;
        }
      );

      syncCookieStore?.addCookieExclusionWarningReason(
        cookie?.name + domainToUse + cookie?.path,
        modifiedCookieExclusionReasons,
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

  tabToRead = newTabId;

  syncCookieStore?.addTabData(Number(newTabId));
  syncCookieStore?.updateDevToolsState(Number(newTabId), true);
  syncCookieStore?.updatePopUpState(Number(newTabId), true);

  const currentTab = await getTab(Number(newTabId));

  syncCookieStore?.updateUrl(Number(newTabId), currentTab?.url ?? '');

  return newTabId;
};

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
// eslint-disable-next-line complexity
chrome.runtime.onMessage.addListener(async (request) => {
  if (!request.type) {
    return;
  }

  const incomingMessageType = request.type;

  if (SET_TAB_TO_READ === incomingMessageType) {
    tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    chrome.runtime.sendMessage({
      type: SET_TAB_TO_READ,
      payload: {
        tabId: Number(newTab),
      },
    });

    if (globalIsUsingCDP) {
      try {
        if (globalIsUsingCDP) {
          await chrome.debugger.attach({ tabId: Number(newTab) }, '1.3');
          await chrome.debugger.sendCommand(
            { tabId: Number(newTab) },
            'Network.enable'
          );
          await chrome.debugger.sendCommand(
            { tabId: Number(newTab) },
            'Audits.enable'
          );
        } else {
          await chrome.debugger.detach({ tabId: Number(newTab) });
        }
      } catch (error) {
        //Fail silently
      }
    }

    await reloadCurrentTab(Number(newTab));
  }

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
      tabMode = sessionStorage.allowedNumberOfTabs;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      globalIsUsingCDP = sessionStorage.isUsingCDP;
    }

    await chrome.storage.session.remove(['allowedNumberOfTabs', 'isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      allowedNumberOfTabs: tabMode,
      isUsingCDP: globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});

    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }
        try {
          if (globalIsUsingCDP) {
            await chrome.debugger.attach({ tabId: id }, '1.3');
            await chrome.debugger.sendCommand({ tabId: id }, 'Network.enable');
            await chrome.debugger.sendCommand({ tabId: id }, 'Audits.enable');
          } else {
            await chrome.debugger.detach({ tabId: id });
          }
        } catch (error) {
          //Fail silently
        }
        resetCookieBadgeText(id);
        await reloadCurrentTab(id);
      })
    );

    await chrome.runtime.sendMessage({
      type: SERVICE_WORKER_RELOAD_MESSAGE,
    });
  }

  if (!request?.payload?.tabId) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId;

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string | boolean } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }

    if (
      !syncCookieStore?.tabs[incomingMessageTabId] &&
      tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(incomingMessageTabId);
      dataToSend['psatOpenedAfterPageLoad'] = request.payload.doNotReReload
        ? false
        : true;
      syncCookieStore?.addTabData(incomingMessageTabId);
      syncCookieStore?.updateUrl(incomingMessageTabId, currentTab?.url || '');
    }

    chrome.runtime.sendMessage({
      type: INITIAL_SYNC,
      payload: dataToSend,
    });

    syncCookieStore?.updateDevToolsState(incomingMessageTabId, true);

    if (syncCookieStore?.tabsData[incomingMessageTabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (POPUP_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }

    chrome.runtime.sendMessage({
      type: INITIAL_SYNC,
      payload: dataToSend,
    });

    syncCookieStore?.updatePopUpState(incomingMessageTabId, true);

    if (syncCookieStore?.tabsData[incomingMessageTabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (DEVTOOLS_CLOSE === incomingMessageType) {
    syncCookieStore?.updateDevToolsState(incomingMessageTabId, false);
  }

  if (POPUP_CLOSE === incomingMessageType) {
    syncCookieStore?.updatePopUpState(incomingMessageTabId, false);
  }

  if (DEVTOOLS_SET_JAVASCSCRIPT_COOKIE === incomingMessageType) {
    syncCookieStore?.update(incomingMessageTabId, request?.payload?.cookieData);
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
      try {
        await chrome.runtime.sendMessage({
          type: INITIAL_SYNC,
          payload: {
            tabMode,
            tabToRead: tabToRead,
          },
        });
      } catch (error) {
        //Fail silently
      }

      tabs.map((tab) => {
        if (!tab?.id) {
          return tab;
        }

        resetCookieBadgeText(tab.id);

        syncCookieStore?.removeTabData(tab.id);

        return tab;
      });
    } else {
      try {
        await chrome.runtime.sendMessage({
          type: INITIAL_SYNC,
          payload: {
            tabMode,
            tabToRead: tabToRead,
          },
        });
      } catch (error) {
        //Fail silently
      }

      tabs.forEach((tab) => {
        if (!tab?.id) {
          return;
        }
        syncCookieStore?.addTabData(tab.id);
        syncCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
        syncCookieStore?.updateDevToolsState(tab.id, true);
      });
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

    const tabs = await chrome.tabs.query({});

    if (!changes?.isUsingCDP?.newValue) {
      await Promise.all(
        tabs.map(async ({ id }) => {
          if (!id) {
            return;
          }

          try {
            await chrome.debugger.detach({ tabId: id });
            syncCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        })
      );
    } else {
      tabs.forEach(({ id }) => {
        if (!id) {
          return;
        }

        syncCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
      });
    }
  }
);
