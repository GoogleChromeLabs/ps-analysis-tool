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
import type { auctionData, singleAuctionEvent } from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import networkTime from './utils/networkTime';
import formatTime from './utils/formatTime';
import { DataStore } from './dataStore';

class PAStore extends DataStore {
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

  constructor() {
    super();
  }

  deinitialiseVariablesForTab(tabId: string): void {
    super.deinitialiseVariablesForTab(tabId);
    delete this.unParsedRequestHeadersForPA[tabId];
    Object.keys(this.auctionEvents[tabId] ?? {}).forEach((uniqueAuctionId) => {
      if (uniqueAuctionId === 'globalEvents') {
        return;
      }
      delete this.auctionEvents[tabId][uniqueAuctionId];
    });
    delete this.auctionDataForTabId[tabId];
  }

  initialiseVariablesForNewTab(tabId: string): void {
    super.initialiseVariablesForNewTab(tabId);
    this.unParsedRequestHeadersForPA[tabId] = {};
    const { globalEvents } = structuredClone(this.auctionEvents[tabId] ?? []);
    this.auctionEvents[tabId] = {
      globalEvents,
    };
    this.auctionDataForTabId[tabId] = {};
    //@ts-ignore
    globalThis.PSAT = {
      //@ts-ignore
      ...globalThis.PSAT,
      unParsedRequestHeadersForPA: this.unParsedRequestHeadersForPA,
      auctionEvents: this.auctionEvents[tabId],
      auctionDataForTabId: this.auctionDataForTabId[tabId],
    };
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: string) {
    delete this.unParsedRequestHeadersForPA[tabId.toString()];
    delete this.auctionDataForTabId[tabId.toString()];
    delete this.auctionEvents[tabId.toString()];
  }

  /**
   * Remove the window's all tabs data from the store.
   * @param {number} windowId The window id.
   */
  removeWindowData(windowId: number) {
    chrome.tabs.query({ windowId }, (tabs) => {
      tabs.map((tab) => {
        if (tab.id) {
          this.removeTabData(tab.id.toString());
        }
        return tab;
      });
    });
  }

  /**
   * Processes and sends auction message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendAuctionData(
    tabId: string,
    overrideForInitialSync: boolean
  ) {
    try {
      if (DataStore.tabs[tabId].newUpdatesPA <= 0 && !overrideForInitialSync) {
        return;
      }

      const { globalEvents, ...rest } = this.auctionEvents[tabId];

      const isMultiSellerAuction = this.isMultiSellerAuction(rest);
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
      DataStore.tabs[tabId].newUpdatesPA = 0;
    } catch (error) {
      // Fail silently
    }
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
        await this.processAndSendAuctionData(tabId, overrideForInitialSync);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
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
      if (!this.auctionDataForTabId[tabId][uniqueAuctionId]) {
        return;
      }
      const { auctionConfig = {} } =
        this.auctionDataForTabId[tabId][uniqueAuctionId];

      this.getAuctionEventsArray(tabId, uniqueAuctionId).push({
        uniqueAuctionId,
        index: this.getAuctionEventsArray(tabId, uniqueAuctionId).length,
        bidCurrency: auctionConfig?.bidCurrency ?? '',
        bid: auctionConfig?.bid ?? null,
        name: auctionConfig?.name ?? '',
        ownerOrigin: auctionConfig?.ownerOrigin ?? '',
        type: method + type,
        formattedTime:
          this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
            ? '0 ms'
            : formatTime(
                this.auctionEvents[tabId][uniqueAuctionId][0].time,
                networkTime(requestId, timestamp, tabId)
              ),
        time: calculatedNetworkTime,
        auctionConfig,
        parentAuctionId: uniqueAuctionId
          ? this.auctionDataForTabId[tabId]?.[uniqueAuctionId]?.parentAuctionId
          : undefined,
        eventType: 'interestGroupAuctionNetworkRequestCompleted',
      });
      DataStore.tabs[tabId].newUpdatesPA++;
    });
  }

  /**
   * Decides if auction is multiSeller or singleSeller
   * @param {singleAuctionEvent[]} auctionEvents This is used to get the related data for parsing the request.
   * @returns { boolean } True for multiSeller False for singleSeller
   */
  isMultiSellerAuction(auctionEvents: {
    [uniqueAuctionId: string]: singleAuctionEvent[];
  }): boolean {
    const uniqueSellers = new Set<string>();

    Object.keys(auctionEvents).forEach((key) => {
      const configResolvedEvent = auctionEvents[key].filter(
        (event) => event.type === 'configResolved'
      )?.[0];

      if (configResolvedEvent) {
        //@ts-ignore -- Ignoring this for now since we dont have any type of auctionConfig
        uniqueSellers.add(configResolvedEvent.auctionConfig.seller);
      }
    });

    return uniqueSellers.size > 1;
  }

