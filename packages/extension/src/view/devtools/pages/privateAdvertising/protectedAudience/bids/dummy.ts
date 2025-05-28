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
/**
 * External dependencies.
 */
import { BidderType, type Bidder } from '@google-psat/design-system';

const preBidData = {
  name: 'books',
  index: 10,
  ownerOrigin: 'https://privacysandboxdemos-buyer-1.domain-aaa.com',
  uniqueAuctionId: 'A17572BD290E03586F266F2C95675C07',
  formattedTime: '77.95ms',
  type: 'bid',
  time: 1748410268.854791,
  eventType: 'interestGroupAccessed',
  bid: 14,
  bidCurrency: 'USD',
  mediaContainerSize: [],
  adUnitCode: 'ad-container',
  adType: 'image',
};

const bids1: Bidder[] = [
  {
    name: 'Criteo',
    duration: '200.22',
    type: BidderType.BID,
    data: {
      ...preBidData,
      name: 'auto',
      index: 21,
      bid: 16,
      formattedTime: '68.10ms',
      time: 1748410301.122,
      ownerOrigin: 'https://criteo.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-001',
    },
  },
  {
    name: 'Rubicon',
    duration: '190.84',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'lifestyle',
      index: 12,
      bid: 0,
      formattedTime: '75.42ms',
      time: 1748410311.456,
      ownerOrigin: 'https://rubicon.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-002',
    },
  },
  {
    name: 'Pubmattic',
    duration: '520.15',
    type: BidderType.TIMED_OUT,
    data: {
      ...preBidData,
      name: 'movies',
      index: 16,
      bid: 0,
      formattedTime: '95.41ms',
      time: 1748410342.555,
      ownerOrigin: 'https://pubmattic.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-005',
    },
  },
  {
    name: 'ix',
    duration: '312.75',
    type: BidderType.WON,
    data: {
      ...preBidData,
      name: 'entertainment',
      index: 9,
      bid: 20,
      formattedTime: '61.79ms',
      time: 1748410321.789,
      ownerOrigin: 'https://ix.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-003',
    },
  },
  {
    name: 'appnexus',
    duration: '265.60',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'finance',
      index: 7,
      bid: 0,
      formattedTime: '82.33ms',
      time: 1748410332.012,
      ownerOrigin: 'https://appnexus.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-004',
    },
  },
  {
    name: 'Sharethrough',
    duration: '178.90',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'health',
      index: 3,
      bid: 0,
      formattedTime: '88.76ms',
      time: 1748410352.998,
      ownerOrigin: 'https://sharethrough.bidder.com',
      uniqueAuctionId: 'BID-AUCTION-006',
    },
  },
];

const bids2: Bidder[] = [
  {
    name: 'Sharethrough',
    duration: '210.4',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'news',
      index: 2,
      bid: 0,
      formattedTime: '80.11ms',
      time: 1748410220.456,
      ownerOrigin: 'https://sharethrough.bidder.com',
    },
  },
  {
    name: 'Pubmattic',
    duration: '270.1',
    type: BidderType.BID,
    data: {
      ...preBidData,
      name: 'sports',
      index: 1,
      bid: 12,
      formattedTime: '70.23ms',
      time: 1748410210.123,
      ownerOrigin: 'https://pubmattic.bidder.com',
    },
  },
  {
    name: 'appnexus',
    duration: '240.0',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'tech',
      index: 3,
      bid: 0,
      formattedTime: '85.76ms',
      time: 1748410230.789,
      ownerOrigin: 'https://appnexus.bidder.com',
    },
  },
  {
    name: 'ix',
    duration: '380.1',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'gaming',
      index: 4,
      bid: 0,
      formattedTime: '90.50ms',
      time: 1748410241.321,
      ownerOrigin: 'https://ix.bidder.com',
    },
  },
  {
    name: 'Rubicon',
    duration: '125.51',
    type: BidderType.WON,
    data: {
      ...preBidData,
      name: 'travel',
      index: 5,
      bid: 18,
      formattedTime: '65.33ms',
      time: 1748410252.654,
      ownerOrigin: 'https://rubicon.bidder.com',
    },
  },
  {
    name: 'Criteo',
    duration: '470.05',
    type: BidderType.TIMED_OUT,
    data: {
      ...preBidData,
      name: 'fashion',
      index: 6,
      bid: 0,
      formattedTime: '100.22ms',
      time: 1748410263.987,
      ownerOrigin: 'https://criteo.bidder.com',
    },
  },
];

export const timelines = [
  {
    auctionTimeout: 350,
    auctionId: '23949b7f-b733-4a58-b3b0-e72deed1283d',
    auctionStartTime: '12:18:27',
    auctionTime: '380.1',
    bidders: bids2,
    zoomLevel: 2,
  },
  {
    auctionTimeout: 420,
    auctionId: '23949b7f-b733-4a58-b3b0-e72deed12e61',
    auctionStartTime: '11:18:12',
    auctionTime: '380.1',
    bidders: bids1,
    zoomLevel: 2,
  },
];
