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
import React, { useEffect } from 'react';
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import AdMatrix from './adMatrix';
import AdTable from './adTable';
import { useProtectedAudience, useSettings } from '../../../../stateProviders';

const AdUnits = () => {
  const { adsAndBidders, setSelectedAdUnit } = useProtectedAudience(
    ({ state, actions }) => ({
      adsAndBidders: state.adsAndBidders,
      setSelectedAdUnit: actions.setSelectedAdUnit,
    })
  );

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  useEffect(() => {
    return () => {
      setSelectedAdUnit(null);
    };
  }, [setSelectedAdUnit]);

  if (!isUsingCDP) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          To view ad units, enable PSAT to use CDP via the{' '}
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

  return (
    <div className="flex flex-col h-full w-full">
      {adsAndBidders && Object.keys(adsAndBidders).length > 0 ? (
        <>
          <AdMatrix />
          <AdTable />
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-sm text-raisin-black dark:text-bright-gray">
            No ad units were recorded.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdUnits;
