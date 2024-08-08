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
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import networkTime from './utils/networkTime';
import formatTime from './utils/formatTime';
import dataStore from './dataStore';

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
      if (!dataStore.auctionDataForTabId[parseInt(tabId)][uniqueAuctionId]) {
        return;
      }
      const { auctionConfig = {} } =
        dataStore.auctionDataForTabId[parseInt(tabId)][uniqueAuctionId];

      dataStore.auctionEvents[parseInt(tabId)].push({
        bidCurrency: auctionConfig?.bidCurrency ?? '',
        bid: auctionConfig?.bid ?? null,
        name: auctionConfig?.name ?? '',
        ownerOrigin: auctionConfig?.ownerOrigin ?? '',
        type: method + type,
        formattedTime:
          dataStore.auctionEvents[parseInt(tabId)].length === 0
            ? '0 ms'
            : formatTime(
                dataStore.auctionEvents[parseInt(tabId)][0].time,
                networkTime(requestId, timestamp, tabId)
              ),
        time: calculatedNetworkTime,
        auctionConfig,
        eventType: 'interestGroupAuctionNetworkRequestCompleted',
      });
    });
  }
}

export default new PAStore();
