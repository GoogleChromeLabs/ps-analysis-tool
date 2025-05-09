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
import type {
  AdsAndBiddersType,
  NoBidsType,
  ReceivedBids,
} from '@google-psat/common';
/**
 * Internal dependencies.
 */
import {
  CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA,
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
} from '../../constants';
import { decycle } from '../utils/decycle';
import doesPrebidExist from '../utils/doesPrebidExist';

/**
 * Represents the webpage's content script functionalities.
 */
class PrebidInterface {
  /**
   * TabId of the current Tab
   */
  tabId: number | null = null;

  /**
   * Boolean which indicates if prebid exists on the page.
   */
  prebidExists: boolean | null = null;
  /**
   * Prebid interface.
   */
  prebidInterface: any | null = null;

  /**
   * Prebid Data.
   */
  prebidData: {
    adUnits: AdsAndBiddersType;
    noBids: NoBidsType;
    receivedBids: ReceivedBids[];
  } = {
    adUnits: {},
    noBids: {},
    receivedBids: [],
  };

  /**
   * Scanning status
   */
  scanningStatus: any | null = false;

  constructor() {
    this.listenToConnection();
  }

  /**
   * Listens for connection requests from devtool.
   */
  listenToConnection() {
    window.onmessage = (event) => {
      if (
        event.data?.type === SCRIPT_PREBID_INITIAL_SYNC &&
        this.scanningStatus
      ) {
        this.sendInitialData();
      }

      if (event.data?.type === CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA) {
        this.tabId = event.data.tabId;
        this.getAndProcessPrebidData(event.data.propertyName);
      }
    };

    document.addEventListener('unload', () => {
      this.prebidExists = false;
      this.scanningStatus = false;
      this.prebidInterface = null;
    });
  }

  sendInitialData() {
    window.top?.postMessage({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: this.tabId,
      prebidData: {
        ...this.prebidData,
      },
      propertyName: 'keys',
    });
  }

  async getAndProcessPrebidData(propertyName: string) {
    //@ts-ignore
    if (
      this.prebidExists &&
      !Object.keys(window[this.prebidInterface]).includes(propertyName)
    ) {
      return;
    }

    //@ts-ignore
    const prebidCaller = window[this.prebidInterface]?.[propertyName];

    const prebidData =
      typeof prebidCaller === 'function' ? await prebidCaller() : prebidCaller;

    if (prebidData) {
      // Send the prebid data to contentscript so that it can be sent to the devtools
      window.top?.postMessage({
        type: SCRIPT_GET_PREBID_DATA_RESPONSE,
        tabId: this.tabId,
        propertyName,
        prebidData: JSON.parse(decycle(prebidData)),
      });
    }
  }

  initPrebidListener() {
    //@ts-ignore -- We dont have prebidjs types
    window[this.prebidInterface]?.onEvent('bidResponse', (args) => {
      this.calculateBidResponse(args);
    });

    //@ts-ignore -- We dont have prebidjs types
    window[this.prebidInterface]?.onEvent('addAdUnits', (args) => {
      this.calculateAdUnit(args);
    });

    //@ts-ignore -- We dont have prebidjs types
    window[this.prebidInterface]?.onEvent('bidWon', (args) => {
      this.calculateAdUnit(args);
    });

    //@ts-ignore -- We dont have prebidjs types
    window[this.prebidInterface]?.onEvent('noBid', (args) => {
      this.calculateNoBid(args);
    });

    //@ts-ignore -- We dont have prebidjs types
    window[this.prebidInterface]?.onEvent('auctionEnd', () => {
      this.sendInitialData();
    });
  }

  //@ts-ignore -- We dont have prebidjs types
  calculateBidResponse(bid) {
    const {
      auctionId,
      adUnitCode,
      responseTimestamp,
      price,
      currency,
      bidder,
    } = bid;

    this.prebidData.receivedBids.push({
      bidCurrency: currency,
      uniqueAuctionId: auctionId,
      index: this.prebidData.receivedBids.length,
      bid: price,
      ownerOrigin: bidder,
      time: responseTimestamp,
      formattedTime: new Date(responseTimestamp).toISOString(),
      adUnitCode,
      type: '',
      eventType: 'BidAvailable',
    });
  }

  //@ts-ignore -- We dont have prebidjs types
  calculateNoBid(bid) {
    if (!this.prebidData.noBids[bid.auctionId]) {
      this.prebidData.noBids[bid.auctionId] = {
        name: '',
        uniqueAuctionId: bid.auctionId,
        adUnitCode: bid.adUnitCode,
        mediaContainerSize: bid.sizes,
        ownerOrigin: bid.bidder,
      };
    } else {
      this.prebidData.noBids[bid.auctionId] = {
        adUnitCode: bid.adUnitCode,
        mediaContainerSize: [
          ...(this.prebidData.noBids[bid.auctionId]?.mediaContainerSize ?? []),
          ...bid.bidder.sizes.filter(
            (size: number[][]) =>
              this.prebidData.noBids[bid.auctionId] &&
              !(this.prebidData.noBids[bid.auctionId].mediaContainerSize ?? [])
                //@ts-ignore -- We dont have prebidjs types
                .includes(size)
          ),
        ],
        ownerOrigin: Array.from(
          new Set<string>(
            ...this.prebidData.noBids[bid.auctionId].ownerOrigin,
            bid.bidder
          )
        ).join(','),
        name: '',
        uniqueAuctionId: bid.auctionId,
      };
    }
  }

  //@ts-ignore -- We dont have prebidjs types
  calculateAdUnit(bid) {
    if (bid) {
      this.prebidData.adUnits[bid.code] = {
        ...this.prebidData.adUnits[bid.code],
        winningBid: bid.price,
        bidCurrency: bid.currency,
        winningBidder: bid.bidder,
      };
      return;
    }
    //@ts-ignore -- We dont have prebidjs types
    this.prebidData.adUnits = window[this.prebidInterface].adUnits.reduce(
      (acc: AdsAndBiddersType, adUnit: Record<string, any>) => {
        if (!adUnit.code) {
          return acc;
        }

        acc[adUnit.code] = {
          mediaContainerSize:
            adUnit?.sizes ??
            (adUnit.mediaTypes?.banner?.sizeConfig ?? [])
              //@ts-ignore -- We dont have prebidjs types
              .map((config) => {
                return config.sizes;
              })
              .flat(),
          adUnitCode: adUnit.code,
          bidders: Array.from(
            //@ts-ignore -- Prebid.js doesnt have
            new Set<string>(adUnit.bids.map((_bid) => _bid.bidder ?? ''))
          ),
          winningBid: 0,
          bidCurrency: '',
          winningBidder: '',
        };

        return acc;
      },
      {}
    );
  }
}

export type PrebidInterfaceType = typeof PrebidInterface;

doesPrebidExist(PrebidInterface);
