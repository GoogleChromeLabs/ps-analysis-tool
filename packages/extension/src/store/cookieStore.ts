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
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
  deriveBlockingStatus,
  type CookieDatabase,
} from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import updateCookieBadgeText from './utils/updateCookieBadgeText';
import { DataStore } from './dataStore';
import shouldUpdateCounter from '../utils/shouldUpdateCounter';
import { NEW_COOKIE_DATA } from '../constants';
import { fetchDictionary } from '../utils/fetchCookieDictionary';

class CookieStore extends DataStore {
  /**
   * CookieDatabase to run analytics match on.
   */
  protected cookieDB: CookieDatabase | null = null;

  /**
   * This variable stores the unParsedRequest headers received from Network.requestWillBeSentExtraInfo.
   * These are the requests whose Network.requestWillBeSent counter part havent yet been fired.
   */
  protected unParsedRequestHeadersForCA: {
    [tabId: string]: {
      [requestId: string]: Protocol.Network.RequestWillBeSentExtraInfoEvent;
    };
  } = {};

  /**
   * This variable stores the unParsedResonse headers received from Network.responseReceivedExtraInfo.
   * These are the responses whose Network.responseReceived counter part havent yet been fired.
   */
  protected unParsedResponseHeadersForCA: {
    [tabId: string]: {
      [requestId: string]: Protocol.Network.ResponseReceivedExtraInfoEvent;
    };
  } = {};

  /**
   * The cookie data of the tabs.
   */
  protected tabsData: {
    [tabId: string]: {
      [cookieKey: string]: CookieData;
    };
  } = {};

  constructor() {
    super();
    (async () => {
      if (!this.cookieDB) {
        this.cookieDB = await fetchDictionary();
      }
    })();
  }

