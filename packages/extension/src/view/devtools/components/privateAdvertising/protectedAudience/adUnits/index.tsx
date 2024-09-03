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
import React from 'react';

/**
 * Internal dependencies.
 */
import AdMatrix from './adMatrix';
import AdTable from './adTable';
import { useProtectedAudience } from '../../../../stateProviders';

const AdUnits = () => {
  const { adsAndBidders } = useProtectedAudience(({ state }) => ({
    adsAndBidders: state.adsAndBidders,
  }));

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
