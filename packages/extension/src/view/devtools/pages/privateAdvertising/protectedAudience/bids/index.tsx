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
import React, { useCallback, useMemo, useState } from 'react';
import {
  DoubleArrow,
  PillToggle,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  useTabs,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { useProtectedAudience, useSettings } from '../../../../stateProviders';
import Panel from './panel';

export enum BidsPillOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
  Timeline = 'Timeline',
}

const Bids = () => {
  const { paapi, prebidReponse } = useProtectedAudience(({ state }) => ({
    paapi: {
      receivedBids: state.receivedBids,
      noBids: state.noBids,
    },
    prebidReponse: state.prebidResponse,
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
  const [bidsPillToggle, setBidsPillToggle] = useState<string>(
    BidsPillOptions.ReceivedBids
  );
  const noBids = useMemo(() => {
    if (panelPillToggle === 'Prebid') {
      return prebidReponse?.noBids || {};
    }

    return paapi?.noBids || {};
  }, [paapi?.noBids, panelPillToggle, prebidReponse.noBids]);

  const receivedBids = useMemo(() => {
    if (panelPillToggle === 'Prebid') {
      return prebidReponse?.receivedBids || [];
    }

    return paapi?.receivedBids || [];
  }, [paapi?.receivedBids, panelPillToggle, prebidReponse.receivedBids]);

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
