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
import updateStorage from './updateStorage';
import type { TabData, CookieData } from './types';

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
        const cookieName = cookie.parsedCookie.name;

        if (!cookieName) {
          continue;
        }

        if (_updatedCookies?.[cookieName]) {
          _updatedCookies[cookieName] = {
            ...cookie,
            frameIdList: Array.from(
              new Set<number>([
                ...cookie.frameIdList,
                ..._updatedCookies[cookieName].frameIdList,
              ])
            ),
          };
        } else {
          _updatedCookies[cookieName] = cookie;
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
      delete tabData.cookies[cookieName];
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
   * creates an entry for a tab
   * @param {string} tabId The tab id.
   */
  async addTabData(tabId: string) {
    await chrome.storage.local.set({
      [tabId]: {
        cookies: {},
        focusedAt: Date.now(),
      },
    });
  },

  /**
   * Remove the tab data from the store.
   * @param {string} tabId The tab id.
   */
  async removeTabData(tabId: string) {
    await chrome.storage.local.remove(tabId);
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
};

export default CookieStore;
