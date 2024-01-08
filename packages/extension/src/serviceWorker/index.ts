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
import PQueue from 'p-queue';
import {
  type CookieData,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
  getCookieKey,
  type BlockedReason,
} from '@ps-analysis-tool/common';
import { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import { CookieStore } from '../localStore';
import parseResponseCookieHeader from './parseResponseCookieHeader';
import parseRequestCookieHeader from './parseRequestCookieHeader';
import {
  type CookieDatabase,
  fetchDictionary,
} from '../utils/fetchCookieDictionary';
import addAuditsIssues from '../utils/addAuditsIssues';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';

let cookieDB: CookieDatabase | null = null;

// Global promise queue.
const PROMISE_QUEUE = new PQueue({ concurrency: 1 });

const cdpURLToRequestMap: {
  [tabId: string]: {
    [requestId: string]: string;
  };
} = {};

let tabMode = '';
let tabToRead = '';

const cachedTabsData: { [key: number]: any } = {};

const tabs: { [key: number]: { url: string; devToolsOpenState: boolean } } = {};

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfor',
  'Audits.issueAdded',
];

const updateData = (tabId: number, data: any) => {
  //await CookieStore.update(tabId, data);
  if (!cachedTabsData[tabId]) {
    return;
  }

  for (const cookie of data) {
    const { name, domain, path } = cookie.parsedCookie;
    if (!name || !domain || !path) {
      continue;
    }
    let cookieKey = getCookieKey(cookie.parsedCookie);
    if (!cookieKey) {
      continue;
    }
    const blockedReasons: BlockedReason[] = [
      ...new Set<BlockedReason>([
        ...(cookie?.blockedReasons ?? []),
        ...(cachedTabsData[tabId][cookieKey]?.blockedReasons ?? []),
      ]),
    ];
    cookieKey = cookieKey?.trim();
    if (cachedTabsData[tabId]?.[cookieKey]) {
      cachedTabsData[tabId][cookieKey] = {
        ...cachedTabsData[tabId][cookieKey],
        ...cookie,
        parsedCookie: {
          ...cachedTabsData[tabId][cookieKey].parsedCookie,
          ...cookie.parsedCookie,
          priority:
            cookie.parsedCookie?.priority ??
            cachedTabsData[tabId][cookieKey].parsedCookie?.priority ??
            'Medium',
          partitionKey:
            cookie.parsedCookie?.partitionKey ??
            cachedTabsData[tabId][cookieKey].parsedCookie?.partitionKey,
        },
        isBlocked: blockedReasons.length > 0,
        blockedReasons,
        warningReasons: Array.from(
          new Set<Protocol.Audits.CookieWarningReason>([
            ...(cookie.warningReasons ?? []),
            ...(cachedTabsData[tabId][cookieKey].warningReasons ?? []),
          ])
        ),
        headerType:
          cachedTabsData[tabId][cookieKey].headerType === 'javascript'
            ? cachedTabsData[tabId][cookieKey].headerType
            : cookie.headerType,
        frameIdList: Array.from(
          new Set<number>([
            ...(cookie.frameIdList ?? []),
            ...(cachedTabsData[tabId][cookieKey].frameIdList ?? []),
          ])
        ),
      };
    } else {
      cachedTabsData[tabId][cookieKey] = cookie;
    }
  }

  if (tabs[Number(tabId)].devToolsOpenState) {
    chrome.runtime.sendMessage({
      type: 'NEW_COOKIE_DATA',
      payload: {
        cookieData: JSON.stringify(cachedTabsData[tabId]),
      },
    });
  }
};

