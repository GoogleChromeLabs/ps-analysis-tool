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
    const newCookies: { [key: string]: CookieData } = {};

    for (const cookie of cookies) {
      if (cookie) {
        newCookies[cookie.parsedCookie.name + cookie.parsedCookie.domain] =
          cookie;
      }
    }

    await updateStorage(tabId, (prevState: TabData) => {
      const updatedCookies = {
        ...(prevState?.cookies || []),
        ...newCookies,
      };

      return {
        ...prevState,
        cookies: updatedCookies,
      };
    });
  },

  /**
   * Update tab location.
   * @param {string} tabId Tab id.
   * @param {string} url Tab url.
   * @param {number} focusedAt The timestamp, when the tab was focused.
   */
  async updateTabLocation(tabId: string, url: string, focusedAt: number) {
    await updateStorage(tabId, (prevState: TabData) => ({
      ...prevState,
      cookies: {},
      url,
      focusedAt,
    }));
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
