/*
 * Copyright 2024 Google LLC
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
import type {
  CookieData,
  CookieDatabase,
  singleAuctionEvent,
  auctionData,
  SourcesRegistration,
  TriggerRegistration,
} from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import { NEW_COOKIE_DATA } from '../constants';
import isValidURL from '../utils/isValidURL';
import { doesFrameExist } from '../utils/doesFrameExist';
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import PAStore from './PAStore';
import { isEqual } from 'lodash-es';

class DataStore {
  /**
   * The cookie data of the tabs.
   */
  tabsData: {
    [tabId: number]: {
      [cookieKey: string]: CookieData;
    };
  } = {};

  /**
   * The Attribution Reporting sources for the tab.
   */
  sources: {
    sourceRegistration: SourcesRegistration[];
    triggerRegistration: TriggerRegistration[];
  } = {
    sourceRegistration: [],
    triggerRegistration: [],
  };

  /**
   * The Attribution Reporting sources for the tab.
   */
  oldSources: {
    sourceRegistration: SourcesRegistration[];
    triggerRegistration: TriggerRegistration[];
  } = {
    sourceRegistration: [],
    triggerRegistration: [],
  };

  /**
   * The Attribution Reporting headers for the tab.
   */
  headersForARA: {
    [tabId: string]: {
      [requestId: string]: {
        url: string;
        headers: Protocol.Network.Headers;
      };
    };
  } = {};

  /**
   * The auction event of the tabs (Interest group access as well as interest group auction events).
   */
  auctionEvents: {
    [tabId: string]: {
      [uniqueAuctionId: string]: singleAuctionEvent[];
    };
  } = {};
  /**
   * For tab 123456 auction events will have interestGroup accessed events as well as the interestGroupAuctionEvents.
   * There can be 2 types of interestGroupAccessed events:
   * 1) Join and Leave eventsare global and are fired on all the tabs.
   * 2) Bid Win topLevelBid are fired where bidding is happening.
   *
   * To accomodate these 2 events we have 2 different keys in the auctionEvent for each tab:
   * 1) The uniqueParentAuctionId,
   *     a) if its a multi-seller auction then it will have:
   *         i) a uniqueParentAuctionId where component auction Events are added.
   *        ii) top level auction in an id whose key is '0',
   *     b) if its a single sale then it will have a key with uniqueAuctionId where all the auctionEvents are added.
   * 2) a 'globalEvents' key where all the global events are added like join leave etc.
   *
   * Structure may look like this:
   * auctionEvents: {
   *     123456: {
   *          'globalEvents': [],
   *          '12413hsad23e1nsd': {}
   *     }
   * };
   */

  /**
   * The auction data of the tabs which is added when interestGroupAuctionEvent occurs.
   */
  auctionDataForTabId: {
    [tabId: string]: auctionData;
  } = {};

  /**
   * CookieDatabase to run analytics match on.
   */
  cookieDB: CookieDatabase | null = null;

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
      newUpdatesCA: number;
      newUpdatesPA: number;
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
      sources: this.sources,
      headersForARA: this.headersForARA,
    };

    this.tabsData[tabId] = {};
    this.auctionEvents[tabId.toString()] = {};
    this.headersForARA[tabId.toString()] = {};
    this.tabs[tabId] = {
      url: '',
      devToolsOpenState: false,
      popupOpenState: false,
      newUpdatesCA: 0,
      newUpdatesPA: 0,
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
    delete this.headersForARA[tabId];
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
    this.tabs[tabId].newUpdatesCA = 0;
    this.tabs[tabId].newUpdatesPA = 0;
    this.tabs[tabId].frameIDURLSet = {};
    this.tabs[tabId].parentChildFrameAssociation = {};
    Object.keys(this.auctionEvents[tabId.toString()]).forEach((key) => {
      if (key === 'globalEvents') {
        return;
      }
      delete this.auctionEvents[tabId.toString()][key];
    });
    this.auctionDataForTabId[tabId] = {};
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
    delete this.headersForARA[tabId.toString()];
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

    try {
      if (
        this.tabs[tabId].devToolsOpenState ||
        this.tabs[tabId].popupOpenState
      ) {
        await this.processAndSendCookieData(tabId, overrideForInitialSync);
        await this.processAndSendAuctionData(tabId, overrideForInitialSync);
        await this.processAndSendARAData(tabId, overrideForInitialSync);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
    }
  }

  /**
   * Processes and sends cookie message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendCookieData(
    tabId: number,
    overrideForInitialSync: boolean
  ) {
    try {
      if (this.tabs[tabId].newUpdatesCA <= 0 && !overrideForInitialSync) {
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
            extraFrameData: this.tabs[tabId].frameIDURLSet,
          },
        },
      });

      this.tabs[tabId].newUpdatesCA = 0;
    } catch (error) {
      // Fail silently
    }
  }

  /**
   * Processes and sends auction message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendAuctionData(
    tabId: number,
    overrideForInitialSync: boolean
  ) {
    try {
      if (this.tabs[tabId].newUpdatesPA <= 0 && !overrideForInitialSync) {
        return;
      }

      const { globalEvents, ...rest } = this.auctionEvents[tabId];

      const isMultiSellerAuction = PAStore.isMUltiSellerAuction(
        Object.values(rest).flat()
      );
      const groupedAuctionBids: {
        [parentAuctionId: string]: {
          0: singleAuctionEvent[];
          [uniqueAuctionId: string]: singleAuctionEvent[];
        };
      } = {};

      const auctionEventsToBeProcessed = Object.values(rest).flat();

      if (isMultiSellerAuction) {
        auctionEventsToBeProcessed.forEach((event) => {
          const { parentAuctionId = null, uniqueAuctionId = null } = event;

          if (!parentAuctionId) {
            if (uniqueAuctionId) {
              if (!groupedAuctionBids[uniqueAuctionId]) {
                groupedAuctionBids[uniqueAuctionId] = {
                  0: [],
                };
              }
              groupedAuctionBids[uniqueAuctionId]['0'].push(event);
            }
            return;
          }

          if (!groupedAuctionBids[parentAuctionId]) {
            groupedAuctionBids[parentAuctionId] = {
              0: [],
            };
          }

          if (!uniqueAuctionId) {
            return;
          }

          if (!groupedAuctionBids[parentAuctionId][uniqueAuctionId]) {
            groupedAuctionBids[parentAuctionId][uniqueAuctionId] = [];
          }

          groupedAuctionBids[parentAuctionId][uniqueAuctionId].push(event);
        });
      }

      await chrome.runtime.sendMessage({
        type: 'AUCTION_EVENTS',
        payload: {
          refreshTabData: overrideForInitialSync,
          tabId,
          auctionEvents: isMultiSellerAuction ? groupedAuctionBids : rest,
          multiSellerAuction: isMultiSellerAuction,
          globalEvents: globalEvents ?? [],
        },
      });
      this.tabs[tabId].newUpdatesPA = 0;
    } catch (error) {
      // Fail silently
    }
  }

  /**
   * Processes and sends auction message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendARAData(tabId: number, overrideForInitialSync: boolean) {
    try {
      if (isEqual(this.oldSources, this.sources) && !overrideForInitialSync) {
        return;
      }

      await chrome.runtime.sendMessage({
        type: 'ARA_EVENTS',
        payload: {
          sourcesRegistration: this.sources.sourceRegistration,
          triggerRegistration: this.sources.triggerRegistration,
          tabId: Number(tabId),
        },
      });

      this.oldSources = structuredClone(this.sources);
    } catch (error) {
      // Fail silently
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

export default new DataStore();
