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
import {
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  type SidebarItems,
} from '@google-psat/design-system';
/**
 * Internal dependencies.
 */
import { useProtectedAudience, useSettings } from '../../../../stateProviders';
import AuctionsContainer from './container';
import AdUnits from '../adUnits';
import EvaluationEnvironment from '../evaluationEnvironment';

const Auctions = () => {
  const [sidebarData, setSidebarData] = useState<SidebarItems>({
    adunits: {
      title: 'Ad Units',
      panel: {
        Element: AdUnits,
        props: {},
      },
      children: {},
      dropdownOpen: true,
    },
  });

  const { auctionEvents } = useProtectedAudience(({ state }) => ({
    auctionEvents: state.auctionEvents ?? {},
  }));

  useEffect(() => {
    if (!auctionEvents || Object.keys(auctionEvents).length === 0) {
      setSidebarData((prev) => {
        prev.adunits.children = {};

        return { ...prev };
      });
    }
  }, [auctionEvents]);

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const auctionData = useMemo(() => {
    return {
      auctionData: auctionEvents,
    };
  }, [auctionEvents]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view auctions, enable PSAT to use CDP via the{' '}
          <button
            className="text-bright-navy-blue dark:text-jordy-blue"
            onClick={() => {
              document
                .getElementById('cookies-landing-scroll-container')
                ?.scrollTo(0, 0);
              updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
            }}
          >
            Settings Page
          </button>
          .
        </p>
      </div>
    );
  }

  if (!auctionEvents || Object.keys(auctionEvents).length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          No auction events were recorded.
        </p>
        <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the auction events." />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* <Breakpoints /> -- To be added in the upcoming version */}
      <div className="overflow-auto flex-1">
        <AuctionsContainer
          auctionEvents={auctionData}
          sidebarData={sidebarData}
          setSidebarData={setSidebarData}
        />
      </div>
    </div>
  );
};

export default Auctions;
