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
} from '@ps-analysis-tool/common';
import { Protocol } from 'devtools-protocol';

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
import isSingleTabProcessingMode from '../utils/isSingleTabProcessingMode';
import addAuditsIssues from '../utils/addAuditsIssues';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';

let cookieDB: CookieDatabase | null = null;

// Global promise queue.
const PROMISE_QUEUE = new PQueue({ concurrency: 1 });

let globalIsUsingCDP = false;

const cdpURLToRequestMap: {
  [tabId: string]: {
    [requestId: string]: string;
  };
} = {};

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
  (details: chrome.webRequest.WebResponseCacheDetails) => {
    (async () => {
      await PROMISE_QUEUE.add(async () => {
        const { tabId, url, responseHeaders, frameId } = details;
        const tab = await getTab(tabId);

        if (!tab || !responseHeaders || tab.url === 'chrome://newtab/') {
          return;
        }

        const _isSingleTabProcessingMode = await isSingleTabProcessingMode();

        if (_isSingleTabProcessingMode) {
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

        const cookies = await responseHeaders.reduce<Promise<CookieData[]>>(
          async (accumulator, header) => {
            if (
              header.name.toLowerCase() === 'set-cookie' &&
              header.value &&
              tab.url &&
              cookieDB
            ) {
              let cdpCookies;
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

/**
 * Fires before sending an HTTP request, once the request headers are available.
 * @see https://developer.chrome.com/docs/extensions/reference/api/webRequest#event-onBeforeSendHeaders
 */
chrome.webRequest.onBeforeSendHeaders.addListener(
  ({ url, requestHeaders, tabId, frameId }) => {
    (async () => {
      await PROMISE_QUEUE.add(async () => {
        const tab = await getTab(tabId);

        if (!tab || !requestHeaders || tab.url === 'chrome://newtab/') {
          return;
        }

        const _isSingleTabProcessingMode = await isSingleTabProcessingMode();

        if (_isSingleTabProcessingMode) {
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

/**
 * Fires when a tab is created.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  await PROMISE_QUEUE.add(async () => {
    if (!tab.id) {
      return;
    }

    const _isSingleTabProcessingMode = await isSingleTabProcessingMode();

    if (_isSingleTabProcessingMode) {
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
  });
});

/**
 * Fires when the tab is focused,
 * When a new window is opened,
 * Not when the tab is refreshed or a new website is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onActivated
 */
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.updateTabFocus(activeInfo.tabId.toString());
  });
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved
 */
chrome.tabs.onRemoved.addListener(async (tabId) => {
  PROMISE_QUEUE.clear();
  await PROMISE_QUEUE.add(async () => {
    await CookieStore.removeTabData(tabId.toString());
  });
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
  if (changeInfo.status === 'loading' && tab.url) {
    PROMISE_QUEUE.clear();
    await PROMISE_QUEUE.add(async () => {
      await CookieStore.removeCookieData(tabId.toString());
    });
  }
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved
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
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled
 * @todo Shouldn't have to reinstall the extension.
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  PROMISE_QUEUE.clear();
  await PROMISE_QUEUE.add(async () => {
    await chrome.storage.local.clear();
    if (details.reason === 'install') {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set({
        allowedNumberOfTabs: 'single',
        isUsingCDP: false,
      });
    }
    if (details.reason === 'update') {
      const preSetSettings = await chrome.storage.sync.get();
      if (preSetSettings?.isUsingCDP) {
        globalIsUsingCDP = preSetSettings?.isUsingCDP;
      }
      if (preSetSettings?.allowedNumberOfTabs) {
        return;
      }

      if (preSetSettings?.isUsingCDP) {
        globalIsUsingCDP = preSetSettings?.isUsingCDP;
      }

      await chrome.storage.sync.clear();
      await chrome.storage.sync.set({
        allowedNumberOfTabs: 'single',
        isUsingCDP: globalIsUsingCDP,
      });
    }
  });
});

/**
 * Fires whenever debugging target issues instrumentation event.
 * @see https://developer.chrome.com/docs/extensions/reference/api/debugger
 */
chrome.debugger.onEvent.addListener((source, method, params) => {
  if (!ALLOWED_EVENTS.includes(method)) {
    return;
  }
  (async () => {
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
      const url = tab && tab[0] ? tab[0].url : '';
      const localStorage = await chrome.storage.local.get();
      if (
        (await isSingleTabProcessingMode()) &&
        localStorage?.tabToRead !== tabId
      ) {
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

        const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
          requestParams,
          cookieDB,
          cdpURLToRequestMap[tabId],
          url ?? ''
        );

        await CookieStore.update(tabId, cookies);
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
          cookieDB
        );

        await CookieStore.update(tabId, allCookies);
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

        await addAuditsIssues(
          details.cookieIssueDetails,
          source.tabId.toString()
        );
      }
    });
  })();
});

const listenToNewTab = async (tabId?: number) => {
  const newTabId = tabId?.toString() || (await getCurrentTabId());

  if (!newTabId) {
    return '';
  }

  if (await isSingleTabProcessingMode()) {
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

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
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

  if (request.type === 'CHANGE_CDP_SETTING') {
    if (typeof request.payload?.isUsingCDP !== 'undefined') {
      globalIsUsingCDP = request.payload?.isUsingCDP;
      (async () => {
        const storage = await chrome.storage.sync.get();
        await chrome.storage.sync.set({
          ...storage,
          isUsingCDP: globalIsUsingCDP,
        });
      })();
    }
  }
});

/**
 * Listen to local storage changes.
 * @see https://developer.chrome.com/docs/extensions/reference/api/storage#event-onChanged
 */
chrome.storage.local.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (!changes?.tabToRead || !changes?.tabToRead?.oldValue) {
      return;
    }

    const tabId = changes.tabToRead.oldValue;

    if (!tabId || !(await isSingleTabProcessingMode())) {
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
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.allowedNumberOfTabs ||
      typeof changes?.allowedNumberOfTabs?.newValue === 'undefined'
    ) {
      return;
    }

    if (changes?.allowedNumberOfTabs?.newValue === 'single') {
      PROMISE_QUEUE.clear();

      await PROMISE_QUEUE.add(async () => {
        const tabs = await chrome.tabs.query({});

        await Promise.all(
          tabs.map(async (tab) => {
            if (!tab?.id) {
              return;
            }

            await chrome.action.setBadgeText({
              tabId: tab?.id,
              text: '',
            });
          })
        );

        await chrome.storage.local.clear();
      });
    } else {
      PROMISE_QUEUE.clear();

      await PROMISE_QUEUE.add(async () => {
        const tabs = await chrome.tabs.query({});

        await Promise.all(
          tabs.map(async (tab) => {
            if (!tab?.id) {
              return;
            }
            await CookieStore.addTabData(tab.id?.toString());
            await chrome.tabs.reload(Number(tab?.id));
          })
        );
      });
    }
  }
);

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.isUsingCDP ||
      typeof changes?.isUsingCDP?.newValue === 'undefined'
    ) {
      return;
    }

    globalIsUsingCDP = changes?.isUsingCDP?.newValue;

    chrome.runtime.sendMessage({
      type: 'CHANGE_CDP_SETTING',
      payload: {
        isUsingCDP: changes?.isUsingCDP?.newValue,
      },
    });

    if (!changes?.isUsingCDP?.newValue) {
      PROMISE_QUEUE.clear();

      await PROMISE_QUEUE.add(async () => {
        const storedTabData = Object.keys(await chrome.storage.local.get());

        await Promise.all(
          storedTabData.map(async (key) => {
            if (!Number(key)) {
              return;
            }

            try {
              await chrome.debugger.detach({ tabId: Number(key) });
              await CookieStore.removeTabData(key);
            } catch (error) {
              // Fail silently
            } finally {
              await chrome.tabs.reload(Number(key), { bypassCache: true });
            }
          })
        );
      });
    } else {
      PROMISE_QUEUE.clear();

      await PROMISE_QUEUE.add(async () => {
        const storedTabData = Object.keys(await chrome.storage.local.get());

        await Promise.all(
          storedTabData.map(async (key) => {
            if (!Number(key)) {
              return;
            }

            await chrome.tabs.reload(Number(key), { bypassCache: true });
          })
        );
      });
    }
  }
);