  /**
   * Processes interest group acccess event.
   * @param {Protocol.Storage.InterestGroupAccessedEvent} interestGroupAccessedParams The params that were passed when interestGroupAccessed Event was fired
   * @param {string} tabId The tabId for which the event has to be added.
   */
  processInterestGroupEvent(
    interestGroupAccessedParams: Protocol.Storage.InterestGroupAccessedEvent,
    tabId: string
  ) {
    const { uniqueAuctionId, accessTime, ownerOrigin, name, type } =
      interestGroupAccessedParams;

    let eventData: singleAuctionEvent = {
      uniqueAuctionId,
      name,
      ownerOrigin,
      formattedTime: new Date(accessTime * 1000),
      type,
      time: accessTime,
      index: this.getAuctionEventsArray(tabId, 'globalEvents').length,
      eventType: 'interestGroupAccessed' as singleAuctionEvent['eventType'],
    };

    this.getAuctionEventsArray(tabId, 'globalEvents').push(eventData);

    DataStore.tabs[tabId].newUpdatesPA++;

    if (!uniqueAuctionId) {
      return;
    }

    const isAuctionIDAvailable = this.doesAuctionExistInTab(
      tabId,
      uniqueAuctionId,
      'interestGroupAccessed'
    );

    if (!isAuctionIDAvailable) {
      return;
    }

    const {
      bid: initialBidValue,
      componentSellerOrigin,
      bidCurrency: initialBidCurrencyValue,
    } = interestGroupAccessedParams;

    let bid;

    if (initialBidValue) {
      bid = initialBidValue;
    }

    if (uniqueAuctionId && !initialBidValue && type === 'win') {
      bid = this.getAuctionEventsArray(tabId, uniqueAuctionId).filter(
        ({
          type: storedType,
          eventType,
          interestGroupConfig: { uniqueAuctionId: eventAuctionId } = {},
        }) =>
          storedType === 'bid' &&
          eventType === 'interestGroupAccessed' &&
          eventAuctionId &&
          uniqueAuctionId &&
          eventAuctionId === interestGroupAccessedParams.uniqueAuctionId
      )?.[0]?.bid;
    }

    eventData = {
      uniqueAuctionId,
      name,
      index: this.getAuctionEventsArray(tabId, uniqueAuctionId).length,
      ownerOrigin,
      formattedTime:
        uniqueAuctionId &&
        this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
          ? '0 ms'
          : formatTime(
              this.auctionEvents[tabId][uniqueAuctionId]?.[0].time,
              accessTime
            ),
      type,
      time: accessTime,
      parentAuctionId:
        this.auctionDataForTabId[tabId]?.[uniqueAuctionId]?.parentAuctionId ??
        undefined,
      eventType: 'interestGroupAccessed' as singleAuctionEvent['eventType'],
    };

    if (componentSellerOrigin) {
      eventData.componentSellerOrigin = componentSellerOrigin;
    }

    if (bid) {
      eventData.bid = bid;
    }

    if (initialBidCurrencyValue) {
      eventData.bidCurrency = initialBidCurrencyValue;
    }

    this.getAuctionEventsArray(tabId, uniqueAuctionId).push(eventData);

    DataStore.tabs[tabId].newUpdatesPA++;
  }

  /**
   * Process StartFetchEvents
   * @param {Protocol.Storage.InterestGroupAuctionId[]} auctions Unique auction id's which need to be added to the event data store.
   * @param {string} tabId The tabId for which the event has to be added.
   * @param {string} requestId The requestId associated with the event.
   * @param {string} type The type of JS which was fetched.
   */
  processStartFetchEvents(
    auctions: Protocol.Storage.InterestGroupAuctionId[],
    tabId: string,
    requestId: string,
    type: string
  ) {
    const time: number =
      networkTime(
        requestId,
        DataStore.requestIdToCDPURLMapping[tabId][requestId].timeStamp,
        tabId
      ) ?? new Date().getTime();

    auctions.forEach((uniqueAuctionId) => {
      this.getAuctionEventsArray(tabId, uniqueAuctionId).push({
        uniqueAuctionId,
        index: this.getAuctionEventsArray(tabId, uniqueAuctionId).length,
        formattedTime:
          this.auctionEvents[tabId][uniqueAuctionId].length === 0
            ? '0 ms'
            : formatTime(
                this.auctionEvents[tabId][uniqueAuctionId][0].time,
                time
              ),
        type: 'Start Fetching ' + type,
        time,
        parentAuctionId:
          this.auctionDataForTabId[tabId]?.[uniqueAuctionId]?.parentAuctionId,
        eventType: 'interestGroupAuctionNetworkRequestCreated',
      });

      DataStore.tabs[tabId].newUpdatesPA++;
    });
  }

