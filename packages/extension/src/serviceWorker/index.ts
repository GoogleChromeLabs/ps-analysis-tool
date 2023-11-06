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

/**
 * Internal dependencies.
 */
import { type CookieData, CookieStore } from '../localStore';
import parseResponseCookieHeader from './parseResponseCookieHeader';
import parseRequestCookieHeader from './parseRequestCookieHeader';
import { getTab } from '../utils/getTab';
import { getCurrentTabId } from '../utils/getCurrentTabId';
import {
  type CookieDatabase,
  fetchDictionary,
} from '../utils/fetchCookieDictionary';
import { ALLOWED_NUMBER_OF_TABS } from '../constants';

let cookieDB: CookieDatabase | null = null;

// Global promise queue.
const PROMISE_QUEUE = new PQueue({ concurrency: 1 });
/**
 * Fires when the browser receives a response from a web server.
 * @see https://developer.chrome.com/docs/extensions/reference/webRequest/
 */
chrome.webRequest.onResponseStarted.addListener(
  async (details: chrome.webRequest.WebResponseCacheDetails) => {
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
            const cookie = await parseResponseCookieHeader(
              url,
              header.value,
              cookieDB,
              tab.url,
              frameId
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
              const cookieList = await parseRequestCookieHeader(
                url,
                header.value,
                cookieDB,
                tab.url,
                frameId
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

chrome.webNavigation.onBeforeNavigate.addListener(() => {
  PROMISE_QUEUE.clear();
});
