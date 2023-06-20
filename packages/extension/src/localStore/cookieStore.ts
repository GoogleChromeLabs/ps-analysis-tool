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
import type { StorageValue, CookieData } from './types';
import { emptyTabData } from './consts';

const CookieStore = {
  /**
   * Update cookie store.
   * @param {number|string} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  async update(tabId: number, cookies: CookieData[]) {
    const newCookies: { [key: string]: CookieData } = {};

    for (const cookie of cookies) {
      if (cookie) {
        newCookies[cookie.parsedData.name + cookie.parsedData.domain] = cookie;
      }
    }

    await updateStorage(tabId, emptyTabData, (previousState: StorageValue) => {
      const updatedCookies = {
        ...previousState.cookies,
        ...newCookies,
      };

      return {
        ...previousState,
        cookies: updatedCookies,
      };
    });
  },

  /**
   * Update tab location.
   * @param {string|number} tabId Tab id.
   * @param {string} url Tab url.
   * @param {number} focusedAt The timestamp, when the tab was focused.
   */
  async updateTabLocation(tabId: number, url: string, focusedAt: number) {
    await updateStorage(tabId, emptyTabData, (x: StorageValue) => ({
      ...x,
      cookies: {},
      url,
      focusedAt,
    }));
  },

  /**
   * Update the focusedAt timestamp for the tab.
   * @param activeInfo The active tab info.
   */
  async updateTabFocus(activeInfo: chrome.tabs.TabActiveInfo) {
    const { tabId } = activeInfo;
    const storage = await chrome.storage.local.get();

    if (storage[tabId]) {
      storage[tabId].focusedAt = Date.now();
    }
    await chrome.storage.local.set(storage);
  },

  /**
   * Remove the tab data from the store.
   * @param tabId The tab id.
   */
  async removeTabData(tabId: number) {
    await chrome.storage.local.remove(tabId.toString());
  },

  /**
   * Remove the window's tabs data from the store.
   * @param windowId The window id.
   */
  async removeWindowData(windowId: number) {
    const tabs = await chrome.tabs.query({ windowId });

    tabs.forEach(async (tab) => {
      if (tab.id) {
        await CookieStore.removeTabData(tab.id);
      }
    });
  },
};

export default CookieStore;
