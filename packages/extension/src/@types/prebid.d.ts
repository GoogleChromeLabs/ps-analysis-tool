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

  interface BeforeBidderHttpEvent {
    bidder: string;
    adUnitCode: string;
    bidId: string;
    auctionId: string;
    bidderRequestId: string;
    src?: string; // e.g., 'client' or 'server'
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
    ortb2Imp?: object;
    transactionId?: string;
    sizes?: Array<[number, number]>;
  }

  interface BidRequestedEvent {
    bidder: string;
    auctionId: string;
    bidderRequestId: string;
    bids: Array<{
      adUnitCode: string;
      bidId: string;
      bidder: string;
      auctionId: string;
      bidderRequestId: string;
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
      ortb2Imp?: object;
      transactionId?: string;
      sizes?: Array<[number, number]>;
    }>;
    start: number; // Timestamp when the request started
    timeout: number; // Timeout in milliseconds
    refererInfo?: {
      referer: string;
      reachedTop: boolean;
      numIframes: number;
      stack: string[];
    };
    src?: string; // e.g., 'client' or 'server'
    tags?: any[];
  }

  interface BidWonEvent {
    adUnitCode: string;
    requestId: string;
    cpm: number;
    currency: string;
    creativeId: string;
    dealId?: string;
    width: number;
    height: number;
    ad?: string;
    adUrl?: string;
    vastUrl?: string;
    vastXml?: string;
    ttl: number;
    netRevenue: boolean;
    bidder: string;
    timeToRespond: number;
    auctionId: string;
    responseTimestamp?: number;
    requestTimestamp?: number;
    status?: string;
    adserverTargeting?: Record<string, string>;
    meta?: {
      advertiserDomains?: string[];
      [key: string]: any;
    };
    mediaType?: 'banner' | 'video' | 'native';
    renderer?: any;
    native?: any;
  }

  interface PrebidEventDataMap {
    auctionInit: { auctionId: string; timestamp: number };
    auctionEnd: AuctionEndEvent;
    bidRequested: BidRequestedEvent;
    bidResponse: BidResponse;
    bidWon: BidWonEvent;
    bidTimeout: BidTimeoutEvent[];
    bidRejected: BidRejectedEvent;
    bidderDone: BidderDoneEvent;
    noBid: NoBid;
    bidAccepted: BidAcceptedEvent;
    beforeRequestBids: BeforeRequestBidsEvent;
    beforeBidderHttp: BeforeBidderHttpEvent;
    auctionDebug: AuctionDebugEvent;
  }

  interface BidderDoneEvent {
    bidderCode: string;
    serverResponseTimeMs?: number;
    timeToRespond: number;
    bids?: BidResponse[];
  }

  interface BidTimeoutEvent {
    bidId: string;
    bidder: string;
    adUnitCode: string;
    auctionId: string;
    bidderRequestId: string;
    timeout: number;
    params?: Record<string, any>;
  }

  interface BidRejectedEvent {
    adUnitCode: string;
    bidder: string;
    reason: string;
    bid: Partial<BidResponse>; // It's usually a bid that failed validation
  }

  interface BidAcceptedEvent {
    adUnitCode: string;
    requestId: string;
    cpm: number;
    currency: string;
    creativeId: string;
    dealId?: string;
    width: number;
    height: number;
    ad?: string;
    adUrl?: string;
    vastUrl?: string;
    vastXml?: string;
    ttl: number;
    netRevenue: boolean;
    bidder: string;
    timeToRespond: number;
    auctionId: string;
    responseTimestamp?: number;
    requestTimestamp?: number;
    adserverTargeting?: Record<string, string>;
    meta?: {
      advertiserDomains?: string[];
      mediaType?: string;
      secondaryCatIds?: string[];
      networkId?: string;
      agencyId?: string;
    };
    mediaType?: 'banner' | 'video' | 'native';
    renderer?: any;
    native?: any;
    status?: string; // e.g., "rendered", "available"
  }

  interface BeforeRequestBidsEvent {
    timeout: number;
    adUnits: AdUnit[];
    labels?: string[];
    auctionId: string;
    start?: number;
  }

  interface AuctionEndEvent {
    auctionId: string;
    timestamp: number;
    timeout: number;
    adUnits: AdUnit[];
    bidsReceived: BidResponse[];
    winningBids: BidWonEvent[];
    noBids: NoBid[];
  }

  type PrebidEvent =
    | 'auctionInit'
    | 'auctionEnd'
    | 'auctionDebug'
    | 'bidRequested'
    | 'beforeBidderHttp'
    | 'bidAccepted'
    | 'bidResponse'
    | 'bidWon'
    | 'bidTimeout'
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

  type AuctionDebugEventType = 'INFO' | 'WARNING' | 'ERROR';

  interface UserIdConfig {
    name: string;
    storage?: {
      type: 'cookie' | 'html5';
      name: string;
      expires?: number; // in days
      refreshInSeconds?: number;
    };
    params?: Record<string, any>;
    value?: any; // Used when identity is already available and set manually
    bidders?: string[]; // Optional: only enable this ID for specific bidders
  }

  interface AuctionDebugEvent {
    type: AuctionDebugEventType;
    arguments: string[];
  }

  interface PrebidDebugModuleConfig {
    enabled?: boolean;
    intercept: PrebidDebugModuleConfigRule[];
  }
  interface PrebidDebugModuleConfigRule {
    when: { [key: string]: string | number };
    then: {
      [key: string]: string | number | INativeRules;
      native?: INativeRules;
      video?: IVideoRules;
    };
  }
  interface PrebidConfig {
    debug?: boolean;
    bidderTimeout?: number;
    enableSendAllBids?: boolean;
    bidderSequence?: string;
    useBidCache?: boolean;
    priceGranularity?: 'low' | 'medium' | 'high' | 'auto' | 'dense' | 'custom';
    currency?: {
      adServerCurrency: string;
      granularityMultiplier?: number;
      defaultRates?: Record<string, number>;
      conversionRateFile?: string;
      rates?: Record<string, number>;
    };
    consentManagement?: {
      gdpr?: {
        cmpApi: 'iab' | 'static' | 'iabnonsupport' | 'none';
        timeout?: number;
        allowAuctionWithoutConsent?: boolean;
        defaultGdprScope?: boolean;
      };
      usp?: {
        cmpApi: 'iab' | 'static' | 'none';
        timeout?: number;
      };
    };
    userSync?: {
      userIds?: UserIdConfig[];
      syncEnabled?: boolean;
      filterSettings?: {
        all?: {
          bidders?: string[];
          filter?: 'include' | 'exclude';
        };
        iframe?: {
          bidders?: string[];
          filter?: 'include' | 'exclude';
        };
        image?: {
          bidders?: string[];
          filter?: 'include' | 'exclude';
        };
      };
      syncsPerBidder?: number;
      syncDelay?: number;
      auctionDelay?: number;
      enableOverride?: boolean;
    };
    cache?: {
      url?: string;
      vasturl?: string;
      ignoreBidderCacheKey?: boolean;
    };
    targetingControls?: {
      alwaysIncludeDeals?: boolean;
      appendBidderNames?: boolean;
      includeWinners?: boolean;
      includeBidderKeys?: boolean;
    };
    s2sConfig?:
      | {
          accountId: string;
          bidders: string[];
          timeout?: number;
          adapter?: string;
          endpoint?: string;
          syncEndpoint?: string;
          cookieSet?: boolean;
          cookieSetUrl?: string;
          defaultVendor?: string;
          sendTopBidOnly?: boolean;
          allowUnknownBidderCodes?: boolean;
        }
      | Array<{
          name: string;
          accountId: string;
          bidders: string[];
          timeout?: number;
          adapter?: string;
          endpoint?: string;
          syncEndpoint?: string;
          cookieSet?: boolean;
          cookieSetUrl?: string;
          defaultVendor?: string;
          sendTopBidOnly?: boolean;
          allowUnknownBidderCodes?: boolean;
        }>;
    ortb2?: {
      site?: {
        page?: string;
        domain?: string;
        ref?: string;
        keywords?: string;
        cat?: string[];
        sectioncat?: string[];
        pagecat?: string[];
        content?: {
          id?: string;
          episode?: number;
          title?: string;
          series?: string;
          season?: string;
          artist?: string;
          genre?: string;
          album?: string;
          isrc?: string;
          producer?: {
            id?: string;
            name?: string;
          };
          url?: string;
          cat?: string[];
          prodq?: number;
          context?: number;
          contentrating?: string;
          userrating?: string;
          qagmediarating?: number;
          keywords?: string;
          livestream?: boolean;
          sourcerelationship?: number;
          len?: number;
          language?: string;
          embeddable?: boolean;
          data?: Array<{
            id?: string;
            name?: string;
            segment?: Array<{
              id?: string;
              name?: string;
              value?: string;
            }>;
          }>;
        };
        publisher?: {
          id?: string;
          name?: string;
          cat?: string[];
          domain?: string;
        };
        ext?: Record<string, any>;
      };
      user?: {
        id?: string;
        buyeruid?: string;
        yob?: number;
        gender?: string;
        keywords?: string;
        customdata?: string;
        geo?: {
          lat?: number;
          lon?: number;
          type?: number;
          accuracy?: number;
          lastfix?: number;
          ipservice?: number;
          country?: string;
          region?: string;
          regionfips104?: string;
          metro?: string;
          city?: string;
          zip?: string;
          utcoffset?: number;
        };
        data?: Array<{
          id?: string;
          name?: string;
          segment?: Array<{
            id?: string;
            name?: string;
            value?: string;
          }>;
        }>;
        ext?: Record<string, any>;
      };
      device?: {
        ua?: string;
        geo?: {
          lat?: number;
          lon?: number;
          type?: number;
          accuracy?: number;
          lastfix?: number;
          ipservice?: number;
          country?: string;
          region?: string;
          regionfips104?: string;
          metro?: string;
          city?: string;
          zip?: string;
          utcoffset?: number;
        };
        dnt?: number;
        lmt?: number;
        ip?: string;
        ipv6?: string;
        devicetype?: number;
        make?: string;
        model?: string;
        os?: string;
        osv?: string;
        hwv?: string;
        h?: number;
        w?: number;
        ppi?: number;
        pxratio?: number;
        js?: number;
        geofetch?: number;
        flashver?: string;
        language?: string;
        carrier?: string;
        mccmnc?: string;
        connectiontype?: number;
        ifa?: string;
        didsha1?: string;
        didmd5?: string;
        dpidsha1?: string;
        dpidmd5?: string;
        macsha1?: string;
        macmd5?: string;
      };
      regs?: {
        coppa?: number;
        gdpr?: number;
        us_privacy?: string;
        ext?: Record<string, any>;
      };
      ext?: Record<string, any>;
    };
    labels?: string[];
    maxNestedIframes?: number;
    disableAjaxTimeout?: boolean;
    enableTIDs?: boolean;
    gptPreAuction?: GptPreAuctionConfig;
    allowActivities?: {
      [activity: string]: {
        rules: Array<{
          priority: number;
          condition: (params: any) => boolean;
          allow: boolean;
        }>;
      };
    };
    analytics?: Array<{
      provider: string;
      options: Record<string, any>;
      includeEvents?: string[];
      excludeEvents?: string[];
    }>;
    bidderSettings?: Record<string, SingleBidderSetting>;
    [key: string]: any;
  }

  interface GptPreAuctionConfig {
    enabled: boolean;
    timeout?: number; // in milliseconds
    setTargeting?: boolean;
    suppressInitialLoad?: boolean;
    auctionDelay?: number;
    requestBidsHook?: () => void;
  }

  type SingleBidderSetting = {
    bidCpmAdjustment?: (bidCpm: number) => number;
    alwaysUseBid?: boolean;
    sendStandardTargeting?: boolean;
    adserverTargeting?: Array<{
      key: string;
      val: (bidResponse: any) => string;
    }>;
  };

  type PriceGranularityValue = Array<{
    min: number;
    max: number;
    increment: number;
    precision: number;
  }>;

  type CustomPriceGranularity = {
    buckets: PriceGranularityValue;
  };

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
    version: string;
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
