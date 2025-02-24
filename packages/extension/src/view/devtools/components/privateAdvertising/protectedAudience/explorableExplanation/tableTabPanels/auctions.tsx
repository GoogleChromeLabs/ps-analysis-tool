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

interface AuctionsProps {
  auctionEvents: {
    auctionData: AuctionEventsType;
    receivedBids: Record<string, singleAuctionEvent[]>;
    noBids: NoBidsType;
  };
  customAdsAndBidders?: AdsAndBiddersType;
  isMultiSeller?: boolean;
  selectedAdUnit?: string;
  selectedDateTime?: string;
}

const Auctions = ({
  auctionEvents,
  customAdsAndBidders,
  isMultiSeller = false,
  selectedAdUnit,
  selectedDateTime,
}: AuctionsProps) => {
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
    setSidebarData((prevData: SidebarItems) => {
      if (!prevData?.adunits?.panel) {
        return prevData;
      }

      prevData.adunits.panel.props = {
        adsAndBidders: customAdsAndBidders,
        receivedBids: auctionEvents.receivedBids,
        noBids: auctionEvents.noBids,
        showEvaluationPlaceholder: Boolean(customAdsAndBidders),
      };
      return prevData;
    });
  }, [auctionEvents.noBids, auctionEvents.receivedBids, customAdsAndBidders]);

  useEffect(() => {
    if (
      !auctionEvents?.auctionData ||
      Object.keys(auctionEvents?.auctionData || {}).length === 0
    ) {
      setSidebarData((prev) => {
        prev.adunits.children = {};

        return { ...prev };
      });
    }
  }, [auctionEvents?.auctionData]);

  return (
    <AuctionsContainer
      selectedAdUnit={selectedAdUnit}
      selectedDateTime={selectedDateTime}
      isMultiSeller={isMultiSeller}
      auctionEvents={auctionEvents}
      sidebarData={sidebarData}
      customAdsAndBidders={customAdsAndBidders}
      setSidebarData={setSidebarData}
    />
  );
};

export default Auctions;
