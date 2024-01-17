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
import updateCookieBadgeText from './utils/updateCookieBadgeText';

class SynchnorousCookieStore {
  /**
   * The cookie data of the tabs.
   */
  cachedTabsData: {
    [key: number]: {
      [Key: string]: CookieData;
    };
  } = {};

  /**
   * Required data of the tabs.
   */
  tabs: {
    [key: number]: {
      url: string;
      devToolsOpenState: boolean;
      popupOpenState: boolean;
    };
  } = {};

  /**
   * Update cookie store.
   * @param {number} tabId Tab id.
   * @param {Array} cookies Cookies data.
   * @param {string }operation Only passed if cookie data needs to be cleared.
   */
  // eslint-disable-next-line complexity
  update(tabId: number, cookies: CookieData[], operation?: string) {
    if (!this.cachedTabsData[tabId]) {
      return;
    }

    if (operation === 'clear') {
      this.cachedTabsData[tabId] = {};
    }

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
          ...(this.cachedTabsData[tabId][cookieKey]?.blockedReasons ?? []),
        ]),
      ];
      cookieKey = cookieKey?.trim();
      if (this.cachedTabsData[tabId]?.[cookieKey]) {
        this.cachedTabsData[tabId][cookieKey] = {
          ...this.cachedTabsData[tabId][cookieKey],
          ...cookie,
          parsedCookie: {
            ...this.cachedTabsData[tabId][cookieKey].parsedCookie,
            ...cookie.parsedCookie,
            priority:
              cookie.parsedCookie?.priority ??
              this.cachedTabsData[tabId][cookieKey].parsedCookie?.priority ??
              'Medium',
            partitionKey:
              cookie.parsedCookie?.partitionKey ??
              this.cachedTabsData[tabId][cookieKey].parsedCookie?.partitionKey,
          },
          isBlocked: blockedReasons.length > 0,
          blockedReasons,
          warningReasons: Array.from(
            new Set<Protocol.Audits.CookieWarningReason>([
              ...(cookie.warningReasons ?? []),
              ...(this.cachedTabsData[tabId][cookieKey].warningReasons ?? []),
            ])
          ),
          url: this.cachedTabsData[tabId][cookieKey].url ?? cookie.url,
          headerType:
            this.cachedTabsData[tabId][cookieKey].headerType === 'javascript'
              ? this.cachedTabsData[tabId][cookieKey].headerType
              : cookie.headerType,
          frameIdList: Array.from(
            new Set<number>([
              ...((cookie.frameIdList ?? []) as number[]),
              ...((this.cachedTabsData[tabId][cookieKey].frameIdList ??
                []) as number[]),
            ])
          ),
        };
      } else {
        this.cachedTabsData[tabId][cookieKey] = cookie;
      }
    }
    globalThis.CDPData = this.cachedTabsData;
    updateCookieBadgeText(this.cachedTabsData[tabId], tabId);
    if (this.tabs[tabId].devToolsOpenState) {
      chrome.runtime.sendMessage({
        type: 'NEW_COOKIE_DATA',
        payload: {
          tabId: tabId,
          cookieData: JSON.stringify(this.cachedTabsData[tabId]),
        },
      });
    }
    if (this.tabs[tabId].popupOpenState) {
      chrome.runtime.sendMessage({
        type: 'popup:NEW_COOKIE_DATA',
        payload: {
          tabId: tabId,
          cookieData: JSON.stringify(this.cachedTabsData[tabId]),
        },
      });
    }
  }

  /**
   * Gets the tabUrl for the given tab id.
   * @param {number} tabId Tab id.
   * @returns the url of the tab
   */
  getTabUrl(tabId: number): string | null {
    if (!this.tabs[tabId]) {
      return null;
    }

    return this.tabs[tabId].url;
  }
  /**
   * Update tab url for given tab
   * @param {number} tabId The url whose tabId needs to be update.
   * @param {string} url The updated URL.
   */
  updateUrl(tabId: number, url: string) {
    if (!this.tabs[tabId]) {
      this.tabs[tabId] = {
        url,
        devToolsOpenState: false,
        popupOpenState: false,
      };
    } else {
      this.tabs[tabId].url = url;
    }
  }
  /**
   * Update Popup State for given tab
   * @param {number} tabId The url whose tabId needs to be update.
   * @param {boolean} state The updated devtools state.
   */
  updatePopUpState(tabId: number, state: boolean) {
    if (!this.tabs[tabId]) {
      return;
    }
    this.tabs[tabId].popupOpenState = state;
  }

  /**
   * Update Devtools State for given tab
   * @param {number} tabId The url whose tabId needs to be update.
   * @param {boolean} state The updated devtools state.
   */
  updateDevToolsState(tabId: number, state: boolean) {
    if (!this.tabs[tabId]) {
      return;
    }
    this.tabs[tabId].devToolsOpenState = state;
  }
  /**
   * Deletes a cookie
   * @param {string} cookieName Name of the cookie.
   * @param {string} alternateCookieName Alternate name of the cookie.
   * @param {string[]} exclusionReasons reasons to be added to the blocked reason array.
   * @param {string[]} warningReasons warning reasons to be added to the warning reason array.
   * @param {number} tabId tabId where change has to be made.
   */
  addCookieExclusionWarningReason(
    cookieName: string,
    alternateCookieName: string,
    exclusionReasons: BlockedReason[],
    warningReasons: Protocol.Audits.CookieWarningReason[],
    tabId: number
  ) {
    if (!this.cachedTabsData[tabId]) {
      return;
    }
    // Check if primaryDomain cookie exists
    if (
      this.cachedTabsData[tabId] &&
      this.cachedTabsData[tabId][cookieName] &&
      !this.cachedTabsData[tabId][alternateCookieName]
    ) {
      this.cachedTabsData[tabId][cookieName].blockedReasons = [
        ...new Set([
          ...(this.cachedTabsData[tabId][cookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];
      this.cachedTabsData[tabId][cookieName].warningReasons = [
        ...new Set([
          ...(this.cachedTabsData[tabId][cookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];
      this.cachedTabsData[tabId][cookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
      // Check if secondaryDomain cookie exists
    } else if (
      this.cachedTabsData[tabId] &&
      !this.cachedTabsData[tabId][cookieName] &&
      this.cachedTabsData[tabId][alternateCookieName]
    ) {
      this.cachedTabsData[tabId][alternateCookieName].blockedReasons = [
        ...new Set([
          ...(this.cachedTabsData[tabId][alternateCookieName].blockedReasons ??
            []),
          ...exclusionReasons,
        ]),
      ];
      this.cachedTabsData[tabId][alternateCookieName].warningReasons = [
        ...new Set([
          ...(this.cachedTabsData[tabId][alternateCookieName].warningReasons ??
            []),
          ...warningReasons,
        ]),
      ];
      this.cachedTabsData[tabId][alternateCookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
    } else {
      // If none of them exists. This case is possible when the PROMISE_QUEUE hasnt processed our current promise, and we already have an issue.
      this.cachedTabsData[tabId] = {
        ...this.cachedTabsData[tabId],
        [alternateCookieName]: {
          ...(this.cachedTabsData[tabId][alternateCookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
        [cookieName]: {
          ...(this.cachedTabsData[tabId][cookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
      };
    }
  }

  /**
   * Clear cookie data
   * @param {number} tabId The active tab id.
   */
  removeCookieData(tabId: number) {
    this.cachedTabsData[tabId] = {};
  }

  /**
   * Creates an entry for a tab
   * @param {number} tabId The tab id.
   * @param {string} tabProessingMode Passed to determine the tab processing mode.
   */
  addTabData(tabId: number, tabProessingMode: string) {
    if (tabProessingMode && tabProessingMode !== 'unlimited') {
      this.cachedTabsData[tabId] = {};
      this.tabs[tabId] = {
        url: '',
        devToolsOpenState: false,
        popupOpenState: false,
      };
    } else {
      this.cachedTabsData[tabId] = {};
      this.tabs[tabId] = {
        url: '',
        devToolsOpenState: false,
        popupOpenState: false,
      };
    }
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: number) {
    delete this.cachedTabsData[tabId];
    delete this.tabs[tabId];
  }

  /**
   * Remove the window's all tabs data from the store.
   * @param {number} windowId The window id.
   */
  removeWindowData(windowId: number) {
    chrome.tabs.query({ windowId }, (tabs) => {
      tabs.map((tab) => {
        if (tab.id) {
          this.removeTabData(tab.id);
        }
        return tab;
      });
    });
  }
}

export default SynchnorousCookieStore;
