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
import cookie, { type Cookie as ParsedCookie } from 'simple-cookie';
import { noop } from './utils';

export type CookieData = {
  parsedData: ParsedCookie;
  origin: string;
  toplevel: string;
};

export type CurrentCookie = {
  cookieKey: string; // cookie key = name + domain
  cookie: CookieData;
};

export type StorageValue = {
  cookies: {
    [key: string]: CookieData;
  };
  url: URL | undefined;
  focusedAt: number | undefined;
};

export type Request = {
  headers: chrome.webRequest.HttpHeader[] | undefined;
  url: string;
};

const store: { [tabId: number]: StorageValue } = {};
const listeners: {
  [tabId: number]: {
    subscriber: (() => void)[];
    listener: (change: {
      [name: string]: chrome.storage.StorageChange;
    }) => void | undefined;
  };
} = {};

export const empty: StorageValue = {
  cookies: {},
  url: undefined,
  focusedAt: undefined,
};

export type Header = {
  name: string;
  value?: string;
};

const mkHeaderToCookie =
  (url: string, top: string | undefined) =>
  (header: Header): CookieData | null => {
    if (!header.value || header.name.toLowerCase() !== 'set-cookie') {
      return null;
    }
    const c = cookie.parse(header.value);

    const origin = url ? new URL(url).origin : '';
    const toplevel = top ? new URL(top).origin : '';
    return { parsedData: c, origin, toplevel };
  };

// This should be a transaction. Currently it has very likely a race condition.
const updateStorage: <A>(
  key: number,
  def: A,
  step: (val: A) => A
) => Promise<void> = async (key, def, step) => {
  // bytesInUse is an approximation of the size of the storage.
  const bytesInUse = await chrome.storage.local.getBytesInUse();

  // storage is the entire chrome.storage object.
  const storage = await chrome.storage.local.get();

  // potentialBytesInUse is an approximation of the size of the storage after the update.
  let potentialBytesInUse =
    bytesInUse - new TextEncoder().encode(storage[key]).length;

  if (!storage[key]) {
    storage[key] = def;
  }
  storage[key] = step(storage[key]);

  // We add the size of the new value to the potentialBytesInUse.
  potentialBytesInUse += new TextEncoder().encode(storage[key]).length;

  /**
   * If we are over the quota, we remove the least recently used tab.
   * LRU is defined as the tab that was focused at the longest time ago based on focusedAt timestamp.
   */
  if (potentialBytesInUse > chrome.storage.local.QUOTA_BYTES) {
    const lruStorage = Object.entries(storage).sort(([, a], [, b]) => {
      if (a.focusedAt && b.focusedAt) {
        return b.focusedAt - a.focusedAt;
      } else if (a.focusedAt) {
        return -1;
      } else if (b.focusedAt) {
        return 1;
      } else {
        return 0;
      }
    });

    // We remove the least recently used tab until we are under the quota or there are no more tabs.
    while (
      potentialBytesInUse > chrome.storage.local.QUOTA_BYTES &&
      lruStorage.length
    ) {
      const b = lruStorage.pop();
      if (b) {
        const [tabId, value] = b;
        storage[tabId] = empty;
        potentialBytesInUse -= new TextEncoder().encode(value).length;
      }
    }
  }

  await chrome.storage.local.set(storage);
};

export const CookieStore = {
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
      .map(mkHeaderToCookie(url, tab.url))
      .filter((x: CookieData | null) => Boolean(x));

    const newCookiesObj: { [key: string]: CookieData } = {};

    for (const newCookie of newCookies) {
      if (newCookie) {
        newCookiesObj[newCookie.parsedData.name + newCookie.parsedData.domain] =
          newCookie;
      }
    }

    await updateStorage(tabId, empty, (x: StorageValue) => {
      const updatedCookies = {
        ...x.cookies,
        ...newCookiesObj,
      };

      return {
        ...x,
        cookies: updatedCookies,
      };
    });
  },
  async updateTabLocation(tabId: number, url: URL, focusedAt: number) {
    await updateStorage(tabId, empty, (x: StorageValue) => ({
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

      return tabId ? store[tabId] || empty : empty;
    },
  }),
};
