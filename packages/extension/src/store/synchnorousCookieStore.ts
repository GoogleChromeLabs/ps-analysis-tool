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
  type CookieDatabase,
  parseRequestWillBeSentExtraInfo,
  deriveBlockingStatus,
} from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import updateCookieBadgeText from './utils/updateCookieBadgeText';
import { NEW_COOKIE_DATA } from '../constants';
import isValidURL from '../utils/isValidURL';
import { doesFrameExist } from '../utils/doesFrameExist';
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import networkTime from './utils/networkTime';
import formatTime from './utils/formatTime';
interface singleAuctionEvent {
  bidCurrency: string;
  bid: number;
  name: string;
  ownerOrigin: string;
  type: string;
  formattedTime: string | Date;
  time: number;
  auctionConfig: object;
  interestGroupConfig?: Protocol.Storage.InterestGroupAccessedEvent;
  eventType:
    | 'interestGroupAuctionEventOccurred'
    | 'interestGroupAuctionNetworkRequestCompleted'
    | 'interestGroupAuctionNetworkRequestCreated'
    | 'interestGroupAccessed';
}
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
   * The cookie data of the tabs.
   */
  auctionEvents: {
    [tabId: number]: singleAuctionEvent[];
  } = {};

  /**
   * The auction data of the tabs.
   */
  auctionDataForTabId: {
    [tabId: number]: {
      [uniqueAuctionId: Protocol.Storage.InterestGroupAuctionId]: {
        auctionTime: Protocol.Network.TimeSinceEpoch;
        auctionConfig?: any;
      };
    };
  } = {};

  /**
   * The cookie data of the tabs.
   */
  tabMode: 'single' | 'unlimited' = 'single';

  /**
   * CookieDatabase to run analytics match on.
   */
  cookieDB: CookieDatabase | null = null;

  /**
   * The cookie data of the tabs.
   */
  tabToRead = '';

  /**
   * This variable stores the requestId and required information like frameId, URL and ancestorFrameId for a request associated to that tab.
   */
  requestIdToCDPURLMapping: {
    [tabId: string]: {
      [requestId: string]: {
        frameId: string;
        url: string;
        finalFrameId: string;
        timeStamp: Protocol.Network.MonotonicTime;
        wallTime: Protocol.Network.TimeSinceEpoch;
      };
    };
  } = {};

  /**
   * This variable stores the unParsedRequest headers received from Network.requestWillBeSentExtraInfo.
   * These are the requests whose Network.requestWillBeSent counter part havent yet been fired.
   */
  unParsedRequestHeadersForCA: {
    [tabId: string]: {
      [requestId: string]: Protocol.Network.RequestWillBeSentExtraInfoEvent;
    };
  } = {};

  /**
   * This variable stores the unParsedResonse headers received from Network.responseReceivedExtraInfo.
   * These are the responses whose Network.responseReceived counter part havent yet been fired.
   */
  unParsedRequestHeadersForPA: {
    [tabId: string]: {
      [requestId: string]: {
        auctions: Protocol.Storage.InterestGroupAuctionId[];
        type: Protocol.Storage.InterestGroupAuctionFetchType;
      };
    };
  } = {};

  /**
   * This variable stores the unParsedResonse headers received from Network.responseReceivedExtraInfo.
   * These are the responses whose Network.responseReceived counter part havent yet been fired.
   */
  unParsedResponseHeadersForCA: {
    [tabId: string]: {
      [requestId: string]: Protocol.Network.ResponseReceivedExtraInfoEvent;
    };
  } = {};

  /**
   * This variable stores requestUrl related to a particular frameId of a particular tab.
   * These urls are used as arguments to call Network.getCookies on the frameId.
   */
  frameIdToResourceMap: {
    [tabId: string]: {
      [frameId: string]: Set<string>;
    };
  } = {};

  globalIsUsingCDP = false;

  /**
   * Required data of the tabs and PSAT panel of the tab.
   */
  tabs: {
    [tabId: number]: {
      url: string;
      devToolsOpenState: boolean;
      popupOpenState: boolean;
      newUpdates: number;
      frameIDURLSet: Record<string, string[]>;
      parentChildFrameAssociation: Record<string, string>;
      isCookieAnalysisEnabled: boolean;
      isPAAnalysisEnabled: boolean;
    };
  } = {};

  constructor() {
    // Sync cookie data between popup and Devtool.
    // @todo Only send the data from the active tab and the differences.
    setInterval(() => {
      const data = this?.tabsData ?? {};

      if (Object.keys(data).length === 0) {
        return;
      }

      Object.keys(data).forEach((key) => {
        this?.sendUpdatedDataToPopupAndDevTools(Number(key));
      });
    }, 1200);
  }

  /**
   * This function adds frame to the appropriate tab.
   * @param {number} tabId The tabId of the event to which the event is pointing to.
   * @param {string} frameId The frameId of the frame to determine which the requestUrl is for.
   * @param {Set<string>} setTargets Set of targets available in the tab.
   * @param {string} requestUrl The request url to be added to the frameResouceMap.
   * @returns {string} An alternate frameId if available.
   */
  addFrameIdAndRequestUrlToResourceMap(
    tabId: string,
    frameId: string,
    setTargets: Set<string>,
    requestUrl: string
  ) {
    if (!this.frameIdToResourceMap[tabId][frameId]) {
      this.frameIdToResourceMap[tabId][frameId] = new Set();
    }
    if (setTargets.has(frameId)) {
      this.frameIdToResourceMap[tabId][frameId].add(requestUrl);
      return frameId;
    } else {
      const ancestorFrameId = this.findFirstAncestorFrameId(
        tabId,
        frameId,
        setTargets
      );

      if (ancestorFrameId) {
        this.frameIdToResourceMap[tabId][frameId].add(requestUrl);
        return ancestorFrameId;
      }
      return frameId;
    }
  }

  /**
   * This function parses response headers for Protected Analysis PA.
   * @param {string} requestId This is used to get the related data for parsing the request.
   * @param { Protocol.Network.MonotonicTime } timestamp Timestamp of the request
   * @param {string} tabId The tabId this request is associated to.
   * @param {string} method determines which event called the function.
   */
  parseRequestHeadersForPA(
    requestId: string,
    timestamp: Protocol.Network.MonotonicTime,
    tabId: string,
    method: string
  ) {
    if (!this.unParsedRequestHeadersForPA[tabId][requestId]?.auctions) {
      return;
    }
    const { auctions, type } =
      this.unParsedRequestHeadersForPA[tabId][requestId];

    const calculatedNetworkTime = networkTime(requestId, timestamp, tabId);

    auctions.forEach((uniqueAuctionId) => {
      if (!this.auctionDataForTabId[parseInt(tabId)][uniqueAuctionId]) {
        return;
      }
      const { auctionConfig = {} } =
        this.auctionDataForTabId[parseInt(tabId)][uniqueAuctionId];

      this.auctionEvents[parseInt(tabId)].push({
        bidCurrency: auctionConfig?.bidCurrency ?? '',
        bid: auctionConfig?.bid ?? '',
        name: auctionConfig?.name ?? '',
        ownerOrigin: auctionConfig?.ownerOrigin ?? '',
        type: method + type,
        formattedTime:
          this.auctionEvents[parseInt(tabId)].length === 0
            ? '0 ms'
            : formatTime(
                this.auctionEvents[parseInt(tabId)][0].time,
                networkTime(requestId, timestamp, tabId)
              ),
        time: calculatedNetworkTime,
        auctionConfig,
        eventType: 'interestGroupAuctionNetworkRequestCompleted',
      });
    });
  }

  /**
   * This function parses response headers for Cookie Analysis.
   * @param {Protocol.Network.ResponseReceivedExtraInfoEvent} response The response to be parsed.
   * @param {string} requestId This is used to get the related data for parsing the response.
   * @param {string} tabId The tabId this request is associated to.
   * @param {string[]} frameIds This is used to associate the cookies from request to set of frameIds.
   */
  parseResponseHeadersForCA(
    response: Protocol.Network.ResponseReceivedExtraInfoEvent,
    requestId: string,
    tabId: string,
    frameIds: string[]
  ) {
    const { headers, blockedCookies, cookiePartitionKey, exemptedCookies } =
      response;

    const cookies: CookieData[] = parseResponseReceivedExtraInfo(
      headers,
      blockedCookies,
      exemptedCookies,
      cookiePartitionKey,
      this.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      this.tabs[Number(tabId)].url ?? '',
      this.cookieDB ?? {},
      frameIds,
      requestId
    );
    this.update(Number(tabId), cookies);

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
    request: Protocol.Network.RequestWillBeSentExtraInfoEvent,
    requestId: string,
    tabId: string,
    frameIds: string[]
  ) {
    const { associatedCookies } = request;

    const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
      associatedCookies,
      this.cookieDB ?? {},
      this.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      this.tabs[Number(tabId)].url ?? '',
      frameIds,
      requestId
    );

    delete this.unParsedRequestHeadersForCA[tabId][requestId];
    if (cookies.length === 0) {
      return;
    }

    this.update(Number(tabId), cookies);
    delete this.unParsedRequestHeadersForCA[tabId][requestId];
  }

  /**
   * This function adds frame to the appropriate tab.
   * @param {number} tabId The tabId of the event if available.
   * @param {string} targetId The targetId for which frame has to be added.
   * @param {string} frameId The frameId of the frame that has been added.
   * @param {string} parentFrameId The parent frame id to which the frame has been added to.
   * @param {string} frameUrl This is and optional parameter that is sent to decide if we need to run the command for updating the frame url with async function.
   */
  async addFrameToTabAndUpdateMetadata(
    tabId: number | null,
    targetId: string | null,
    frameId: string,
    parentFrameId: string,
    frameUrl?: string
  ) {
    if (!tabId && !targetId) {
      return;
    }

    if (tabId) {
      this.updateParentChildFrameAssociation(tabId, frameId, parentFrameId);
      if (frameUrl) {
        this.updateFrameIdURLSet(tabId, frameId, frameUrl);
        return;
      } else {
        await this.updateFrameIdURLSet(tabId, frameId);
        return;
      }
    }

    const isFrameIdInPage = await doesFrameExist(frameId);

    await Promise.all(
      Object.keys(this?.tabs ?? {}).map(async (key) => {
        const currentTabFrameIdSet = this.getFrameIDSet(Number(key));
        if (
          targetId &&
          currentTabFrameIdSet &&
          currentTabFrameIdSet.has(targetId)
        ) {
          this.updateParentChildFrameAssociation(
            Number(key),
            frameId,
            parentFrameId
          );

          if (frameUrl) {
            this.updateFrameIdURLSet(
              Number(key),
              isFrameIdInPage ? frameId : '',
              frameUrl
            );
            return key;
          } else {
            await this.updateFrameIdURLSet(Number(key), frameId);
            return key;
          }
        }

        return key;
      })
    );
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
    tabId: number
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
      this.tabs[tabId].newUpdates++;
    } else {
      this.tabs[tabId].newUpdates++;
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

  /**
   * Creates an entry for a tab
   * @param {number} tabId The tab id.
   */
  addTabData(tabId: number) {
    if (this.tabsData[tabId] && this.tabs[tabId]) {
      return;
    }
    //@ts-ignore Since this is for debugging the data to check the data being collected by the storage.
    globalThis.PSAT = {
      tabsData: this.tabsData,
      tabs: this.tabs,
      auctionEvents: this.auctionEvents,
    };

    this.tabsData[tabId] = {};
    this.auctionEvents[tabId] = [];
    this.tabs[tabId] = {
      url: '',
      devToolsOpenState: false,
      popupOpenState: false,
      newUpdates: 0,
      frameIDURLSet: {},
      parentChildFrameAssociation: {},
      isCookieAnalysisEnabled: true,
      isPAAnalysisEnabled: true,
    };

    this.auctionDataForTabId[tabId] = {};

    (async () => {
      if (!this.cookieDB) {
        this.cookieDB = await fetchDictionary();
      }
    })();
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
   * This function will deinitialise variables for given tab.
   * @param {string} tabId The tab whose data has to be deinitialised.
   */
  deinitialiseVariablesForTab(tabId: string) {
    delete this.unParsedRequestHeadersForCA[tabId];
    delete this.unParsedResponseHeadersForCA[tabId];
    delete this.requestIdToCDPURLMapping[tabId];
    delete this.frameIdToResourceMap[tabId];
  }

  /**
   * This function will find the first ancestor frameId
   * @param {string} tabId The tab where the operation has to be performed.
   * @param {string} frameId The frameId whose ancestor has to be searched.
   * @param {Set<string>} targetSet The current set of targets.
   * @returns {string | null} The first ancestor frameId.
   */
  findFirstAncestorFrameId(
    tabId: string,
    frameId: string,
    targetSet: Set<string>
  ): string | null {
    if (targetSet.has(frameId)) {
      return frameId;
    } else {
      if (this.tabs[Number(tabId)]?.parentChildFrameAssociation[frameId]) {
        return this.findFirstAncestorFrameId(
          tabId,
          this.tabs[Number(tabId)]?.parentChildFrameAssociation[frameId],
          targetSet
        );
      }
      return null;
    }
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
   * Gets the frameIDSet for the given tab id if tab exists.
   * @param {number} tabId Tab id.
   * @returns {string | null} The url of the tab if exists else null.
   */
  getFrameIDSet(tabId: number): Set<string> | null {
    if (!this.tabs[tabId]) {
      return null;
    }

    const formedSet = new Set<string>();

    Object.keys(this.tabs[tabId].parentChildFrameAssociation).forEach((key) => {
      formedSet.add(key);
      formedSet.add(this.tabs[tabId].parentChildFrameAssociation[key]);
    });
    return formedSet;
  }

  /**
   * This function will initialise variables for given tab.
   * @param {string} tabId The tab whose data has to be initialised.
   */
  initialiseVariablesForNewTab(tabId: string) {
    this.unParsedRequestHeadersForCA[tabId] = {};
    this.unParsedResponseHeadersForCA[tabId] = {};
    this.requestIdToCDPURLMapping[tabId] = {};
    this.frameIdToResourceMap[tabId] = {};
    this.unParsedRequestHeadersForPA[tabId] = {};
    //@ts-ignore
    globalThis.PSATAdditionalData = {
      unParsedRequestHeadersForCA: this.unParsedRequestHeadersForCA,
      unParsedResponseHeadersForCA: this.unParsedResponseHeadersForCA,
      requestIdToCDPURLMapping: this.requestIdToCDPURLMapping,
      frameIdToResourceMap: this.frameIdToResourceMap,
      auctionDataForTabId: this.auctionDataForTabId,
      unParsedRequestHeadersForPA: this.unParsedRequestHeadersForPA,
    };
  }

  /**
   * Clear cookie data from cached cookie data for the given tabId
   * @param {number} tabId The active tab id.
   */
  removeCookieData(tabId: number) {
    if (!this.tabs[tabId] || !this.tabsData[tabId]) {
      return;
    }

    delete this.tabsData[tabId];
    this.tabsData[tabId] = {};
    this.tabs[tabId].newUpdates = 0;
    this.tabs[tabId].frameIDURLSet = {};
    this.tabs[tabId].parentChildFrameAssociation = {};
    this.auctionEvents[tabId] = [];
    this.sendUpdatedDataToPopupAndDevTools(tabId, true);
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: number) {
    delete this.tabsData[tabId];
    delete this.tabs[tabId];
    delete this.auctionDataForTabId[tabId];
    delete this.auctionEvents[tabId];
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
   * @param {boolean} overrideForInitialSync Optional is only passed when we want to override the newUpdate condition for initial sync.
   */
  async sendUpdatedDataToPopupAndDevTools(
    tabId: number,
    overrideForInitialSync = false
  ) {
    if (!this.tabs[tabId] || !this.tabsData[tabId]) {
      return;
    }
    let sentMessageAnyWhere = false;

    try {
      if (
        this.tabs[tabId].devToolsOpenState ||
        (this.tabs[tabId].popupOpenState &&
          (overrideForInitialSync || this.tabs[tabId].newUpdates > 0))
      ) {
        sentMessageAnyWhere = true;

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
              extraFrameData: this.tabs[tabId].frameIDURLSet,
            },
          },
        });
      }

      if (sentMessageAnyWhere) {
        this.tabs[tabId].newUpdates = 0;
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
    }
  }

  /**
   * Update cookie store.
   * @param {number} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  // eslint-disable-next-line complexity
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
        ).map((frameId) => frameId.toString());

        if (this.tabsData[tabId]?.[cookieKey]) {
          this.tabs[tabId].newUpdates++;
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
          this.tabs[tabId].newUpdates++;
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

  /**
   * Update FrameId set for a given url for a given tab.
   * @param {number} tabId The url whose url needs to be update.
   * @param {string | undefined} frameIdToAdd The new frameId to be added.
   * @param {string | undefined} parentFrameId The parent frame id the frameIdToAdd is associated to
   */
  updateParentChildFrameAssociation(
    tabId: number,
    frameIdToAdd: string | undefined,
    parentFrameId: string | undefined
  ) {
    if (!parentFrameId || !frameIdToAdd) {
      return;
    }

    if (!this.tabs[tabId]) {
      return;
    } else {
      this.tabs[tabId].parentChildFrameAssociation[frameIdToAdd] =
        parentFrameId;
    }
  }

  /**
   * Updates FrameIdURLSet set for a given url for a given tab.
   * @param {number} tabId The url whose url needs to be update.
   * @param {string} frameId The new frameId to be added.
   * @param {string} targetUrl TargetUrl to be updated in frameIdSet.
   */
  async updateFrameIdURLSet(tabId: number, frameId: string, targetUrl = '') {
    try {
      let url = isValidURL(targetUrl) ? new URL(targetUrl).origin : '';

      if (!url) {
        const info = (await chrome.debugger.sendCommand(
          { targetId: frameId },
          'Target.getTargetInfo',
          { targetId: frameId }
        )) as { [key: string]: Protocol.Target.TargetInfo };

        if (!info) {
          return;
        }

        url = isValidURL(info.targetInfo.url)
          ? new URL(info.targetInfo.url).origin
          : '';
      }

      if (!url) {
        return;
      }

      if (!this.tabs[tabId].frameIDURLSet[url]) {
        this.tabs[tabId].frameIDURLSet[url] = [];
      }

      this.tabs[tabId].frameIDURLSet[url] = [
        ...new Set([...this.tabs[tabId].frameIDURLSet[url], frameId]),
      ];
    } catch (error) {
      //Fail silently. This is done because we are going to get either 2 errors invalid url or chrome.debugger error.
    }
  }

  /**
   * Update tab url for given tab
   * @param {number} tabId The url whose url needs to be update.
   * @param {string} url The updated URL.
   */
  updateUrl(tabId: number, url: string) {
    if (!this.tabs[tabId]) {
      return;
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
}

export default new SynchnorousCookieStore();