  /**
   * Process InterestGroupAuctionEventOccurred
   * @param {Protocol.Storage.InterestGroupAuctionEventOccurredEvent} interestGroupAuctionEventOccured Event data passed to the InterestGroupAuctionEventOccurred
   * @param {string} tabId The tabId for which the event has to be added.
   */
  processInterestGroupAuctionEventOccurred(
    interestGroupAuctionEventOccured: Protocol.Storage.InterestGroupAuctionEventOccurredEvent,
    tabId: string
  ) {
    const { uniqueAuctionId, eventTime, type, auctionConfig, parentAuctionId } =
      interestGroupAuctionEventOccured;

    const eventData = {
      uniqueAuctionId,
      index: this.getAuctionEventsArray(tabId, uniqueAuctionId).length,
      type,
      formattedTime:
        this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
          ? '0 ms'
          : formatTime(
              this.auctionEvents[tabId][uniqueAuctionId][0].time,
              eventTime
            ),
      time: eventTime,
      auctionConfig,
      parentAuctionId,
      eventType:
        'interestGroupAuctionEventOccurred' as singleAuctionEvent['eventType'],
    };

    this.getAuctionEventsArray(tabId, uniqueAuctionId).push(eventData);

    DataStore.tabs[tabId].newUpdatesPA++;
  }

  /**
   * Push into auction events
   * @param {string} tabId The ID of the tab auction event is associated with.
   * @param {string} uniqueAuctionId The ID of the auction event whose array is to be fetched.
   * @returns {object} An object holder reporesenting the event data.
   */
  getAuctionEventsArray(tabId: string, uniqueAuctionId: string) {
    if (!this.auctionEvents[tabId][uniqueAuctionId]) {
      this.auctionEvents[tabId][uniqueAuctionId] = [];
    }
    return this.auctionEvents[tabId][uniqueAuctionId];
  }

  /**
   * Push into auction events
   * @param {string} tabId The ID of the tab auction event is associated with.
   * @param {string} uniqueAuctionId The ID of the auction event whose array is to be fetched.
   * @param {string} eventType The type of event that called this.
   * @returns {object | null} An object holder reporesenting the event data.
   */
  doesAuctionExistInTab(
    tabId: string,
    uniqueAuctionId: string,
    eventType = 'interestGroupAuctionEventOccurred'
  ) {
    if (uniqueAuctionId === 'globalEvents') {
      return true;
    }

    if (!this.auctionEvents[tabId][uniqueAuctionId]) {
      if (eventType !== 'interestGroupAccessed') {
        return true;
      } else {
        return false;
      }
    }
    if (
      this.auctionEvents[tabId][uniqueAuctionId].filter(
        (event) => event.type === 'started'
      ).length > 0
    ) {
      return true;
    }
    return false;
  }

  /**
   * Fetch parent auction id for a tab
   * @param {string} tabId The ID of the tab for which auction data needs to be fetched.
   * @returns {Set} An object containing auction data.
   */
  getParentAuctionId(tabId: string) {
    const parentAuctionIds = new Set<string>();
    Object.keys(this.auctionEvents[tabId]).forEach((uniqueAuctionId) => {
      const parentAuctionId = this.auctionEvents[tabId][uniqueAuctionId].filter(
        (event) => event.type === 'started'
      )?.[0].parentAuctionId;

      if (parentAuctionId) {
        parentAuctionIds.add(parentAuctionId);
      }
    });

    return parentAuctionIds;
  }

  getTabsData(
    tabId = ''
  ):
    | { [uniqueAuctionId: string]: singleAuctionEvent[] }
    | typeof this.auctionEvents {
    if (tabId) {
      return this.auctionEvents[tabId];
    }
    return this.auctionEvents;
  }
}

export default new PAStore();
