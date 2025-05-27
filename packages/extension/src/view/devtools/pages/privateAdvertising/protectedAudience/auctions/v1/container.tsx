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
 * External dependencies.
 */
import { SidebarProvider, type SidebarItems } from '@google-psat/design-system';
import type {
  AdsAndBiddersType,
  NoBidsType,
  ReceivedBids,
  singleAuctionEvent,
} from '@google-psat/common';
import React from 'react';

/**
 * Internal dependencies.
 */
import AuctionPanel from './panel';
import type { AuctionEventsType } from '../../../../../stateProviders/protectedAudience/context';

interface AuctionsContainerProps {
  auctionEvents: {
    auctionData: AuctionEventsType;
    receivedBids?: Record<string, singleAuctionEvent[]> | ReceivedBids[];
    noBids: NoBidsType;
  };
  adsAndBidders?: AdsAndBiddersType;
  sidebarData: SidebarItems;
  customAdsAndBidders?: AdsAndBiddersType;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
  isMultiSeller?: boolean;
  selectedAdUnit?: string;
  selectedDateTime?: string;
  isEE?: boolean;
  sortOrder?: string;
  setSortOrder?: React.Dispatch<React.SetStateAction<'asc' | 'desc'>>;
}

const AuctionsContainer = ({
  auctionEvents,
  sidebarData,
  customAdsAndBidders,
  setSidebarData,
  isMultiSeller = false,
  selectedAdUnit,
  selectedDateTime,
  isEE = true,
  sortOrder,
  setSortOrder,
  adsAndBidders,
}: AuctionsContainerProps) => {
  return (
    <SidebarProvider
      data={sidebarData}
      defaultSelectedItemKey={Object.keys(sidebarData)?.[0]}
    >
      <AuctionPanel
        isEE={isEE}
        selectedAdUnit={selectedAdUnit}
        selectedDateTime={selectedDateTime}
        isMultiSeller={isMultiSeller}
        customAdsAndBidders={customAdsAndBidders}
        setSidebarData={setSidebarData}
        auctionEvents={auctionEvents}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        adsAndBidders={adsAndBidders}
      />
    </SidebarProvider>
  );
};

export default AuctionsContainer;
