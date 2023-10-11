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
import updateStorage from './utils/updateStorage';
import type { TabData, CookieData } from './types';
import { getCookieKey } from '@cookie-analysis-tool/common';
import fetchTopicsTaxonomy from '../utils/fetchTopicsTaxonomy';

const CookieStore = {
  /**
   * Update cookie store.
   * @param {string} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  async update(tabId: string, cookies: CookieData[]) {
    await updateStorage(tabId, (prevState: TabData) => {
      const _prevCookies = prevState?.cookies || {};
      const _updatedCookies = _prevCookies;

      for (const cookie of cookies) {
        const { name, domain, path } = cookie.parsedCookie;

        if (!name || !domain || !path) {
          continue;
        }

        const cookieKey = getCookieKey(cookie.parsedCookie);

        if (_updatedCookies?.[cookieKey]) {
          _updatedCookies[cookieKey] = {
            ...cookie,
            headerType:
              _updatedCookies[cookieKey].headerType === 'javascript'
                ? _updatedCookies[cookieKey].headerType
                : cookie.headerType,
            frameIdList: Array.from(
              new Set<number>([
                ...cookie.frameIdList,
                ..._updatedCookies[cookieKey].frameIdList,
              ])
            ),
          };
        } else {
          _updatedCookies[cookieKey] = cookie;
        }
      }

      return {
        ...prevState,
        cookies: _updatedCookies,
      };
    });
  },

  /**
   * Deletes a cookie
   * @param {string} cookieName Name of the cookie.
   */
  async deleteCookie(cookieName: string) {
    const storage = await chrome.storage.local.get();

    Object.values(storage).forEach((tabData) => {
      if (tabData.cookies && tabData.cookies[cookieName]) {
        delete tabData.cookies[cookieName];
      }
    });

    await chrome.storage.local.set(storage);
  },

  /**
   * Update the focusedAt timestamp for the tab.
   * @param {string} tabId The active tab id.
   */
  async updateTabFocus(tabId: string) {
    const storage = await chrome.storage.local.get();
    if (storage[tabId]) {
      storage[tabId].focusedAt = Date.now();
    }

    await chrome.storage.local.set(storage);
  },

  /**
   * Clear cookie data
   * @param {string} tabId The active tab id.
   */
  async removeCookieData(tabId: string) {
    const storage = await chrome.storage.local.get();

    if (storage[tabId]) {
      storage[tabId].cookies = {};
    }

    await chrome.storage.local.set(storage);
  },

  /**
   * Creates an entry for a tab
   * @param {string} tabId The tab id.
   */
  async addTabData(tabId: string) {
    const extensionStorage = await chrome.storage.sync.get();
    const allowedTabs = extensionStorage?.allowedNumberOfTabs;

    if (allowedTabs && allowedTabs !== 'unlimited') {
      await chrome.storage.local.set({
        [tabId]: {
          cookies: {},
          focusedAt: Date.now(),
        },
        tabToRead: tabId,
      });
    } else {
      await chrome.storage.local.set({
        [tabId]: {
          cookies: {},
          focusedAt: Date.now(),
        },
      });
    }
    chrome.storage.session.set({ [tabId]: true });
  },

  /**
   * Remove the tab data from the store.
   * @param {string} tabId The tab id.
   */
  async removeTabData(tabId: string) {
    await chrome.storage.local.remove(tabId);
    await chrome.storage.session.remove(tabId);
  },

  /**
   * Remove the window's all tabs data from the store.
   * @param {number} windowId The window id.
   */
  async removeWindowData(windowId: number) {
    const tabs = await chrome.tabs.query({ windowId });

    const tabPromises = tabs.map(async (tab) => {
      if (tab.id) {
        await CookieStore.removeTabData(tab.id.toString());
      }
    });

    await Promise.all(tabPromises);
  },

  /**
   * Handle topics.
   * @param {string} activeTabUrl The active tab origin location.
   * @param {number[]} topics The topics for active tab.
   */
  async setTopics(activeTabUrl: string, topics: (string | number)[] = []) {
    const storage = await chrome.storage.local.get();

    if (!storage[activeTabUrl]) {
      storage[activeTabUrl] = {};
    }

    const topicsTaxonomy = await fetchTopicsTaxonomy();

    storage[activeTabUrl].topics = topics.map(
      (topicsId) => topicsTaxonomy[topicsId]
    );

    await chrome.storage.local.set(storage);
  },

  /**
   * Get topics list.
   * @param {string} activeTabUrl The host name for which topics is to be fetched.
   * @returns {Promise<string[]>} The list of topics.
   */
  async getTopics(activeTabUrl: string): Promise<string[]> {
    const storage = await chrome.storage.local.get();

    if (storage && storage[activeTabUrl] && storage[activeTabUrl].topics) {
      return storage[activeTabUrl].topics;
    }

    return [];
  },
};

export default CookieStore;
