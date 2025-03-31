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
import type { singleAuctionEvent } from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import networkTime from './utils/networkTime';
import formatTime from './utils/formatTime';
import dataStore, { DataStore } from './dataStore';

class PAStore {
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
    if (!dataStore.unParsedRequestHeadersForPA[tabId][requestId]?.auctions) {
      return;
    }
    const { auctions, type } =
      dataStore.unParsedRequestHeadersForPA[tabId][requestId];

    const calculatedNetworkTime = networkTime(requestId, timestamp, tabId);

    auctions.forEach((uniqueAuctionId) => {
      if (!dataStore.auctionDataForTabId[tabId][uniqueAuctionId]) {
        return;
      }
      const { auctionConfig = {} } =
        dataStore.auctionDataForTabId[tabId][uniqueAuctionId];

      this.getAuctionEventsArray(tabId, uniqueAuctionId).push({
        uniqueAuctionId,
        bidCurrency: auctionConfig?.bidCurrency ?? '',
        bid: auctionConfig?.bid ?? null,
        name: auctionConfig?.name ?? '',
        ownerOrigin: auctionConfig?.ownerOrigin ?? '',
        type: method + type,
        formattedTime:
          this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
            ? '0 ms'
            : formatTime(
                dataStore.auctionEvents[tabId][uniqueAuctionId][0].time,
                networkTime(requestId, timestamp, tabId)
              ),
        time: calculatedNetworkTime,
        auctionConfig,
        parentAuctionId: uniqueAuctionId
          ? dataStore.auctionDataForTabId[tabId]?.[uniqueAuctionId]
              ?.parentAuctionId
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
  isMUltiSellerAuction(auctionEvents: singleAuctionEvent[]): boolean {
    const uniqueSellers = new Set<string>();

    auctionEvents
      //@ts-ignore -- Ignoring this for now since we dont have any type of auctionConfig
      .filter((event) => Boolean(event.auctionConfig?.seller))
      //@ts-ignore -- Ignoring this for now since we dont have any type of auctionConfig
      .forEach(({ auctionConfig }) => uniqueSellers.add(auctionConfig?.seller));

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
      ownerOrigin,
      formattedTime:
        uniqueAuctionId &&
        this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
          ? '0 ms'
          : formatTime(
              dataStore.auctionEvents[tabId][uniqueAuctionId]?.[0].time,
              accessTime
            ),
      type,
      time: accessTime,
      parentAuctionId:
        dataStore.auctionDataForTabId[tabId]?.[uniqueAuctionId]
          ?.parentAuctionId ?? undefined,
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
        formattedTime:
          dataStore.auctionEvents[tabId][uniqueAuctionId].length === 0
            ? '0 ms'
            : formatTime(
                dataStore.auctionEvents[tabId][uniqueAuctionId][0].time,
                time
              ),
        type: 'Start fetch ' + type,
        time,
        parentAuctionId:
          dataStore.auctionDataForTabId[tabId]?.[uniqueAuctionId]
            ?.parentAuctionId,
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
      type,
      formattedTime:
        this.getAuctionEventsArray(tabId, uniqueAuctionId).length === 0
          ? '0 ms'
          : formatTime(
              dataStore.auctionEvents[tabId][uniqueAuctionId][0].time,
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
    if (!dataStore.auctionEvents[tabId][uniqueAuctionId]) {
      dataStore.auctionEvents[tabId][uniqueAuctionId] = [];
    }
    return dataStore.auctionEvents[tabId][uniqueAuctionId];
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

    if (!dataStore.auctionEvents[tabId][uniqueAuctionId]) {
      if (eventType !== 'interestGroupAccessed') {
        return true;
      } else {
        return false;
      }
    }
    if (
      dataStore.auctionEvents[tabId][uniqueAuctionId].filter(
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
    Object.keys(dataStore.auctionEvents[tabId]).forEach((uniqueAuctionId) => {
      const parentAuctionId = dataStore.auctionEvents[tabId][
        uniqueAuctionId
      ].filter((event) => event.type === 'started')?.[0].parentAuctionId;

      if (parentAuctionId) {
        parentAuctionIds.add(parentAuctionId);
      }
    });

    return parentAuctionIds;
  }
}

export default new PAStore();
