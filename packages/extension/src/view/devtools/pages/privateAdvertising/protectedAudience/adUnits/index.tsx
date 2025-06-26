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
import React, { useEffect, useMemo, useState } from 'react';
import type { PrebidNoBidsType } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import {
  useCookie,
  usePrebid,
  useProtectedAudience,
} from '../../../../stateProviders';
import Panel from './panel';

interface AdUnitsProps {
  navigateToSettings?: () => void;
}

const AdUnits = ({ navigateToSettings }: AdUnitsProps) => {
  const { paapi, selectedAdUnit, setSelectedAdUnit } = useProtectedAudience(
    ({ state, actions }) => ({
      paapi: {
        adsAndBidders: state.adsAndBidders,
        receivedBids: state.receivedBids,
        noBids: state.noBids,
        auctionEvents: state.auctionEvents,
      },
      selectedAdUnit: state.selectedAdUnit,
      setSelectedAdUnit: actions.setSelectedAdUnit,
    })
  );

  const {
    prebidAdunits,
    prebidAuctionEvents,
    prebidReceivedBids,
    prebidNoBids,
  } = usePrebid(({ state }) => ({
    prebidAdunits: state.prebidData?.adUnits,
    prebidAuctionEvents: state.prebidData?.auctionEvents,
    prebidReceivedBids: state.prebidData?.receivedBids,
    prebidNoBids: state.prebidData?.noBids,
  }));

  const { setIsInspecting } = useCookie(({ actions }) => ({
    setIsInspecting: actions.setIsInspecting,
  }));

  useEffect(() => {
    return () => {
      setIsInspecting(false);
    };
  }, [setIsInspecting]);

  useEffect(() => {
    return () => {
      setSelectedAdUnit(null);
    };
  }, [setSelectedAdUnit]);

  const [pillToggle, setPillToggle] = useState(
    (prebidAdunits && Object.keys(prebidAdunits).length > 0) ||
      Object.keys(paapi.adsAndBidders || {}).length === 0
      ? 'Prebid'
      : 'PAAPI'
  );
  const [highlightOption, setHighlightOption] = useState<string>();

  useEffect(() => {
    if (paapi.adsAndBidders && Object.keys(paapi.adsAndBidders).length > 0) {
      setHighlightOption('PAAPI');
    }
  }, [paapi.adsAndBidders]);

  const { adsAndBidders, receivedBids, noBids, auctionEvents } = useMemo(() => {
    if (pillToggle === 'Prebid') {
      const processedNobids = Object.entries(prebidNoBids ?? {}).reduce(
        (acc, [key, value]) => {
          value?.bidder.forEach(
            (bid) =>
              (acc[key + bid] = {
                ...value,
              })
          );

          return acc;
        },
        {} as PrebidNoBidsType
      );
      return {
        adsAndBidders: prebidAdunits || {},
        receivedBids: prebidReceivedBids || [],
        noBids: processedNobids || {},
        auctionEvents: prebidAuctionEvents || {},
      };
    }

    return {
      adsAndBidders: paapi.adsAndBidders,
      receivedBids: paapi.receivedBids,
      noBids: paapi.noBids,
      auctionEvents: paapi.auctionEvents,
    };
  }, [
    paapi.adsAndBidders,
    paapi.auctionEvents,
    paapi.noBids,
    paapi.receivedBids,
    pillToggle,
    prebidAdunits,
    prebidAuctionEvents,
    prebidNoBids,
    prebidReceivedBids,
  ]);

  return (
    <Panel
      adsAndBidders={adsAndBidders}
      receivedBids={receivedBids}
      noBids={noBids}
      setSelectedAdUnit={setSelectedAdUnit}
      selectedAdUnit={selectedAdUnit}
      setIsInspecting={setIsInspecting}
      auctionEvents={auctionEvents ?? {}}
      pillToggle={pillToggle}
      setPillToggle={setPillToggle}
      highlightOption={highlightOption}
      setHighlightOption={setHighlightOption}
      navigateToSettings={navigateToSettings}
    />
  );
};

export default AdUnits;
