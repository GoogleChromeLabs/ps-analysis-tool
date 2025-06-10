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
import {
  DoubleArrow,
  PillToggle,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  useTabs,
} from '@google-psat/design-system';
import type { NoBidsType } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import {
  usePrebid,
  useProtectedAudience,
  useSettings,
} from '../../../../stateProviders';
import Panel from './panel';

export enum BidsPillOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
  Timeline = 'Timeline',
}

const Bids = () => {
  const { paapi } = useProtectedAudience(({ state }) => ({
    paapi: {
      receivedBids: state.receivedBids,
      noBids: state.noBids,
    },
  }));

  const { prebidNoBids, prebidReceivedBids } = usePrebid(({ state }) => ({
    prebidNoBids: state.prebidNoBids,
    prebidReceivedBids: state.prebidReceivedBids,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { storage, setStorage } = useTabs(({ state, actions }) => ({
    storage: state.storage,
    setStorage: actions.setStorage,
  }));

  const [panelPillToggle, setPanelPillToggle] = useState<string>('Prebid');
  const [highlightOption, setHighlightOption] = useState<string>('');
  useEffect(() => {
    if (paapi?.receivedBids?.length || paapi?.noBids?.length) {
      setHighlightOption('PAAPI');
    }
  }, [paapi]);

  const [bidsPillToggle, setBidsPillToggle] = useState<string>(
    BidsPillOptions.ReceivedBids
  );

  const processedPrebidNoBids = useMemo(() => {
    if (!prebidNoBids) {
      return {};
    }

    return Object.entries(prebidNoBids).reduce((acc, [key, value]) => {
      const bids = value?.bidder.map((bid) => ({
        ownerOrigin: bid,
        name: bid,
        ...value,
      }));

      acc[key] = bids;

      return acc;
    }, {} as Record<string, NoBidsType[keyof NoBidsType][]>);
  }, [prebidNoBids]);

  const noBids = useMemo(() => {
    if (panelPillToggle === 'Prebid') {
      return Object.values(processedPrebidNoBids).flat() || [];
    }

    return Object.values(paapi?.noBids) || [];
  }, [paapi?.noBids, panelPillToggle, processedPrebidNoBids]);

  const receivedBids = useMemo(() => {
    if (panelPillToggle === 'Prebid') {
      return prebidReceivedBids || [];
    }

    return paapi?.receivedBids || [];
  }, [paapi?.receivedBids, panelPillToggle, prebidReceivedBids]);

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
  }, [updateSelectedItemKey]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view bids data, enable PSAT to use CDP via the{' '}
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
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="px-4 pb-4 flex gap-4 items-center">
        <PillToggle
          options={['Prebid', 'PAAPI']}
          pillToggle={panelPillToggle}
          setPillToggle={setPanelPillToggle}
          eeAnimatedTab={false}
          highlightOption={highlightOption}
          setHighlightOption={setHighlightOption}
        />
        <DoubleArrow className="fill-gray-500 dark:fill-bright-gray" />
        <PillToggle
          options={[
            BidsPillOptions.ReceivedBids,
            BidsPillOptions.NoBids,
            BidsPillOptions.Timeline,
          ]}
          pillToggle={bidsPillToggle}
          setPillToggle={setBidsPillToggle}
          eeAnimatedTab={false}
        />
      </div>
      <Panel
        receivedBids={receivedBids}
        noBids={noBids}
        storage={storage}
        setStorage={setStorage}
        bidsPillToggle={bidsPillToggle}
      />
    </div>
  );
};

export default Bids;
