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
  type NetworkRequestExtraInfoParams,
  type NetworkResponseReceivedExtraInfo,
  type NetworkRequestWillBeSentParams,
  type AuditParams,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { CookieStore } from '../localStore';
import parseResponseCookieHeader from './parseResponseCookieHeader';
import parseRequestCookieHeader from './parseRequestCookieHeader';
import { getTab } from '../utils/getTab';
import { getCurrentTab, getCurrentTabId } from '../utils/getCurrentTabId';
import {
  type CookieDatabase,
  fetchDictionary,
} from '../utils/fetchCookieDictionary';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';

let cookieDB: CookieDatabase | null = null;

// Global promise queue.
const PROMISE_QUEUE = new PQueue({ concurrency: 1 });
const cdpURLToRequestMap: {
  [tabId: string]: {
    [requestId: string]: string;
  };
} = {};
/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  (details: chrome.webRequest.WebResponseCacheDetails) => {
    (async () => {
      const extensionSettings = await chrome.storage.sync.get();

      if (
        extensionSettings &&
        extensionSettings?.allowedNumberOfTabs !== 'unlimited'
      ) {
        const currentTabId = await getCurrentTabId();

        if (!currentTabId) {
          return;
        }

        const tabsBeingListenedTo = await chrome.storage.local.get();

        if (
          tabsBeingListenedTo &&
          currentTabId !== tabsBeingListenedTo?.tabToRead
        ) {
          return;
        }
      }
      await PROMISE_QUEUE.add(async () => {
        const { tabId, url, responseHeaders, frameId } = details;
        const tab = await getTab(tabId);
        if (
          extensionSettings &&
          extensionSettings?.allowedNumberOfTabs !== 'unlimited'
        ) {
          const tabsBeingListenedTo = await chrome.storage.local.get();

          if (ALLOWED_NUMBER_OF_TABS > 0) {
            if (
              tabsBeingListenedTo &&
              tabId.toString() !== tabsBeingListenedTo?.tabToRead
            ) {
              return;
            }
          }
        }

        if (!tab || !responseHeaders || tab.url === 'chrome://newtab/') {
          return;
        }

        if (!cookieDB) {
          cookieDB = await fetchDictionary();
        }

        const cookies = await responseHeaders.reduce<Promise<CookieData[]>>(
          async (accumulator, header) => {
            if (
              header.name.toLowerCase() === 'set-cookie' &&
              header.value &&
              tab.url &&
              cookieDB
            ) {
              let cdpCookies;
              try {
                cdpCookies = await chrome.debugger.sendCommand(
                  { tabId: tabId },
                  'Network.getCookies',
                  { urls: [url] }
                );
              } catch (error) {
                // Fail silently
              }
              const cookie = await parseResponseCookieHeader(
                url,
                header.value,
                cookieDB,
                tab.url,
                frameId,
                cdpCookies?.cookies ?? []
              );
              return [...(await accumulator), cookie];
            }
            return accumulator;
          },
          Promise.resolve([])
        );
        // Adds the cookies from the request headers to the cookies object.
        await CookieStore.update(tabId.toString(), cookies);
      });
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'responseHeaders']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url, requestHeaders, tabId, frameId }) => {
    (async () => {
      const extensionSettings = await chrome.storage.sync.get();

      if (
        extensionSettings &&
        extensionSettings?.allowedNumberOfTabs !== 'unlimited'
      ) {
        const currentTabId = await getCurrentTabId();

        if (!currentTabId) {
          return;
        }

        const tabsBeingListenedTo = await chrome.storage.local.get();

        if (
          tabsBeingListenedTo &&
          currentTabId !== tabsBeingListenedTo?.tabToRead
        ) {
          return;
        }
      }
      await PROMISE_QUEUE.add(async () => {
        const tab = await getTab(tabId);

        if (!tab || !requestHeaders || tab.url === 'chrome://newtab/') {
          return;
        }
        if (
          extensionSettings &&
          extensionSettings?.allowedNumberOfTabs !== 'unlimited'
        ) {
          const tabsBeingListenedTo = await chrome.storage.local.get();
          if (
            tabsBeingListenedTo &&
            tabId.toString() !== tabsBeingListenedTo?.tabToRead
          ) {
            return;
          }
        }
        if (!cookieDB) {
          cookieDB = await fetchDictionary();
        }

        const cookies = await requestHeaders.reduce<Promise<CookieData[]>>(
          async (accumulator, header) => {
            if (
              header.name.toLowerCase() === 'cookie' &&
              header.value &&
              url &&
              tab.url &&
              cookieDB
            ) {
              let cdpCookies;
              try {
                cdpCookies = await chrome.debugger.sendCommand(
                  { tabId: tabId },
                  'Network.getCookies',
                  { urls: [url] }
                );
              } catch (error) {
                // Fail silently
              }
              const cookieList = await parseRequestCookieHeader(
                url,
                header.value,
                cookieDB,
                tab.url,
                frameId,
                cdpCookies?.cookies ?? []
              );
              return [...(await accumulator), ...cookieList];
            }
            return accumulator;
          },
          Promise.resolve([])
        );

        await CookieStore.update(tabId.toString(), cookies);
      });
    })();
  },
  { urls: ['*://*/*'] },
  ['extraHeaders', 'requestHeaders']
);

