/*
 * Copyright 2025 Google LLC
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
export {};

declare global {
  interface AdUnit {
    code: string;
    mediaTypes?: {
      banner?: {
        sizes: Array<[number, number]>;
      };
      video?: {
        context: 'instream' | 'outstream';
        playerSize: Array<[number, number]>;
      };
      native?: {
        adTemplate?: string;
        rendererUrl?: string;
        ortb?: object;
      };
    };
    bids: Bid[];
    sizes?: number[][];
    ortb2Imp?: object;
    labelAny?: string[];
    labelAll?: string[];
  }

  interface Bid {
    bidder: string;
    params: Record<string, any>;
    labelAny?: string[];
    labelAll?: string[];
  }

  interface NoBid {
    bidder: string;
    adUnitCode: string;
    auctionId: string;
    bidId: string;
    bidderRequestId: string;
    src?: string;
    params?: Record<string, any>;
    mediaTypes?: {
      banner?: {
        sizes: Array<[number, number]>;
      };
      video?: {
        context: 'instream' | 'outstream';
        playerSize: Array<[number, number]>;
      };
      native?: object;
    };
    status?: string;
    sizes?: number[][];
    responseTimestamp?: number;
    requestTimestamp?: number;
    timeToRespond?: number;
  }

  interface PrebidEventDataMap {
    auctionInit: { auctionId: string; timestamp: number };
    auctionEnd: object;
    bidRequested: BidResponse;
    bidResponse: BidResponse;
    bidWon: BidResponse;
    bidTimeout: object[];
    setTargeting: object;
    bidRejected: BidResponse;
    bidderDone: object;
    noBid: NoBid;
    beforeRequestBids: object;
  }

  type PrebidEvent =
    | 'auctionInit'
    | 'auctionEnd'
    | 'bidRequested'
    | 'bidResponse'
    | 'bidWon'
    | 'bidTimeout'
    | 'setTargeting'
    | 'bidRejected'
    | 'bidderDone'
    | 'noBid'
    | 'beforeRequestBids'
    | 'addAdUnits';

  interface BidResponse {
    requestId: string;
    cpm: number;
    currency: string;
    width: number;
    height: number;
    ad?: string;
    adUrl?: string;
    vastUrl?: string;
    vastXml?: string;
    ttl: number;
    creativeId: string;
    netRevenue: boolean;
    bidder: string;
    adUnitCode: string;
    auctionId: string;
    price: number;
    dealId?: string;
    mediaType?: 'banner' | 'video' | 'native';
    meta?: {
      advertiserDomains?: string[];
      advertiserId?: string;
      advertiserName?: string;
      agencyId?: string;
      agencyName?: string;
      brandId?: string;
      brandName?: string;
      dchain?: object;
    };
    adserverTargeting?: Record<string, string>;
    status?: 'targetingSet' | 'rendered' | string;
    statusMessage?: string;
    pbLg?: string;
    pbMg?: string;
    pbHg?: string;
    pbAg?: string;
    pbDg?: string;
    pbCg?: string;
    size?: string;
    timeToRespond?: number;
    responseTimestamp?: number;
    requestTimestamp?: number;
    renderer?: any;
    native?: {
      title?: string;
      body?: string;
      image?: {
        url: string;
        height: number;
        width: number;
      };
      icon?: {
        url: string;
        height: number;
        width: number;
      };
      clickUrl?: string;
      clickTrackers?: string[];
      impressionTrackers?: string[];
      [key: string]: any;
    };
  }

  interface PrebidConfig {
    cache?: object;
    consentManagement?: object;
    debug?: boolean;
    enableSendAllBids?: boolean;
    priceGranularity?: string | object;
    userSync?: object;
    bidderTimeout?: number;
    useBidCache?: boolean;
    deviceAccess?: boolean;
    ortb2?: object;
    ttlBuffer?: number;
    auctionOptions?: object;
    schain?: object;
  }

  interface PrebidJsGlobal {
    que: Array<() => void>;
    adUnits: AdUnit[];
    addAdUnits(adUnits: AdUnit | AdUnit[]): void;
    removeAdUnit(code: string): void;
    requestBids(options?: {
      timeout?: number;
      adUnits?: AdUnit[];
      adUnitCodes?: string[];
      bidsBackHandler?: (
        bids: Record<string, BidResponse[]>,
        timedOut: boolean,
        auctionId: string
      ) => void;
      labels?: string[];
      auctionId?: string;
      ortb2?: object;
      ttlBuffer?: number;
    }): void;
    getBidResponses(): Record<string, { bids: BidResponse[] }>;
    getBidResponsesForAdUnitCode(adUnitCode: string): { bids: BidResponse[] };
    getAdserverTargeting(): Record<string, Record<string, string>>;
    getAdserverTargetingForAdUnitCode(code: string): Record<string, string>;
    setTargetingForGPTAsync(adUnitCodes?: string[]): void;
    setConfig(config: PrebidConfig): void;
    getConfig(key?: string): any;
    getAllWinningBids(): BidResponse[];
    getAllPrebidWinningBids(): BidResponse[];
    renderAd(document: Document, adId: string): void;
    getUserIds(): Record<string, any>;
    getUserIdsAsEids(): any[];
    getUserIdsAsync(): void;
    setBidderConfig(config: object): void;
    aliasBidder(
      adapterName: string,
      aliasedName: string,
      options?: { gvlid?: number; useBaseGvlid?: boolean }
    ): void;
    getEvents(): Array<{
      eventType: string;
      args: any;
      id?: string;
      elapsedTime: number;
    }>;
    clearAllAuctions(): void;
    getNoBids(): BidResponse[];
    getNoBidsForAdUnitCode(adUnitCode: string): BidResponse[];
    getHighestCpmBids(adUnitCode?: string): BidResponse[];
    getHighestUnusedBidResponseForAdUnitCode(
      adUnitCode: string
    ): BidResponse | null;
    installedModules: string[];
    bidderSettings: Record<string, any>;
    aliasRegistry: Record<string, string>;
    adServers: {
      dfp: {
        buildAdpodVideoUrl(options: object): string;
        buildVideoUrl(options: object): string;
      };
      freewheel: {
        getTargeting(options: object): Record<string, string>;
      };
      targetVideo: {
        buildVideoUrl(options: object): string;
      };
    };
    onEvent<K extends PrebidEvent>(
      event: K,
      handler: (data: PrebidEventDataMap[K]) => void
    ): void;

    offEvent<K extends PrebidEvent>(
      event: K,
      handler: (data: PrebidEventDataMap[K]) => void
    ): void;
  }

  interface Window {
    pbjs: PrebidJsGlobal;
  }
}