  /**
   * Adds exclusion and warning reasons for a given cookie.
   * @param {string} cookieName Name of the cookie.
   * @param {string[]} exclusionReasons reasons to be added to the blocked reason array.
   * @param {string[]} warningReasons warning reasons to be added to the warning reason array.
   * @param {number} tabId tabId where change has to be made.
   */
  addCookieExclusionWarningReason(
    cookieName: string,
    exclusionReasons: BlockedReason[],
    warningReasons: Protocol.Audits.CookieWarningReason[],
    tabId: string
  ) {
    if (!this.tabsData[tabId]) {
      return;
    }
    if (this.tabsData[tabId] && this.tabsData[tabId][cookieName]) {
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
      DataStore.tabs[tabId].newUpdatesCA++;
    } else {
      DataStore.tabs[tabId].newUpdatesCA++;
      // If none of them exists. This case is possible when the cookies hasnt processed and we already have an issue.
      this.tabsData[tabId] = {
        ...this.tabsData[tabId],
        [cookieName]: {
          ...(this.tabsData[tabId][cookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
      };
    }
  }

  clear(): void {
    super.clear();
    Object.keys(this.tabsData).forEach((key) => {
      delete this.tabsData[Number(key)];
    });
  }

  getTabsData(
    tabId = ''
  ): { [cookieKey: string]: CookieData } | typeof this.tabsData {
    if (tabId) {
      return this.tabsData[tabId];
    }
    return this.tabsData;
  }

  getUnParsedRequestHeadersForCA(tabId = ''): {
    [requestId: string]: Protocol.Network.RequestWillBeSentExtraInfoEvent;
  } | null {
    if (tabId && this.unParsedRequestHeadersForCA[tabId]) {
      return this.unParsedRequestHeadersForCA[tabId];
    }
    return null;
  }

  getUnParsedResponseHeadersForCA(tabId: string): {
    [requestId: string]: Protocol.Network.ResponseReceivedExtraInfoEvent;
  } | null {
    if (tabId && this.unParsedResponseHeadersForCA[tabId]) {
      return this.unParsedResponseHeadersForCA[tabId];
    }
    return null;
  }

  deinitialiseVariablesForTab(tabId: string): void {
    super.deinitialiseVariablesForTab(tabId);
    delete this.tabsData[tabId];
    delete this.unParsedRequestHeadersForCA[tabId];
    delete this.unParsedResponseHeadersForCA[tabId];
  }

  initialiseVariablesForNewTab(tabId: string): void {
    super.initialiseVariablesForNewTab(tabId);
    this.tabsData[tabId] = {};
    this.unParsedRequestHeadersForCA[tabId] = {};
    this.unParsedResponseHeadersForCA[tabId] = {};
    //@ts-ignore
    globalThis.PSAT = {
      //@ts-ignore
      ...globalThis.PSAT,
      tabsData: this.tabsData,
      unParsedRequestHeadersForCA: this.unParsedRequestHeadersForCA,
      unParsedResponseHeadersForCA: this.unParsedResponseHeadersForCA,
    };
  }

  /**
   * This function parses response headers for Cookie Analysis.
   * @param {Protocol.Network.ResponseReceivedExtraInfoEvent} response The response to be parsed.
   * @param {string} requestId This is used to get the related data for parsing the response.
   * @param {string} tabId The tabId this request is associated to.
   * @param {string[]} frameIds This is used to associate the cookies from request to set of frameIds.
   */
  parseResponseHeadersForCA(
    response?: Protocol.Network.ResponseReceivedExtraInfoEvent,
    requestId?: string,
    tabId?: string,
    frameIds?: string[]
  ) {
    if (!response || !requestId || !tabId || !frameIds) {
      return;
    }

    const { headers, blockedCookies, cookiePartitionKey, exemptedCookies } =
      response;

    const cookies: CookieData[] = parseResponseReceivedExtraInfo(
      headers,
      blockedCookies,
      exemptedCookies,
      cookiePartitionKey,
      DataStore.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      DataStore.tabs[tabId].url ?? '',
      this.cookieDB ?? {},
      frameIds,
      requestId
    );
    this.update(tabId, cookies);

    delete this.unParsedResponseHeadersForCA[tabId][requestId];
  }

  /**
   * This function parses request headers for Cookie Analysis.
   * @param {Protocol.Network.RequestWillBeSentExtraInfoEvent} request The response to be parsed.
   * @param {string} requestId This is used to get the related data for parsing the response.
   * @param {string} tabId The tabId this request is associated to.
   * @param {string[]} frameIds This is used to associate the cookies from request to set of frameIds.
   */
  parseRequestHeadersForCA(
    request?: Protocol.Network.RequestWillBeSentExtraInfoEvent,
    requestId?: string,
    tabId?: string,
    frameIds?: string[]
  ) {
    if (!request || !requestId || !tabId || !frameIds) {
      return;
    }
    const { associatedCookies } = request;

    const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
      associatedCookies,
      this.cookieDB ?? {},
      DataStore.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      DataStore.tabs[tabId].url ?? '',
      frameIds,
      requestId
    );

    delete this.unParsedRequestHeadersForCA[tabId][requestId];
    if (cookies.length === 0) {
      return;
    }

    this.update(tabId, cookies);
    delete this.unParsedRequestHeadersForCA[tabId][requestId];
  }

  /**
   * Processes and sends cookie message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendCookieData(
    tabId: string,
    overrideForInitialSync: boolean
  ) {
    try {
      if (DataStore.tabs[tabId].newUpdatesCA <= 0 && !overrideForInitialSync) {
        return;
      }

      const newCookieData: {
        [cookieKey: string]: CookieData;
      } = {};

      Object.keys(this.tabsData[tabId]).forEach((key) => {
        newCookieData[key] = {
          ...this.tabsData[tabId][key],
          networkEvents: {
            requestEvents: [],
            responseEvents: [],
          },
          url: '',
          headerType: ['request', 'response'].includes(
            this.tabsData[tabId][key]?.headerType ?? ''
          )
            ? 'http'
            : 'javascript',
        };
      });

      await chrome.runtime.sendMessage({
        type: NEW_COOKIE_DATA,
        payload: {
          tabId,
          cookieData: newCookieData,
          extraData: {
            extraFrameData: DataStore.tabs[tabId].frameIDURLSet,
          },
        },
      });

      DataStore.tabs[tabId].newUpdatesCA = 0;
    } catch (error) {
      // Fail silently
    }
  }

  /**
   * Clear cookie data from cached cookie data for the given tabId
   * @param {number} tabId The active tab id.
   */
  removeCookieData(tabId: string) {
    if (!DataStore.tabs[tabId] || !this.tabsData[tabId]) {
      return;
    }

    delete this.tabsData[tabId];
    this.tabsData[tabId] = {};
    DataStore.tabs[tabId].newUpdatesCA = 0;
    DataStore.tabs[tabId].frameIDURLSet = {};
    DataStore.tabs[tabId].parentChildFrameAssociation = {};
    this.sendUpdatedDataToPopupAndDevTools(tabId, true);
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: string) {
    delete this.tabsData[tabId];
    delete this.unParsedRequestHeadersForCA[tabId];
    delete this.unParsedResponseHeadersForCA[tabId];
  }

  /**
   * Sends updated data to the popup and devtools
   * @param {number} tabId The window id.
   * @param {boolean} overrideForInitialSync Optional is only passed when we want to override the newUpdate condition for initial sync.
   */
  async sendUpdatedDataToPopupAndDevTools(
    tabId: string,
    overrideForInitialSync = false
  ) {
    if (!DataStore.tabs[tabId]) {
      return;
    }

    try {
      if (
        DataStore.tabs[tabId].devToolsOpenState ||
        DataStore.tabs[tabId].popupOpenState
      ) {
        await this.processAndSendCookieData(tabId, overrideForInitialSync);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
    }
  }

  setUnParsedRequestHeadersForCA(
    tabId: string,
    requestId: string,
    request: Protocol.Network.RequestWillBeSentExtraInfoEvent
  ): void {
    if (!tabId || !requestId || !request) {
      return;
    }
    this.unParsedRequestHeadersForCA[tabId][requestId] = request;
  }

  setUnParsedResponseHeadersForCA(
    tabId: string,
    requestId: string,
    response: Protocol.Network.ResponseReceivedExtraInfoEvent
  ): void {
    if (!tabId || !requestId || !response) {
      return;
    }
    this.unParsedResponseHeadersForCA[tabId][requestId] = response;
  }

  /**
   * Update cookie store.
   * @param {number} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  // eslint-disable-next-line complexity
  update(tabId: string, cookies: CookieData[]) {
    try {
      if (!this.tabsData[tabId]) {
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
        ).map((frameId) => frameId.toString());

        const updateCounterBoolean = shouldUpdateCounter(
          this.tabsData[tabId][cookieKey],
          cookie
        );

        if (updateCounterBoolean) {
          DataStore.tabs[tabId].newUpdatesCA++;
        }

        if (this.tabsData[tabId]?.[cookieKey]) {
          // Merge in previous warning reasons.
          const parsedCookie = {
            ...this.tabsData[tabId][cookieKey].parsedCookie,
            ...cookie.parsedCookie,
            samesite: (
              cookie.parsedCookie.samesite ??
              this.tabsData[tabId][cookieKey].parsedCookie.samesite ??
              'lax'
            ).toLowerCase(),
            httponly:
              cookie.parsedCookie.httponly ??
              this.tabsData[tabId][cookieKey].parsedCookie.httponly,
            priority:
              cookie.parsedCookie?.priority ??
              this.tabsData[tabId][cookieKey].parsedCookie?.priority ??
              'Medium',
            partitionKey: '',
          };
          if (
            cookie.parsedCookie?.partitionKey ||
            this.tabsData[tabId][cookieKey].parsedCookie?.partitionKey
          ) {
            parsedCookie.partitionKey =
              cookie.parsedCookie?.partitionKey ||
              this.tabsData[tabId][cookieKey].parsedCookie?.partitionKey;
          }

          const networkEvents: CookieData['networkEvents'] = {
            requestEvents: [
              ...(this.tabsData[tabId][cookieKey]?.networkEvents
                ?.requestEvents || []),
              ...(cookie.networkEvents?.requestEvents || []),
            ],
            responseEvents: [
              ...(this.tabsData[tabId][cookieKey]?.networkEvents
                ?.responseEvents || []),
              ...(cookie.networkEvents?.responseEvents || []),
            ],
          };

          this.tabsData[tabId][cookieKey] = {
            ...this.tabsData[tabId][cookieKey],
            ...cookie,
            parsedCookie,
            isBlocked: blockedReasons.length > 0,
            blockedReasons,
            networkEvents,
            blockingStatus: deriveBlockingStatus(networkEvents),
            warningReasons,
            url: this.tabsData[tabId][cookieKey].url ?? cookie.url,
            headerType:
              this.tabsData[tabId][cookieKey].headerType === 'javascript'
                ? this.tabsData[tabId][cookieKey].headerType
                : cookie.headerType,
            frameIdList,
            exemptionReason:
              cookie?.exemptionReason ||
              this.tabsData[tabId][cookieKey]?.exemptionReason,
          };
        } else {
          this.tabsData[tabId][cookieKey] = {
            ...cookie,
            blockingStatus: deriveBlockingStatus(cookie.networkEvents),
          };
        }
      }

      updateCookieBadgeText(this.tabsData[tabId], tabId);
    } catch (error) {
      //Fail silently
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }
}

export default new CookieStore();