chrome.tabs.onCreated.addListener(async (tab) => {
  await PROMISE_QUEUE.add(async () => {
    if (tab.id) {
      const extensionSettings = await chrome.storage.sync.get();
      if (
        extensionSettings?.allowedNumberOfTabs &&
        extensionSettings?.allowedNumberOfTabs !== 'unlimited'
      ) {
        const previousTabData = await chrome.storage.local.get();
        const doesTabExist = await getTab(previousTabData?.tabToRead);
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
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.removeTabData(tabId.toString());
  });
});

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/tabs/#event-onUpdated
 */
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  await PROMISE_QUEUE.add(async () => {
    if (changeInfo.status === 'loading' && tab.url) {
      await CookieStore.removeCookieData(tabId.toString());
    }
  });
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
  await PROMISE_QUEUE.add(async () => {
    await chrome.storage.local.clear();
    if (details.reason === 'install') {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set({
        allowedNumberOfTabs: 'single',
        isUsingCDP: true,
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
        isUsingCDP: true,
      });
    }
  });
});

chrome.debugger.onEvent.addListener(async (source, method, params) => {
  // eslint-disable-next-line complexity
  await PROMISE_QUEUE.add(async () => {
    let tabId = '';

    if (!source?.tabId) {
      return;
    }

    if (!cookieDB) {
      cookieDB = await fetchDictionary();
    }

    tabId = source?.tabId?.toString();
    const tab = await getCurrentTab();
    if (method === 'Network.requestWillBeSent' && params) {
      const request = params as NetworkRequestWillBeSentParams;
      if (!cdpURLToRequestMap[tabId]) {
        cdpURLToRequestMap[tabId] = {
          [request.requestId]: request?.documentURL,
        };
      } else {
        cdpURLToRequestMap[tabId] = {
          ...cdpURLToRequestMap[tabId],
          [request.requestId]: request?.documentURL,
        };
      }
    }

    if (method === 'Network.requestWillBeSentExtraInfo' && params) {
      const requestParams = params as NetworkRequestExtraInfoParams;
      const syncStorage = await chrome.storage.sync.get();
      const localStorage = await chrome.storage.local.get();

      if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs === 'unlimited'
      ) {
        const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
          requestParams,
          cookieDB,
          cdpURLToRequestMap[tabId],
          tab ? tab[0]?.url : ''
        );

        await CookieStore.update(tabId, cookies);
      } else if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs !== 'unlimited' &&
        localStorage.tabToRead === tabId
      ) {
        const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
          requestParams,
          cookieDB,
          cdpURLToRequestMap[tabId],
          tab ? tab[0]?.url : ''
        );

        await CookieStore.update(tabId, cookies);
      }
    }

    if (method === 'Network.responseReceivedExtraInfo' && params) {
      const responseParams = params as NetworkResponseReceivedExtraInfo;
      const syncStorage = await chrome.storage.sync.get();
      const localStorage = await chrome.storage.local.get();
      if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs === 'unlimited'
      ) {
        if (responseParams.headers['Set-Cookie']) {
          const allCookies = parseResponseReceivedExtraInfo(
            responseParams,
            cdpURLToRequestMap[tabId],
            tab ? tab[0]?.url : '',
            cookieDB
          );
          await CookieStore.update(tabId, allCookies);
        }
      } else if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs !== 'unlimited' &&
        localStorage.tabToRead === tabId
      ) {
        if (responseParams.headers['Set-Cookie']) {
          const allCookies = parseResponseReceivedExtraInfo(
            responseParams,
            cdpURLToRequestMap[tabId],
            tab ? tab[0]?.url : '',
            cookieDB
          );

          await CookieStore.update(tabId, allCookies);
        }
      }
    }

    if (method === 'Audits.issueAdded' && params) {
      const auditParams = params as AuditParams;
      const syncStorage = await chrome.storage.sync.get();
      const localStorage = await chrome.storage.local.get();
      const { code, details } = auditParams.issue;
      if (
        code !== 'CookieIssue' &&
        !details?.cookieIssueDetails &&
        !details?.cookieIssueDetails?.cookie &&
        !details?.cookieIssueDetails?.cookieWarningReasons &&
        !details?.cookieIssueDetails?.cookieExclusionReasons
      ) {
        return;
      }
      if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs === 'unlimited'
      ) {
        const { cookie, cookieExclusionReasons, cookieWarningReasons } =
          details.cookieIssueDetails;
        const primaryDomain = cookie.domain.startsWith('.')
          ? cookie.domain
          : '.' + cookie.domain;
        const secondaryDomain = cookie.domain.startsWith('.')
          ? cookie.domain.slice(1)
          : cookie.domain;
        await CookieStore.addCookieExclusionWarningReason(
          cookie.name + primaryDomain + cookie.path,
          cookie.name + secondaryDomain + cookie.path,
          cookieExclusionReasons,
          cookieWarningReasons,
          source?.tabId.toString()
        );
      } else if (
        syncStorage.allowedNumberOfTabs &&
        syncStorage.allowedNumberOfTabs !== 'unlimited' &&
        localStorage.tabToRead === tabId
      ) {
        const { cookie, cookieExclusionReasons, cookieWarningReasons } =
          details.cookieIssueDetails;
        const primaryDomain = cookie.domain.startsWith('.')
          ? cookie.domain
          : '.' + cookie.domain;
        const secondaryDomain = cookie.domain.startsWith('.')
          ? cookie.domain.slice(1)
          : cookie.domain;
        await CookieStore.addCookieExclusionWarningReason(
          cookie.name + primaryDomain + cookie.path,
          cookie.name + secondaryDomain + cookie.path,
          cookieExclusionReasons,
          cookieWarningReasons,
          source?.tabId.toString()
        );
      }
    }
  });
});

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  const localStorage = await chrome.storage.local.get();
  const syncStorage = await chrome.storage.sync.get();
  if (
    syncStorage.allowedNumberOfTabs &&
    syncStorage.allowedNumberOfTabs !== 'unlimited'
  ) {
    if (
      details.tabId.toString() === localStorage.tabToRead &&
      !localStorage[details.tabId?.toString()]?.isDebuggerAttached &&
      details.url &&
      !details.url.startsWith('chrome://') &&
      !details.url.startsWith('about:blank') &&
      syncStorage?.isUsingCDP
    ) {
      try {
        await chrome.debugger.attach({ tabId: details.tabId }, '1.3');
        localStorage[details.tabId?.toString()].isDebuggerAttached = true;
        chrome.debugger.sendCommand({ tabId: details.tabId }, 'Network.enable');
        chrome.debugger.sendCommand({ tabId: details.tabId }, 'Audits.enable');
        await chrome.storage.local.set(localStorage);
      } catch (error) {
        //Silently fail
      }
    }
  } else {
    if (
      details.tabId &&
      localStorage[details.tabId?.toString()] &&
      !localStorage[details.tabId?.toString()]?.isDebuggerAttached &&
      details.url &&
      !details.url.startsWith('chrome://') &&
      !details.url.startsWith('about:blank') &&
      syncStorage?.isUsingCDP
    ) {
      try {
        await chrome.debugger.attach({ tabId: details.tabId }, '1.3');
        localStorage[details.tabId?.toString()].isDebuggerAttached = true;
        chrome.debugger.sendCommand({ tabId: details.tabId }, 'Network.enable');
        chrome.debugger.sendCommand({ tabId: details.tabId }, 'Audits.enable');
        await chrome.storage.local.set(localStorage);
      } catch (error) {
        //Silently fail
      }
    }
  }
});

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    const localStorage = await chrome.storage.local.get();
    const syncStorage = await chrome.storage.sync.get();
    if (
      syncStorage.allowedNumberOfTabs &&
      syncStorage.allowedNumberOfTabs !== 'unlimited' &&
      localStorage?.tabToRead
    ) {
      if (
        Object.keys(changes).includes('isUsingCDP') &&
        localStorage?.tabToRead
      ) {
        if (!changes['isUsingCDP'].newValue) {
          chrome.debugger.detach({ tabId: Number(localStorage.tabToRead) });
          localStorage[localStorage.tabToRead].isDebuggerAttached = false;
          chrome.storage.local.set(localStorage);
        } else if (changes['isUsingCDP'].newValue) {
          try {
            await chrome.debugger.attach(
              { tabId: Number(localStorage.tabToRead) },
              '1.3'
            );
            localStorage[localStorage.tabToRead].isDebuggerAttached = true;
            chrome.debugger.sendCommand(
              { tabId: Number(localStorage.tabToRead) },
              'Network.enable'
            );
            chrome.debugger.sendCommand(
              { tabId: Number(localStorage.tabToRead) },
              'Audits.enable'
            );
            await chrome.storage.local.set(localStorage);
          } catch (error) {
            //just catch the error.
          }
        }
      }
    } else if (
      syncStorage.allowedNumberOfTabs &&
      syncStorage.allowedNumberOfTabs !== 'single'
    ) {
      if (Object.keys(changes).includes('isUsingCDP')) {
        if (!changes['isUsingCDP'].newValue) {
          const tabs = await chrome.tabs.query({ active: true });
          tabs.map((tab) => {
            chrome.debugger.detach({ tabId: tab?.id });
            localStorage[tab?.id?.toString()].isDebuggerAttached = false;
            chrome.storage.local.set(localStorage);
            return tab;
          });
        } else if (changes['isUsingCDP'].newValue) {
          const tabs = await chrome.tabs.query({ active: true });
          tabs.map((tab) => {
            chrome.debugger.detach({ tabId: tab?.id });
            localStorage[tab?.id?.toString()].isDebuggerAttached = true;
            return tab;
          });
          await chrome.storage.local.set(localStorage);
        }
      }
    }
  }
);
