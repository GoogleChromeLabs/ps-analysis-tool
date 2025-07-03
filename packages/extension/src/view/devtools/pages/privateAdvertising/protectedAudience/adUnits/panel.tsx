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
import React, { useCallback, useMemo } from 'react';
import type {
  AdsAndBiddersType,
  AuctionEventsType,
  NoBidsType,
  PrebidEvents,
  PrebidNoBidsType,
  ReceivedBids,
} from '@google-psat/common';
import {
  PillToggle,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import EvaluationEnvironment from '../evaluationEnvironment';
import AdMatrix from './adMatrix';
import AdTable from './adTable';
import { useSettings } from '../../../../stateProviders';

type DummyReceivedBids = Record<string, ReceivedBids[]>;

interface AdUnitsPanelProps {
  adsAndBidders: AdsAndBiddersType;
  receivedBids: DummyReceivedBids | ReceivedBids[];
  noBids: NoBidsType | PrebidNoBidsType;
  auctionEvents: AuctionEventsType | PrebidEvents['auctionEvents'];
  setSelectedAdUnit: React.Dispatch<React.SetStateAction<string | null>>;
  selectedAdUnit: string | null;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  showEvaluationPlaceholder?: boolean;
  isEE?: boolean;
  pillToggle: string;
  setPillToggle: React.Dispatch<React.SetStateAction<string>>;
  highlightOption?: string;
  setHighlightOption?: (value: string) => void;
  navigateToSettings?: () => void;
}

const AdUnitsPanel = ({
  adsAndBidders,
  receivedBids,
  noBids,
  auctionEvents,
  setSelectedAdUnit,
  selectedAdUnit,
  setIsInspecting,
  showEvaluationPlaceholder = true,
  isEE,
  pillToggle,
  setPillToggle,
  highlightOption,
  setHighlightOption,
  navigateToSettings,
}: AdUnitsPanelProps) => {
  const adUnitsCount = Object.values(adsAndBidders).length;
  const biddersCount = useMemo(
    () =>
      Object.values(adsAndBidders).reduce((acc, ad) => {
        if (ad.bidders) {
          ad.bidders.forEach((bidder) => {
            acc.add(bidder);
          });
        }
        return acc;
      }, new Set()),
    [adsAndBidders]
  );
  const bidsCount = Object.keys(receivedBids ?? {}).length;
  const noBidsCount = Object.keys(noBids).length;

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    if (navigateToSettings) {
      navigateToSettings();
    } else {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
    }
  }, [updateSelectedItemKey, navigateToSettings]);

  return (
    <div className="flex flex-col h-full w-full">
      {!isEE && (
        <div className="p-4">
          <PillToggle
            options={['Prebid', 'PAAPI']}
            pillToggle={pillToggle}
            setPillToggle={setPillToggle}
            eeAnimatedTab={Boolean(isEE)}
            highlightOption={highlightOption}
            setHighlightOption={setHighlightOption}
          />
        </div>
      )}
      <div className="flex flex-col flex-1 w-full overflow-auto">
        {Object.keys(adsAndBidders || {}).length ||
        Object.keys(auctionEvents || {}).length ? (
          <>
            <AdMatrix
              adUnitsCount={adUnitsCount}
              biddersCount={biddersCount.size}
              bidsCount={bidsCount}
              noBidsCount={noBidsCount}
            />
            <AdTable
              receivedBids={receivedBids}
              adsAndBidders={adsAndBidders}
              setSelectedAdUnit={setSelectedAdUnit}
              selectedAdUnit={selectedAdUnit}
              setIsInspecting={setIsInspecting}
              isEE={isEE}
              auctionEvents={
                pillToggle === 'Prebid'
                  ? (auctionEvents as PrebidEvents['auctionEvents'])
                  : undefined
              }
            />
          </>
        ) : !isUsingCDP && pillToggle === 'PAAPI' ? (
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
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <p className="text-lg text-raisin-black dark:text-bright-gray">
              No ad units were recorded.
            </p>
            {showEvaluationPlaceholder && pillToggle !== 'Prebid' && (
              <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the ad units if you haven’t already." />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdUnitsPanel;
