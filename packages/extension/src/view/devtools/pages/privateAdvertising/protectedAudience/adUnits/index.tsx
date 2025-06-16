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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import {
  useCookie,
  usePrebid,
  useProtectedAudience,
  useSettings,
} from '../../../../stateProviders';
import Panel from './panel';

const AdUnits = () => {
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
    prebidAdunits: state.prebidData.adUnits,
    prebidAuctionEvents: state.prebidData.auctionEvents,
    prebidReceivedBids: state.prebidData.receivedBids,
    prebidNoBids: state.prebidData.noBids,
  }));

  const { setIsInspecting } = useCookie(({ actions }) => ({
    setIsInspecting: actions.setIsInspecting,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  useEffect(() => {
    return () => {
      setIsInspecting(false);
    };
  }, [setIsInspecting]);

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  useEffect(() => {
    return () => {
      setSelectedAdUnit(null);
    };
  }, [setSelectedAdUnit]);

  const [pillToggle, setPillToggle] = useState('Prebid');

  const { adsAndBidders, receivedBids, noBids, auctionEvents } = useMemo(() => {
    if (pillToggle === 'Prebid') {
      return {
        adsAndBidders: prebidAdunits || {},
        receivedBids: prebidReceivedBids || [],
        noBids: prebidNoBids || {},
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

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
  }, [updateSelectedItemKey]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view ad units, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={cdpNavigation}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

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
    />
  );
};

export default AdUnits;
