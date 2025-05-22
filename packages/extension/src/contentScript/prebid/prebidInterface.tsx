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
import { noop, type AdsAndBiddersType } from '@google-psat/common';
/**
 * Internal dependencies.
 */
import {
  CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA,
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
} from '../../constants';
import { decycle } from '../utils';
import mergeUnique2DArrays from '../utils/mergeUnique2DArrays';
import type { PrebidEvents } from '../../store';

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
  prebidInterface: typeof window.pbjs | null = null;

  /**
   * Prebid Data.
   */
  prebidData: PrebidEvents = {
    adUnits: {},
    noBids: {},
    versionInfo: '',
    installedModules: [],
    config: {},
    receivedBids: [],
    errorEvents: [],
    auctionEvents: {},
    pbjsNamespace: '',
  };

  /**
   * Update counter
   */
  updateCounter = 0;

  /**
   * SetInterval value
   */
  setIntervalValue: NodeJS.Timeout | null = null;

  /**
   * Scanning status
   */
  scanningStatus: any | null = false;

  constructor() {
    this.listenToConnection();
  }

  /**
   * Checks if the Prebid.js library exists on the current webpage and initializes
   * the provided Prebid interface class accordingly. The function continuously scans
   * for the presence of Prebid.js until it is found or a timeout occurs.
   * The function performs the following steps:
   * 1. Instantiates the provided class and starts scanning for the Prebid.js library.
   * 2. If the Prebid.js library is detected, it initializes the `prebidInterface` property
   *    of the instantiated class with the global Prebid.js object.
   * 3. Sets the `prebidExists` and `scanningStatus` properties of the instantiated class
   *    to indicate the presence of Prebid.js and the completion of the scanning process.
   * 4. Calls the `sendInitialData` and `initPrebidListener` methods of the instantiated class
   *    to handle further interactions with Prebid.js.
   * 5. Stops scanning either when Prebid.js is found or after a timeout of 60 seconds.
   *
   * Note: The function uses a recursive `setTimeout` to periodically check for the presence
   * of Prebid.js on the page.
   */
  static doesPrebidExist() {
    let stopLoop = false;
    const pbjsClass = new this();
    /**
     * Timing is 60 seconds because the script runs at document_start where in all scripts are
     * loaded but not run. So when prebidInterface is loaded it will check for instantation of
     * prebid window global.
     * Other scripts run after this script is inserted.
     */
    const timeout = setTimeout(() => {
      stopLoop = true;
      pbjsClass.scanningStatus = true;
    }, 60000);

    const isPrebidInPage = () => {
      //@ts-ignore
      const pbjsGlobals = window._pbjsGlobals ?? [];
      if (pbjsGlobals?.length > 0) {
        pbjsClass.prebidInterface = window[
          pbjsGlobals[0]
        ] as unknown as typeof window.pbjs;

        pbjsClass.prebidExists = true;
        pbjsClass.scanningStatus = true;

        pbjsClass.sendInitialData();
        pbjsClass.initPrebidListener();

        pbjsClass.prebidData.pbjsNamespace = pbjsGlobals[0];

        pbjsClass.prebidData.versionInfo =
          pbjsClass.prebidInterface.version ?? '';

        pbjsClass.prebidData.installedModules =
          pbjsClass.prebidInterface.installedModules ?? [];

        const bidderSettings: Record<string, SingleBidderSetting> = {};

        Object.keys(pbjsClass?.prebidInterface?.bidderSettings ?? {}).forEach(
          (bidder) => {
            bidderSettings[bidder] = {};

            const {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              bidCpmAdjustment = noop,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              adserverTargeting = [],
              ...rest
            } = pbjsClass.prebidInterface?.bidderSettings[bidder] ?? {};

            bidderSettings[bidder] = {
              ...rest,
            };
          }
        );

        pbjsClass.prebidData.config = {
          ...(pbjsClass.prebidInterface?.getConfig() ?? {}),
          bidderSettings,
          eids: pbjsClass.prebidInterface.getUserIdsAsEids() ?? [],
        };

        stopLoop = true;
        clearTimeout(timeout);
      }

      if (!stopLoop) {
        setTimeout(() => isPrebidInPage(), 1000);
      }
    };

    isPrebidInPage();
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
        this.tabId = event.data.tabId;
        this.sendInitialData();
      }

      if (event.data?.type === CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA) {
        this.tabId = event.data.tabId;
      }
    };

    this.setIntervalValue = setInterval(() => {
      if (this.updateCounter > 0) {
        this.sendInitialData();
        this.updateCounter = 0;
      }
    }, 1200);

    document.addEventListener('unload', () => {
      this.prebidExists = false;
      this.scanningStatus = false;
      this.prebidInterface = null;
      this.prebidData = {
        adUnits: {},
        pbjsNamespace: '',
        noBids: {},
        receivedBids: [],
        errorEvents: [],
        versionInfo: '',
        config: {},
        auctionEvents: {},
        installedModules: [],
      };

      if (this.setIntervalValue) {
        clearInterval(this.setIntervalValue);
      }

      this.updateCounter = 0;
      this.setIntervalValue = null;
    });
  }

  sendInitialData() {
    window.top?.postMessage({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: this.tabId,
      prebidData: JSON.parse(decycle(this.prebidData)),
    });
  }

  async getAndProcessPrebidData(propertyName: string) {
    //@ts-ignore
    if (
      this.prebidExists &&
      !Object.keys(this.prebidInterface ?? {}).includes(propertyName)
    ) {
      return;
    }

    //@ts-ignore
    const prebidCaller = this.prebidInterface?.[propertyName];

    const prebidData =
      typeof prebidCaller === 'function' ? await prebidCaller() : prebidCaller;

    if (prebidData) {
      // Send the prebid data to contentscript so that it can be sent to the devtools
      window.top?.postMessage({
        type: SCRIPT_GET_PREBID_DATA_RESPONSE,
        tabId: this.tabId,
        prebidData: JSON.parse(decycle(prebidData)),
      });
    }
  }

  initPrebidListener() {
    this.prebidInterface?.onEvent('addAdUnits', () => {
      this.calculateAdUnit();
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('auctionInit', (args) => {
      this.prebidData.auctionEvents = {
        ...this.prebidData.auctionEvents,
        [args.auctionId]: [args],
      };
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('auctionDebug', (args) => {
      const events = this.prebidInterface?.getEvents();
      const lastEvent = events?.[events.length - 1];

      this.prebidData.errorEvents.push({
        type: args.type,
        message: args.arguments,
        time: `${Math.round(lastEvent?.elapsedTime ?? 0)}ms`,
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('beforeRequestBids', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidRequested', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('beforeBidderHttp', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidResponse', (args) => {
      this.calculateBidResponse(args);
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidAccepted', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidRejected', (args) => {
      if (args.bid?.auctionId) {
        this.prebidData.auctionEvents[args.bid?.auctionId].push(args);
        this.updateCounter++;
      }
    });

    this.prebidInterface?.onEvent('bidTimeout', (args) => {
      args.forEach((arg) => {
        this.prebidData.auctionEvents[arg.auctionId].push(args);
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidWon', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.calculateAdUnit(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('noBid', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.calculateNoBid(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('auctionEnd', (args) => {
      this.prebidData.auctionEvents[args.auctionId].push(args);
      this.sendInitialData();
      this.updateCounter++;
    });
  }

  calculateBidResponse(bid: BidResponse) {
    const {
      auctionId,
      adUnitCode,
      responseTimestamp = Date.now(),
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

  calculateNoBid(bid: NoBid) {
    if (!this.prebidData.noBids[bid.auctionId]) {
      this.prebidData.noBids[bid.auctionId] = {
        uniqueAuctionId: bid.auctionId,
        adUnitCode: bid.adUnitCode,
        mediaContainerSize: bid.sizes,
        bidder: [bid.bidder],
      };
    } else {
      this.prebidData.noBids[bid.auctionId] = {
        adUnitCode: bid.adUnitCode,
        mediaContainerSize: [
          ...mergeUnique2DArrays(
            this.prebidData.noBids[bid.auctionId]?.mediaContainerSize ?? [],
            bid?.sizes ?? []
          ),
        ],
        bidder: Array.from(
          new Set<string>([
            ...this.prebidData.noBids[bid.auctionId].bidder,
            bid.bidder,
          ])
        ),
        uniqueAuctionId: bid.auctionId,
      };
    }
  }

  calculateAdUnit(bid?: BidWonEvent) {
    if (bid) {
      this.prebidData.adUnits[bid.adUnitCode] = {
        ...this.prebidData.adUnits[bid.adUnitCode],
        winningBid: bid?.cpm,
        bidCurrency: bid.currency,
        winningBidder: bid.bidder,
      };
      return;
    }

    this.prebidData.adUnits =
      this.prebidInterface?.adUnits?.reduce(
        (acc: AdsAndBiddersType, adUnit: AdUnit) => {
          if (!adUnit.code) {
            return acc;
          }

          acc[adUnit.code] = {
            mediaContainerSize:
              adUnit?.sizes ??
              (adUnit.mediaTypes?.banner?.sizes ?? []).map((config) => {
                return config;
              }),
            adUnitCode: adUnit.code,
            bidders: Array.from(
              new Set<string>(adUnit.bids.map((_bid) => _bid.bidder ?? ''))
            ),
            winningBid: 0,
            bidCurrency: '',
            winningBidder: '',
          };

          return acc;
        },
        {}
      ) ?? {};
  }
}

PrebidInterface.doesPrebidExist();

export default PrebidInterface;
