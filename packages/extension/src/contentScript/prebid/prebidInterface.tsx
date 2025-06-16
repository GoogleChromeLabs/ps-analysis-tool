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
import merge from 'lodash/merge';
/**
 * Internal dependencies.
 */
import {
  PREBID_SCANNING_STATUS,
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
    prebidExists: null,
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
      window.top?.postMessage({
        type: PREBID_SCANNING_STATUS,
        prebidExists: pbjsClass.prebidData.prebidExists,
      });
    }, 60000);

    const isPrebidInPage = () => {
      //@ts-ignore
      const pbjsGlobals = window._pbjsGlobals ?? [];
      if (pbjsGlobals?.length > 0) {
        pbjsClass.prebidInterface = window[
          pbjsGlobals[0]
        ] as unknown as typeof window.pbjs;

        pbjsClass.prebidData.prebidExists = true;
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Since we only want to use rest and not the other values
              bidCpmAdjustment = noop,
              // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Since we only want to use rest and not the other values
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
          eids: pbjsClass.prebidInterface?.getUserIdsAsEids?.() ?? [],
        };

        window.top?.postMessage({
          type: PREBID_SCANNING_STATUS,
          prebidExists: pbjsClass.prebidData.prebidExists,
        });
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
        this.sendInitialData();
      }
    };

    this.setIntervalValue = setInterval(() => {
      if (this.updateCounter > 0) {
        this.sendInitialData();
        this.updateCounter = 0;
      }
    }, 1200);
  }

  sendInitialData() {
    window.top?.postMessage({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      prebidData: this.prebidData.prebidExists
        ? JSON.parse(decycle(this.prebidData))
        : null,
    });
  }

  initPrebidListener() {
    this.prebidInterface?.onEvent('auctionInit', (args) => {
      this.prebidData.auctionEvents = {
        ...this.prebidData.auctionEvents,
        [args.auctionId]: [],
      };
      this.addEvent(args.auctionId, { ...args, eventType: 'auctionInit' });
      this.calculateAdUnit();
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
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'beforeRequestBids',
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidRequested', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'bidRequested',
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('beforeBidderHttp', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'beforeBidderHttp',
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidResponse', (args) => {
      this.calculateBidResponse(args);
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'BidResponse',
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidAccepted', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'bidAccepted',
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidRejected', (args) => {
      if (args.bid?.auctionId) {
        this.addEvent(args.bid.auctionId, {
          ...args,
          eventType: 'bidRejected',
        });
        this.updateCounter++;
      }
    });

    this.prebidInterface?.onEvent('bidTimeout', (args) => {
      args.forEach((arg) => {
        this.addEvent(arg.auctionId, {
          ...args,
          eventType: 'bidTimeout',
        });
      });
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('bidWon', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'bidWon',
      });
      this.calculateAdUnit(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('noBid', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'noBid',
      });
      this.calculateNoBid(args);
      this.updateCounter++;
    });

    this.prebidInterface?.onEvent('auctionEnd', (args) => {
      this.addEvent(args.auctionId, {
        ...args,
        eventType: 'auctionEnd',
      });
      this.sendInitialData();
      this.updateCounter++;
    });
  }

  addEvent(key: string, args: any) {
    const event = this.prebidInterface?.getEvents().pop();

    if (!event) {
      return;
    }

    this.prebidData.auctionEvents[key].push({
      ...args,
      elapsedTime: event.elapsedTime,
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
        winningMediaContainerSize: [[bid.width, bid.height]],
      };
      return;
    }

    const auctionInitEvents: AuctionEndEvent[] = [];
    Object.values(this.prebidData.auctionEvents).forEach((events) => {
      const auctionInitEvent = events.find(
        (event) => event.eventType === 'auctionInit'
      );

      if (auctionInitEvent) {
        auctionInitEvents.push(auctionInitEvent);
      }
    });

    const adUnitArray = auctionInitEvents
      ?.reduce((previousValue, currentValue) => {
        return [...previousValue, ...currentValue.adUnits];
      }, [] as AdUnit[])
      ?.reduce((acc, value) => {
        let toUpdate = acc.find((adUnit) => {
          const adUnitBids =
            adUnit.bids.map(({ bidder, params }: any) => ({
              bidder,
              params,
            })) || [];
          const currentValueBids =
            value.bids.map(({ bidder, params }: any) => ({
              bidder,
              params,
            })) || [];
          return (
            adUnit.code === value.code &&
            JSON.stringify(adUnit.mediaTypes) ===
              JSON.stringify(value.mediaTypes) &&
            JSON.stringify(adUnit.sizes) === JSON.stringify(value.sizes) &&
            JSON.stringify(adUnitBids) === JSON.stringify(currentValueBids)
          );
        });

        if (toUpdate) {
          toUpdate = merge(toUpdate, value);
          return acc;
        } else {
          return [...acc, value];
        }
      }, [] as AdUnit[]);

    this.prebidData.adUnits =
      adUnitArray?.reduce((acc, adUnit) => {
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
      }, {} as AdsAndBiddersType) ?? {};
  }
}

PrebidInterface.doesPrebidExist();

export default PrebidInterface;
