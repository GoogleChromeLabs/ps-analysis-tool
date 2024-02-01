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
  tabsData: {
    [tabId: number]: {
      [cookieKey: string]: CookieData;
    };
  } = {};

  /**
   * Required data of the tabs and PSAT panel of the tab.
   */
  tabs: {
    [tabId: number]: {
      url: string;
      devToolsOpenState: boolean;
      popupOpenState: boolean;
    };
  } = {};

  /**
   * Update cookie store.
   * @param {number} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  update(tabId: number, cookies: CookieData[]) {
    try {
      if (!this.tabsData[tabId] || !this.tabs[tabId]) {
        return;
      }

      for (const cookie of cookies) {
        const cookieKey = getCookieKey(cookie.parsedCookie);

        if (!cookieKey) {
          continue;
        }

        // Merge in previous blocked reasons.
        const blockedReasons: BlockedReason[] = [
          ...new Set<BlockedReason>([
            ...(cookie?.blockedReasons ?? []),
            ...(this.tabsData[tabId]?.[cookieKey]?.blockedReasons ?? []),
          ]),
        ];

        const warningReasons = Array.from(
          new Set<Protocol.Audits.CookieWarningReason>([
            ...(cookie?.warningReasons ?? []),
            ...(this.tabsData[tabId]?.[cookieKey]?.warningReasons ?? []),
          ])
        );

        const frameIdList = Array.from(
          new Set<number>([
            ...((cookie?.frameIdList ?? []) as number[]),
            ...((this.tabsData[tabId]?.[cookieKey]?.frameIdList ??
              []) as number[]),
          ])
        );

        if (this.tabsData[tabId]?.[cookieKey]) {
          // Merge in previous warning reasons.
          const parsedCookie = {
            ...this.tabsData[tabId][cookieKey].parsedCookie,
            ...cookie.parsedCookie,
            priority:
              cookie.parsedCookie?.priority ??
              this.tabsData[tabId][cookieKey].parsedCookie?.priority ??
              'Medium',
            partitionKey:
              cookie.parsedCookie?.partitionKey ??
              this.tabsData[tabId][cookieKey].parsedCookie?.partitionKey,
          };

          this.tabsData[tabId][cookieKey] = {
            ...this.tabsData[tabId][cookieKey],
            ...cookie,
            // Insert data receieved from CDP or new data recieved through webRequest API.
            parsedCookie,
            isBlocked: blockedReasons.length > 0,
            blockedReasons,
            warningReasons,
            url: this.tabsData[tabId][cookieKey].url ?? cookie.url,
            headerType:
              this.tabsData[tabId][cookieKey].headerType === 'javascript'
                ? this.tabsData[tabId][cookieKey].headerType
                : cookie.headerType,
            frameIdList,
          };
        } else {
          this.tabsData[tabId][cookieKey] = cookie;
        }
      }
      //@ts-ignore Since this is for debugging the data to check the data being collected by the storage.
      globalThis.PSAT = {
        tabsData: this.tabsData,
        tabs: this.tabs,
      };
      updateCookieBadgeText(this.tabsData[tabId], tabId);
    } catch (error) {
      //Fail silently
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }

  /**
   * Clears the whole storage.
   */
  clear() {
    Object.keys(this.tabsData).forEach((key) => {
      delete this.tabsData[Number(key)];
    });
    Object.keys(this.tabs).forEach((key) => {
      delete this.tabs[Number(key)];
    });
    this.tabsData = {};
    this.tabs = {};
  }

  /**
   * Gets the tabUrl for the given tab id if tab exists.
   * @param {number} tabId Tab id.
   * @returns {string | null} The url of the tab if exists else null.
   */
  getTabUrl(tabId: number): string | null {
    if (!this.tabs[tabId]) {
      return null;
    }

    return this.tabs[tabId].url;
  }

  /**
   * Update tab url for given tab
   * @param {number} tabId The url whose url needs to be update.
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
   * @param {number} tabId The tabId whose popup state needs to be update.
   * @param {boolean} state The updated popup state.
   */
  updatePopUpState(tabId: number, state: boolean) {
    if (!this.tabs[tabId]) {
      return;
    }
    this.tabs[tabId].popupOpenState = state;
  }

  /**
   * Update Devtools State for given tab
   * @param {number} tabId The tabId whose devtools state needs to be update.
   * @param {boolean} state The updated devtools state.
   */
  updateDevToolsState(tabId: number, state: boolean) {
    if (!this.tabs[tabId]) {
      return;
    }
    this.tabs[tabId].devToolsOpenState = state;
  }

  /**
   * Adds exclusion and warning reasons for a given cookie.
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
    if (!this.tabsData[tabId]) {
      return;
    }

    // Check if primaryDomain cookie exists
    if (
      this.tabsData[tabId] &&
      this.tabsData[tabId][cookieName] &&
      !this.tabsData[tabId][alternateCookieName]
    ) {
      this.tabsData[tabId][cookieName].blockedReasons = [
        ...new Set([
          ...(this.tabsData[tabId][cookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];

      this.tabsData[tabId][cookieName].warningReasons = [
        ...new Set([
          ...(this.tabsData[tabId][cookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];

      this.tabsData[tabId][cookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
      // Check if secondaryDomain cookie exists
    } else if (
      this.tabsData[tabId] &&
      !this.tabsData[tabId][cookieName] &&
      this.tabsData[tabId][alternateCookieName]
    ) {
      this.tabsData[tabId][alternateCookieName].blockedReasons = [
        ...new Set([
          ...(this.tabsData[tabId][alternateCookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];

      this.tabsData[tabId][alternateCookieName].warningReasons = [
        ...new Set([
          ...(this.tabsData[tabId][alternateCookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];

      this.tabsData[tabId][alternateCookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
    } else {
      // If none of them exists. This case is possible when the PROMISE_QUEUE hasnt processed our current promise, and we already have an issue.
      this.tabsData[tabId] = {
        ...this.tabsData[tabId],
        [alternateCookieName]: {
          ...(this.tabsData[tabId][alternateCookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
        [cookieName]: {
          ...(this.tabsData[tabId][cookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
      };
    }
  }

  /**
   * Clear cookie data from cached cookie data for the given tabId
   * @param {number} tabId The active tab id.
   */
  removeCookieData(tabId: number) {
    delete this.tabsData[tabId];
    this.tabsData[tabId] = {};
    this.sendUpdatedDataToPopupAndDevTools(tabId);
  }

  /**
   * Creates an entry for a tab
   * @param {number} tabId The tab id.
   */
  addTabData(tabId: number) {
    if (this.tabsData[tabId] && this.tabs[tabId]) {
      return;
    }

    this.tabsData[tabId] = {};
    this.tabs[tabId] = {
      url: '',
      devToolsOpenState: false,
      popupOpenState: false,
    };
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: number) {
    delete this.tabsData[tabId];
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

  /**
   * Sends updated data to the popup and devtools
   * @param {number} tabId The window id.
   */
  async sendUpdatedDataToPopupAndDevTools(tabId: number) {
    try {
      if (this.tabs[tabId].devToolsOpenState) {
        await chrome.runtime.sendMessage({
          type: 'ServiceWorker::DevTools::NEW_COOKIE_DATA',
          payload: {
            tabId,
            cookieData: this.tabsData[tabId],
          },
        });
      }

      if (this.tabs[tabId].popupOpenState) {
        await chrome.runtime.sendMessage({
          type: 'ServiceWorker::Popup::NEW_COOKIE_DATA',
          payload: {
            tabId,
            cookieData: this.tabsData[tabId],
          },
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }
}

export default SynchnorousCookieStore;
