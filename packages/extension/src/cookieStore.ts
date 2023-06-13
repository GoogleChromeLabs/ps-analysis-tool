/**
 * External dependencies.
 */
import cookie, { Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import { fetchDictionary, jsonToCookieAnalytics } from './utils';
import { CookieAnalytics, CookieDatabase } from './types';

export type CookieData = {
  parsedData: ParsedCookie;
  analytics: CookieAnalytics | undefined;
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
  headers: chrome.webRequest.HttpHeader[];
  initiator: string | null;
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

let cookieInfoHashMap: CookieDatabase = {};

const mkHeaderToCookie =
  (url: string, top: string | undefined) =>
  (header: Header): CookieData | undefined => {
    if (!header.value || header.name.toLowerCase() !== 'set-cookie') {
      return;
    }
    const c = cookie.parse(header.value);

    let analytics: CookieAnalytics | undefined;

    if (cookieInfoHashMap && Object.keys(cookieInfoHashMap).includes(c.name)) {
      const analyticsFromCsvJSON = cookieInfoHashMap[c.name][0];
      analytics = jsonToCookieAnalytics(analyticsFromCsvJSON);
    }

    const origin = url ? new URL(url).origin : '';
    const toplevel = new URL(top).origin;
    return { parsedData: c, analytics, origin, toplevel };
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
      const [key, value] = lruStorage.pop();
      storage[key] = empty;
      await chrome.action.setBadgeText({ tabId: +key, text: '' });
      potentialBytesInUse -= new TextEncoder().encode(value).length;
    }
  }

  await chrome.storage.local.set(storage);
};

export const CookieStore = {
  async addFromRequest(tabId: number, { headers, url }: Request) {
    let tab = null;

    if (!tabId || Number(tabId) < 0) {
      return;
    }

    try {
      tab = await chrome.tabs.get(tabId);
    } catch (error) {
      console.log(error);
    }

    if (chrome.runtime.lastError || !tab) {
      return;
    }

    fetchDictionary().then((data) => (cookieInfoHashMap = data));

    const newCookies = headers
      .map(mkHeaderToCookie(url, tab.url))
      .filter((x: CookieData | undefined) => Boolean(x));

    const newCookiesObj: { [key: string]: CookieData } = {};

    for (const cookie of newCookies) {
      newCookiesObj[cookie.parsedData.name + cookie.parsedData.domain] = cookie;
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
      await CookieStore.removeTabData(tab.id);
    });
  },
  getSyncStore: (tabId: number) => ({
    subscribe(listener: () => void) {
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
          listeners[tabId].listener = undefined;
        }
      };
    },
    getSnapshot() {
      // IMPORTANT: identity must change iff value has changed
      return store[tabId] || empty;
    },
  }),
};
