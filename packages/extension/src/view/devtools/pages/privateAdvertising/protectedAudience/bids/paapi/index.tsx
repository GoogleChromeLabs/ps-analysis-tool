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

interface PaapiBidsPanelProps {
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

const PaapiBidsPanel = ({ storage, setStorage }: PaapiBidsPanelProps) => {
  const timeline = {
    auctionTimeout: 350,
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

export default PaapiBidsPanel;