/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  (details: chrome.webRequest.WebResponseCacheDetails) => {
    (async () => {
      await PROMISE_QUEUE.add(async () => {
        const { tabId, url, responseHeaders, frameId } = details;

        if (
          !tabs[tabId] ||
          !responseHeaders ||
          tabs[tabId].url === 'chrome://newtab/'
        ) {
          return;
        }

        const _isSingleTabProcessingMode = tabMode && tabMode !== 'unlimited';

        if (_isSingleTabProcessingMode) {
          if (tabToRead && tabId.toString() !== tabToRead) {
            return;
          }
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
        const cookies = responseHeaders.reduce<CookieData[]>(
          (accumulator, header) => {
            if (
              header.name.toLowerCase() === 'set-cookie' &&
              header.value &&
              tabs[tabId].url &&
              cookieDB
            ) {
              const cookie = parseResponseCookieHeader(
                url,
                header.value,
                cookieDB,
                tabs[tabId].url,
                frameId,
                cdpCookies?.cookies ?? []
              );

              return [...accumulator, cookie];
            }
            return accumulator;
          },
          []
        );

        if (cookies.length === 0) {
          return;
        }
        // Adds the cookies from the request headers to the cookies object.
        updateData(tabId, cookies);
      });
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url, requestHeaders, tabId, frameId }) => {
    (async () => {
      await PROMISE_QUEUE.add(async () => {
        if (
          !tabs[tabId] ||
          !requestHeaders ||
          tabs[tabId].url === 'chrome://newtab/'
        ) {
          return;
        }

        if (tabMode && tabMode !== 'unlimited') {
          if (tabToRead && tabId.toString() !== tabToRead) {
            return;
          }
        }

        if (!cookieDB) {
          cookieDB = await fetchDictionary();
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

        const cookies = await requestHeaders.reduce<CookieData[]>(
          (accumulator, header) => {
            if (
              header.name.toLowerCase() === 'cookie' &&
              header.value &&
              url &&
              tabs[tabId].url &&
              cookieDB
            ) {
              const cookieList = parseRequestCookieHeader(
                url,
                header.value,
                cookieDB,
                tabs[tabId].url,
                frameId,
                cdpCookies?.cookies ?? []
              );
              return [...accumulator, ...cookieList];
            }
            return accumulator;
          },
          []
        );

        if (cookies.length === 0) {
          return;
        }

        updateData(tabId, cookies);
      });
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);

chrome.tabs.onCreated.addListener(async (tab) => {
  await PROMISE_QUEUE.add(async () => {
    if (!tab.id) {
      return;
    }
    cachedTabsData[tab.id] = {};
    if (!tabs[tab.id]) {
      tabs[tab.id] = { url: tab.url ?? '', devToolsOpenState: false };
    } else {
      tabs[tab.id].url = tab.url ?? '';
    }

    if (tabMode && tabMode !== 'unlimited') {
      const previousTabData = await chrome.storage.local.get();
      const doesTabExist = tabToRead;
      if (
        Object.keys(previousTabData).length - 1 >= ALLOWED_NUMBER_OF_TABS &&
        doesTabExist
      ) {
        return;
      }
      await CookieStore.addTabData(tab.id.toString());
    } else {
      await CookieStore.addTabData(tab.id.toString());
    }
  });
});

/**
 * Fires when the tab is focused,
 * When a new window is opened,
 * Not when the tab is refreshed or a new website is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onActivated
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.updateTabFocus(activeInfo.tabId.toString());
  });
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onRemoved
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {
  PROMISE_QUEUE.clear();
  delete tabs[tabId];
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.removeTabData(tabId.toString());
  });
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
  if (!tabs[tabId]) {
    tabs[tabId] = { url: tab.url, devToolsOpenState: false };
  } else {
    tabs[tabId].url = tab.url;
  }
  if (changeInfo.status === 'loading' && tab.url) {
    PROMISE_QUEUE.clear();
    await PROMISE_QUEUE.add(async () => {
      await CookieStore.removeCookieData(tabId.toString());
    });
  }
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/windows/#event-onRemoved
 */
chrome.windows.onRemoved.addListener(async (windowId) => {
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.removeWindowData(windowId);
  });
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
  PROMISE_QUEUE.clear();
  await PROMISE_QUEUE.add(async () => {
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
});

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (ALLOWED_EVENTS.includes(method)) {
    return;
  }
  // eslint-disable-next-line complexity
  (async () => {
    let tabId = '';
    if (!source?.tabId) {
      return;
    }

    tabId = source?.tabId?.toString();

    const url = tabs[Number(tabId)]?.url ? tabs[Number(tabId)].url : '';

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
        url
      );

      if (cookies.length === 0) {
        return;
      }
      updateData(Number(tabId), cookies);
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
        url,
        cookieDB ?? {}
      );

      updateData(Number(tabId), allCookies);
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
      await PROMISE_QUEUE.add(async () => {
        await addAuditsIssues(
          details.cookieIssueDetails,
          source.tabId.toString()
        );
      });
    }
  })();
});

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();

  if (!newTabId) {
    return '';
  }

  if (tabMode && tabMode !== 'unlimited') {
    const storedTabData = Object.keys(await chrome.storage.local.get());
    storedTabData.some(async (tabIdToDelete) => {
      if (tabIdToDelete !== 'tabToRead') {
        await CookieStore.removeTabData(tabIdToDelete);
        try {
          await chrome.debugger.detach({ tabId: Number(tabIdToDelete) });
        } catch (error) {
          // Fail silently
        }
        await chrome.action.setBadgeText({
          tabId: Number(newTabId),
          text: '',
        });
      }
    });
  }

  await CookieStore.addTabData(newTabId);

  return newTabId;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request?.type === 'SET_TAB_TO_READ') {
    PROMISE_QUEUE.clear();
    PROMISE_QUEUE.add(async () => {
      const newTab = await listenToNewTab(request?.payload?.tabId);

      // Can't use sendResponse as delay is too long. So using sendMessage instead.
      chrome.runtime.sendMessage({
        type: 'syncCookieStore:SET_TAB_TO_READ',
        payload: {
          tabId: newTab,
        },
      });

      await chrome.tabs.reload(Number(newTab));
    });
  }

  if (request?.type === 'DEVTOOLS_STATE_OPEN') {
    if (!request?.payload?.tabId) {
      return;
    }
    tabs[request?.payload?.tabId].devToolsOpenState = true;
  }

  if (request?.type === 'DEVTOOLS_STATE_CLOSE') {
    if (!request?.payload?.tabId) {
      return;
    }
    tabs[request?.payload?.tabId].devToolsOpenState = false;
  }
});

chrome.storage.local.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (!changes?.tabToRead || !changes?.tabToRead?.oldValue) {
      return;
    }

    const tabId = changes.tabToRead.oldValue;
    tabToRead = changes.tabToRead.newValue;

    if (!tabId || (tabMode && tabMode !== 'unlimited')) {
      return;
    }

    PROMISE_QUEUE.clear();
    await CookieStore.removeTabData(tabId);
    await chrome.action.setBadgeText({
      tabId: parseInt(tabId),
      text: '',
    });
  }
);

chrome.storage.sync.onChanged.addListener(
  (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (changes && Object.keys(changes).includes('allowedNumberOfTabs')) {
      PROMISE_QUEUE.clear();
      tabMode = changes.allowedNumberOfTabs.newValue;
    }
  }
);
