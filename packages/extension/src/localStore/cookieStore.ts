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

import type { CookieData, TabData } from './types';

const CookieStore = {
  clearStorage: async () => {
    await chrome.storage.local.clear();
  },

  deleteTabEntry: async (tabId: number) => {
    await chrome.storage.local.remove(tabId.toString());
  },

  createTabEntry: async (
    windowId: number,
    tabId: number,
    tabUrl: string | undefined,
    focusedAt: number | undefined
  ) => {
    const previousValue = await chrome.storage.local.get();
    await chrome.storage.local.set({
      ...previousValue,
      [tabId.toString()]: {
        windowId,
        cookies: {},
        url: tabUrl,
        focusedAt,
      },
    });
  },

  updateTabEntry: async (tabId: number, updates: Partial<TabData>) => {
    const previousVal = await chrome.storage.local.get(tabId.toString());

    if (Object.keys(previousVal).includes(tabId.toString())) {
      await chrome.storage.local.set({
        [tabId.toString()]: {
          ...previousVal[tabId.toString()],
          ...updates,
        },
      });
    }
  },

  addCookiesToTabEntry: async (tabId: number, cookies: CookieData[]) => {
    try {
      const tab = await chrome.tabs.get(tabId);
      const previousVal = await chrome.storage.local.get(tabId.toString());

      if (Object.keys(previousVal).includes(tabId.toString())) {
        const newCookies: { [key: string]: CookieData } = {};

        for (const cookie of cookies) {
          if (cookie) {
            newCookies[cookie.parsedCookie.name] = cookie;
          }
        }

        await chrome.storage.local.set({
          [tabId.toString()]: {
            ...previousVal[tabId.toString()],
            url: tab.url,
            cookies: {
              ...previousVal[tabId.toString()].cookies,
              ...newCookies,
            },
          },
        });
      }
    } catch (error) {
      // Most probably request to add cookies after a tab is closed.
    }
  },
};

export type ICookieStore = typeof CookieStore;

export default CookieStore;
