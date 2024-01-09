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
import {
  getCookieKey,
  type CookieData,
  type BlockedReason,
} from '@ps-analysis-tool/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import updateStorage from './utils/updateStorage';
import type { TabData } from './types';
import fetchTopicsTaxonomy from '../utils/fetchTopicsTaxonomy';
import updateCookieBadgeText from './utils/updateCookieBadgeText';

const CookieStore = {
  /**
   * Update cookie store.
   * @param {string} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  async update(tabId: string, cookies: CookieData[]) {
    const currentStorageSnapshot = await chrome.storage.local.get();
    if (
      currentStorageSnapshot[tabId] &&
      Object.keys(currentStorageSnapshot[tabId]).length === 0
    ) {
      return;
    }
    // eslint-disable-next-line complexity
    await updateStorage(tabId, (prevState: TabData) => {
      const _prevCookies = prevState?.cookies || {};
      const _updatedCookies = _prevCookies;

      for (const cookie of cookies) {
        const { name, domain, path } = cookie.parsedCookie;
        if (!name || !domain || !path) {
          continue;
        }
        let cookieKey = getCookieKey(cookie.parsedCookie);
        if (!cookieKey) {
          continue;
        }
        const blockedReasons: BlockedReason[] = [
          ...new Set<BlockedReason>([
            ...(cookie?.blockedReasons ?? []),
            ...(_updatedCookies[cookieKey]?.blockedReasons ?? []),
          ]),
        ];
        cookieKey = cookieKey?.trim();
        if (_updatedCookies?.[cookieKey]) {
          _updatedCookies[cookieKey] = {
            ..._updatedCookies[cookieKey],
            ...cookie,
            parsedCookie: {
              ..._updatedCookies[cookieKey].parsedCookie,
              ...cookie.parsedCookie,
              priority:
                cookie.parsedCookie?.priority ??
                _updatedCookies[cookieKey].parsedCookie?.priority ??
                'Medium',
              partitionKey:
                cookie.parsedCookie?.partitionKey ??
                _updatedCookies[cookieKey].parsedCookie?.partitionKey,
            },
            isBlocked: blockedReasons.length > 0,
            blockedReasons,
            warningReasons: Array.from(
              new Set<Protocol.Audits.CookieWarningReason>([
                ...(cookie.warningReasons ?? []),
                ...(_updatedCookies[cookieKey].warningReasons ?? []),
              ])
            ),
            headerType:
              _updatedCookies[cookieKey].headerType === 'javascript'
                ? _updatedCookies[cookieKey].headerType
                : cookie.headerType,
            frameIdList: Array.from(
              new Set<number>([
                ...(cookie.frameIdList ?? []),
                ...(_updatedCookies[cookieKey].frameIdList ?? []),
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
    await updateCookieBadgeText(storage);
    await chrome.storage.local.set(storage);
  },

  /**
   * Deletes a cookie
   * @param {string} cookieNames Name of the cookie.
   */
  async deleteSetOfCookie(cookieNames: string[]) {
    const storage = await chrome.storage.local.get();
    cookieNames.forEach((cookieName) => {
      Object.values(storage).forEach((tabData) => {
        if (tabData.cookies && tabData.cookies[cookieName]) {
          delete tabData.cookies[cookieName];
        }
      });
    });
    await updateCookieBadgeText(storage);
    await chrome.storage.local.set(storage);
  },

  /**
   * Deletes a cookie
   * @param {string} cookieName Name of the cookie.
   * @param {string} alternateCookieName Alternate name of the cookie.
   * @param {string[]} exclusionReasons reasons to be added to the blocked reason array.
   * @param {string[]} warningReasons warning reasons to be added to the warning reason array.
   * @param {string} tabId tabId where change has to be made.
   */
  async addCookieExclusionWarningReason(
    cookieName: string,
    alternateCookieName: string,
    exclusionReasons: string[],
    warningReasons: string[],
    tabId: string
  ) {
    const storage = await chrome.storage.local.get();
    if (!storage[tabId]) {
      return;
    }
    // Check if primaryDomain cookie exists
    if (
      storage[tabId].cookies &&
      storage[tabId].cookies[cookieName] &&
      !storage[tabId].cookies[alternateCookieName]
    ) {
      storage[tabId].cookies[cookieName].blockedReasons = [
        ...new Set([
          ...(storage[tabId].cookies[cookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];
      storage[tabId].cookies[cookieName].warningReasons = [
        ...new Set([
          ...(storage[tabId].cookies[cookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];
      storage[tabId].cookies[cookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
      // Check if secondaryDomain cookie exists
    } else if (
      storage[tabId].cookies &&
      !storage[tabId].cookies[cookieName] &&
      storage[tabId].cookies[alternateCookieName]
    ) {
      storage[tabId].cookies[alternateCookieName].blockedReasons = [
        ...new Set([
          ...(storage[tabId].cookies[alternateCookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];
      storage[tabId].cookies[alternateCookieName].warningReasons = [
        ...new Set([
          ...(storage[tabId].cookies[alternateCookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];
      storage[tabId].cookies[alternateCookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
    } else {
      // If none of them exists. This case is possible when the PROMISE_QUEUE hasnt processed our current promise, and we already have an issue.
      storage[tabId] = {
        ...storage[tabId],
        cookies: {
          ...storage[tabId].cookies,
          [alternateCookieName]: {
            ...(storage[tabId].cookies[alternateCookieName] ?? {}),
            blockedReasons: [...exclusionReasons],
            warningReasons: [...warningReasons],
            isBlocked: exclusionReasons.length > 0 ? true : false,
          },
          [cookieName]: {
            ...(storage[tabId].cookies[cookieName] ?? {}),
            blockedReasons: [...exclusionReasons],
            warningReasons: [...warningReasons],
            isBlocked: exclusionReasons.length > 0 ? true : false,
          },
        },
      };
    }
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
   * Set topics list.
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

  /**
   * Add domain to allow-list.
   * @param {Record<string, string>} domainObject
   * The domain to be added to allow-list.
   */
  async addDomainToAllowList(domainObject: Record<string, string>) {
    const storage = await chrome.storage.session.get();

    if (!storage.allowList) {
      storage.allowList = [] as Record<string, string>[];
    }

    let isElementPresent = false;
    for (let i = 0; i < storage.allowList.length; i++) {
      if (
        storage.allowList[i].scope === domainObject.scope &&
        storage.allowList[i].primaryDomain === domainObject.primaryDomain &&
        storage.allowList[i].primaryPattern === domainObject.primaryPattern &&
        storage.allowList[i].secondaryPattern === domainObject.secondaryPattern
      ) {
        isElementPresent = true;
        break;
      }
    }

    if (!isElementPresent) {
      storage.allowList = [...storage.allowList, domainObject];
    }

    await chrome.storage.session.set(storage);
  },

  /**
   * Remove domain from allow-list.
   * @param {Record<string, string>} domainObject
   * The domain to be removed from allow-list.
   */
  async removeDomainFromAllowList(domainObject: Record<string, string>) {
    const storage = await chrome.storage.session.get();

    let indexToRemove = -1;
    for (let i = 0; i < storage.allowList.length; i++) {
      if (
        storage.allowList[i].scope === domainObject.scope &&
        storage.allowList[i].primaryDomain === domainObject.primaryDomain &&
        storage.allowList[i].primaryPattern === domainObject.primaryPattern &&
        storage.allowList[i].secondaryPattern === domainObject.secondaryPattern
      ) {
        indexToRemove = i;
        break;
      }
    }

    if (indexToRemove !== -1) {
      storage.allowList.splice(indexToRemove, 1);
    }

    await chrome.storage.session.set(storage);
  },

  /**
   * Get domains in allow-list.
   * @returns {Promise<Record<string, string>>}
   * Set of domains in allow-list.
   */
  async getDomainsInAllowList(): Promise<Record<string, string>[]> {
    const storage = await chrome.storage.session.get();

    return storage.allowList ?? [];
  },
};

export default CookieStore;
