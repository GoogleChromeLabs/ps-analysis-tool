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
import parseCookieHeader from './parseCookieHeader';
import updateStorage from './updateStorage';
import { noop } from '../utils/noop';
import type { StorageValue, CookieData, Request } from './types';
import { emptyTabData } from './consts';

const store: { [tabId: number]: StorageValue } = {};

const listeners: {
  [tabId: number]: {
    subscriber: (() => void)[];
    listener: (change: {
      [name: string]: chrome.storage.StorageChange;
    }) => void | undefined;
  };
} = {};

const CookieStore = {
  async addFromRequest(tabId: number, { headers, url }: Request) {
    let tab = null;

    if (!tabId || Number(tabId) < 0 || !headers) {
      return;
    }

    try {
      tab = await chrome.tabs.get(tabId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    if (chrome.runtime.lastError || !tab) {
      return;
    }

    const newCookies = headers
      .map(parseCookieHeader(url, tab.url))
      .filter((x: CookieData | null) => Boolean(x));

    const newCookiesObj: { [key: string]: CookieData } = {};

    for (const newCookie of newCookies) {
      if (newCookie) {
        newCookiesObj[newCookie.parsedData.name + newCookie.parsedData.domain] =
          newCookie;
      }
    }

    await updateStorage(tabId, emptyTabData, (previousState: StorageValue) => {
      const updatedCookies = {
        ...previousState.cookies,
        ...newCookiesObj,
      };

      return {
        ...previousState,
        cookies: updatedCookies,
      };
    });
  },
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
  getSyncStore: (tabId: number | null) => ({
    subscribe(listener: () => void) {
      if (!tabId) {
        return noop;
      }
      listeners[tabId] = listeners[tabId] || {
        subscriber: [],
        listener: undefined,
      };
      if (!listeners[tabId].listener && chrome.storage) {
        listeners[tabId].listener = (changes) => {
          if (Object.keys(changes).includes(tabId.toString())) {
            store[tabId] = changes[tabId].newValue;
            listeners[tabId].subscriber.forEach((l) => l());
          }
        };
        chrome.storage.onChanged.addListener(listeners[tabId].listener);
      }
      listeners[tabId].subscriber.push(listener);
      return () => {
        listeners[tabId].subscriber = listeners[tabId].subscriber.filter(
          (l) => l !== listener
        );
        if (listeners[tabId].subscriber.length === 0 && chrome.storage) {
          chrome.storage.onChanged.removeListener(listeners[tabId].listener);
          listeners[tabId].listener = () => undefined;
        }
      };
    },
    getSnapshot() {
      // IMPORTANT: identity must change iff value has changed

      return tabId ? store[tabId] || emptyTabData : emptyTabData;
    },
  }),
};

export default CookieStore;
