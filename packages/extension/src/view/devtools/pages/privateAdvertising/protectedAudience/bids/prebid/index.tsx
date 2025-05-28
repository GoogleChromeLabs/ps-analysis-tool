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

/**
 * Internal dependencies.
 */
import Panel from '../panel';

interface PrebidBidsPanelProps {
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  eeAnimatedTab?: boolean;
}

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

const bids: Bidder[] = [
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

const PrebidBidsPanel = ({ storage, setStorage }: PrebidBidsPanelProps) => {
  const timeline = {
    auctionTimeout: 420,
    auctionId: '23949b7f-b733-4a58-b3b0-e72deed12e61',
    auctionStartTime: '12:18:27',
    auctionTime: '380.1',
    bidders: bids,
    zoomLevel: 2,
  };

  return (
    <Panel storage={storage} setStorage={setStorage} timeline={timeline} />
  );
};

export default PrebidBidsPanel;
