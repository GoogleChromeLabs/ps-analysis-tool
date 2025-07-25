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
 * External dependencies
 */
import type { Protocol } from 'devtools-protocol';

export interface singleAuctionEvent {
  bidCurrency?: string;
  uniqueAuctionId?: Protocol.Storage.InterestGroupAuctionId;
  index: number;
  bid?: number;
  name?: string;
  ownerOrigin?: string;
  type: string;
  formattedTime: string | Date;
  componentSellerOrigin?: string;
  time: number;
  auctionConfig?: object;
  url?: string;
  interestGroupConfig?: Protocol.Storage.InterestGroupAccessedEvent;
  parentAuctionId?: Protocol.Storage.InterestGroupAuctionId;
  eventType:
    | 'interestGroupAuctionEventOccurred'
    | 'interestGroupAuctionNetworkRequestCompleted'
    | 'interestGroupAuctionNetworkRequestCreated'
    | 'interestGroupAccessed'
    | 'BidAvailable';
}

export interface auctionData {
  [uniqueAuctionId: Protocol.Storage.InterestGroupAuctionId]: {
    auctionTime: Protocol.Network.TimeSinceEpoch;
    auctionConfig?: any;
    parentAuctionId?: Protocol.Storage.InterestGroupAuctionId;
  };
}

export type InterestGroups = singleAuctionEvent & {
  details: any;
};

export type MultiSellerAuction = {
  [parentAuctionId: string]: {
    [uniqueAuctionId: string]: singleAuctionEvent[];
  };
};

export type SingleSellerAuction = {
  [parentAuctionId: string]: singleAuctionEvent[];
};

export type NoBidsType = {
  [auctionId: string]: {
    ownerOrigin: string;
    name: string;
    uniqueAuctionId: string;
    adUnitCode?: string;
    mediaContainerSize?: number[][];
  };
};

export type PrebidNoBidsType = {
  [adUnitCode: string]: {
    bidder: string[];
    uniqueAuctionId: string;
    adUnitCode?: string;
    mediaContainerSize?: number[][];
  };
};

export type AdsAndBiddersTypeData = {
  adUnitCode: string;
  bidders: string[];
  mediaContainerSize: number[][];
  winningBid: number;
  bidCurrency: string;
  winningBidder: string;
  winningMediaContainerSize?: number[][];
};

export type AdsAndBiddersType = {
  [adUnitCode: string]: AdsAndBiddersTypeData;
};

export type ReceivedBids = singleAuctionEvent & {
  adUnitCode?: string;
  mediaContainerSize?: number[][];
  adType?: string;
};

export interface PrebidDebugModuleConfig {
  enabled?: boolean;
  intercept: PrebidDebugModuleConfigRule[];
}

export interface PrebidDebugModuleConfigRule {
  when: { [key: string]: string | number };
  then: {
    [key: string]: string | number;
  };
}

export type AuctionEventsType = {
  [adunit: string]: {
    [time: string]: {
      [sellerURL: string]: {
        [auctionHostURL: string]: singleAuctionEvent[];
      };
    };
  };
};
