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
  noop,
  type AdsAndBiddersType,
  type AdUnit,
  type AuctionEndEvent,
  type BidTimeoutEvent,
  type BidWonEvent,
  type ErrorEventType,
  type PrebidAuctionEventType,
  type PrebidEvents,
  type PrebidNoBidsType,
  type ReceivedBids,
  type SingleBidderSetting,
} from '@google-psat/common';
import merge from 'lodash/merge';
import isEqual from 'lodash-es/isEqual';
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
   * Checks for the presence of Prebid.js in the page.
   * @static
   * @returns {void}
   * @description This method polls the page every second for 60 seconds to check if Prebid.js is loaded.
   * It looks for the _pbjsGlobals array in the window object, which contains namespaces of loaded Prebid instances.
   * If found, it:
   * - Creates a new PrebidInterface instance for each namespace
   * - Initializes the prebid interface with the found global instance
   * - Sets prebid existence flag to true
   * - Captures version info and installed modules
   * - Collects bidder settings configuration
   * - Posts a message with scanning status if Prebid is not found after timeout
   */
  static doesPrebidExist() {
    let stopLoop = false;
    /**
     * Timing is 60 seconds because the script runs at document_start where in all scripts are
     * loaded but not run. So when prebidInterface is loaded it will check for instantation of
     * prebid window global.
     * Other scripts run after this script is inserted.
     */
    const timeout = setTimeout(() => {
      stopLoop = true;
      window.postMessage({
        type: PREBID_SCANNING_STATUS,
        prebidExists: false,
      });
    }, 60000);

    const isPrebidInPage = () => {
      //@ts-ignore
      const pbjsGlobals: string[] = window._pbjsGlobals ?? [];
      if (pbjsGlobals?.length > 0) {
        pbjsGlobals.forEach((pbjsGlobal: string) => {
          //@ts-ignore
          if (!window[pbjsGlobal]?.getEvents) {
            return;
          }

          const pbjsClass = new this();
          //@ts-ignore
          pbjsClass.prebidInterface = window[pbjsGlobal] as typeof window.pbjs;

          pbjsClass.prebidData.prebidExists = true;
          pbjsClass.scanningStatus = true;

          pbjsClass.prebidData.pbjsNamespace = pbjsGlobal;

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
      this.calculateEventsAndUpdateData();
      this.calculateAdUnit();
      if (this.updateCounter > 0) {
        this.sendInitialData();
        this.updateCounter = 0;
      }
    }, 1200);
  }

  sendInitialData() {
    window?.postMessage({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      prebidData: this.prebidData.prebidExists
        ? JSON.parse(decycle(this.prebidData))
        : null,
    });
  }

  calculateEventsAndUpdateData() {
    let calculatedEvents: {
      [auctionId: string]: PrebidAuctionEventType[];
    } = {};
    const calculatedErrorEvents: ErrorEventType[] = [];
    const calculatedNoBids: PrebidNoBidsType = {};
    const calculatedReceivedBids: ReceivedBids[] = [];

    if (!this.prebidInterface?.getEvents) {
      return;
    }

    this.prebidInterface
      ?.getEvents()
      .forEach(({ eventType, args, elapsedTime }) => {
        switch (eventType) {
          case 'auctionInit':
            if (!calculatedEvents[args.auctionId]) {
              calculatedEvents = {
                ...calculatedEvents,
                [args.auctionId]: [],
              };
            }
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'auctionDebug':
            calculatedErrorEvents.push({
              type: args.type,
              message: args.arguments,
              time: `${Math.round(elapsedTime)}ms`,
            });
            break;
          case 'bidRequested':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'beforeBidderHttp':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'bidResponse':
            calculatedReceivedBids.push({
              bidCurrency: args.currency,
              uniqueAuctionId: args.auctionId,
              index: calculatedReceivedBids.length,
              bid: args.price ?? args.cpm,
              ownerOrigin: args.bidder,
              time: args.responseTimestamp ?? Date.now(),
              mediaContainerSize: [[args.width, args.height]],
              formattedTime: new Date(
                args.responseTimestamp ?? Date.now()
              ).toISOString(),
              adUnitCode: args.adUnitCode,
              type: '',
              adType: args.mediaType ?? '',
              eventType: 'BidAvailable',
            });

            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'bidAccepted':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'bidRejected':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'bidTimeout':
            args.forEach((arg: BidTimeoutEvent) => {
              calculatedEvents[arg.auctionId].push({
                ...arg,
                elapsedTime,
                eventType,
              });
            });
            break;
          case 'bidWon':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'noBid':
            if (!calculatedNoBids[args.adUnitCode]) {
              calculatedNoBids[args.adUnitCode] = {
                uniqueAuctionId: args.auctionId,
                adUnitCode: args.adUnitCode,
                mediaContainerSize: args.sizes,
                bidder: [args.bidder],
              };
            } else {
              calculatedNoBids[args.adUnitCode] = {
                adUnitCode: args.adUnitCode,
                mediaContainerSize: [
                  ...mergeUnique2DArrays(
                    calculatedNoBids[args.adUnitCode]?.mediaContainerSize ?? [],
                    args?.sizes ?? []
                  ),
                ],
                bidder: Array.from(
                  new Set<string>([
                    ...calculatedNoBids[args.adUnitCode].bidder,
                    args.bidder,
                  ])
                ),
                uniqueAuctionId: args.auctionId,
              };
            }
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          case 'auctionEnd':
            calculatedEvents[args.auctionId].push({
              ...args,
              elapsedTime,
              eventType,
            });
            break;
          default:
            break;
        }
      });

    if (
      !isEqual(
        JSON.parse(decycle(calculatedErrorEvents)),
        this.prebidData.errorEvents
      )
    ) {
      this.prebidData.errorEvents = structuredClone(
        JSON.parse(decycle(calculatedErrorEvents))
      );
      this.updateCounter += 1;
    }
    if (
      !isEqual(JSON.parse(decycle(calculatedNoBids)), this.prebidData.noBids)
    ) {
      this.prebidData.noBids = structuredClone(
        JSON.parse(decycle(calculatedNoBids))
      );
      this.updateCounter += 1;
    }
    if (
      !isEqual(
        JSON.parse(decycle(calculatedReceivedBids)),
        this.prebidData.receivedBids
      )
    ) {
      this.prebidData.receivedBids = structuredClone(
        JSON.parse(decycle(calculatedReceivedBids))
      );
      this.updateCounter += 1;
    }
    if (
      !isEqual(
        JSON.parse(decycle(calculatedEvents)),
        this.prebidData.auctionEvents
      )
    ) {
      this.prebidData.auctionEvents = structuredClone(
        JSON.parse(decycle(calculatedEvents))
      );
      this.updateCounter += 1;
    }
  }

  calculateAdUnit() {
    if (!this.prebidInterface?.getEvents) {
      return;
    }

    const auctionInitEvents: AuctionEndEvent[] = [];
    const bidWonEvents: {
      [adUnitCode: string]: {
        winningBid: number;
        bidCurrency: string;
        winningBidder: string;
        winningMediaContainerSize: number[][];
      };
    } = {};

    (
      Object.values(this.prebidData.auctionEvents)
        .flat()
        .filter((event) => event.eventType === 'bidWon') as BidWonEvent[]
    ).forEach((bid: BidWonEvent) => {
      bidWonEvents[bid.adUnitCode] = {
        winningBid: bid.cpm,
        winningBidder: bid.bidder,
        winningMediaContainerSize: [[bid.width, bid.height]],
        bidCurrency: bid.currency,
      };
    });

    Object.values(this.prebidData.auctionEvents).forEach((events) => {
      const auctionInitEvent = events.find(
        (event) => event.eventType === 'auctionInit'
      );

      if (auctionInitEvent) {
        auctionInitEvents.push(auctionInitEvent as AuctionEndEvent);
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

    const calculatedAdUnits =
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
          winningBid: bidWonEvents[adUnit.code]?.winningBid ?? 0,
          bidCurrency: bidWonEvents[adUnit.code]?.bidCurrency ?? '',
          winningBidder: bidWonEvents[adUnit.code]?.winningBidder ?? '',
          winningMediaContainerSize:
            bidWonEvents[adUnit.code]?.winningMediaContainerSize ?? [],
        };
        return acc;
      }, {} as AdsAndBiddersType) ?? {};

    if (!isEqual(calculatedAdUnits, this.prebidData.adUnits)) {
      this.prebidData.adUnits = calculatedAdUnits;
      this.updateCounter += 1;
    }
  }
}

PrebidInterface.doesPrebidExist();

export default PrebidInterface;
