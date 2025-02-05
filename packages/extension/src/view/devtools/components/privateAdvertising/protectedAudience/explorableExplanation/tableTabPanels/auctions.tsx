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
import type { SidebarItems } from '@google-psat/design-system';
import React, { useEffect, useState } from 'react';
import type {
  AdsAndBiddersType,
  NoBidsType,
  singleAuctionEvent,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import AdUnitsPanel from '../../adUnits/panel';
import type { AuctionEventsType } from '../../../../../stateProviders/protectedAudience/context';
import AuctionsContainer from '../../auctions/container';
import type { AdUnitLiteral } from '../auctionEventTransformers';

interface AuctionsProps {
  auctionEvents: {
    auctionData: AuctionEventsType;
    receivedBids: Record<AdUnitLiteral, singleAuctionEvent[]>;
    noBids: NoBidsType;
  };
  customAdsAndBidders?: AdsAndBiddersType;
}

const Auctions = ({ auctionEvents, customAdsAndBidders }: AuctionsProps) => {
  const [sidebarData, setSidebarData] = useState<SidebarItems>({
    adunits: {
      title: 'Ad Units',
      panel: {
        Element: AdUnitsPanel,
        props: {
          adsAndBidders: customAdsAndBidders,
          receivedBids: auctionEvents?.receivedBids || {},
          noBids: auctionEvents?.noBids || {},
          showEvaluationPlaceholder: Boolean(customAdsAndBidders),
        },
      },
      children: {},
      dropdownOpen: true,
    },
  });

  useEffect(() => {
    if (
      !auctionEvents.auctionData ||
      Object.keys(auctionEvents.auctionData).length === 0
    ) {
      setSidebarData((prev) => {
        prev.adunits.children = {};

        return { ...prev };
      });
    }
  }, [auctionEvents.auctionData]);

  return (
    <AuctionsContainer
      auctionEvents={auctionEvents}
      sidebarData={sidebarData}
      customAdsAndBidders={customAdsAndBidders}
      setSidebarData={setSidebarData}
    />
  );
};

export default Auctions;
