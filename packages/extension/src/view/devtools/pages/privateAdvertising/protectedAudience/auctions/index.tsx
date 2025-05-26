/*
 * Copyright 2025 Google LLC
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
import { useProtectedAudience } from '../../../../stateProviders';
import AuctionsV1 from './v1';
import AuctionsV2 from './v2';

const Auctions = () => {
  const { isMultiSeller, prebidResponse } = useProtectedAudience(
    ({ state }) => ({
      isMultiSeller: state.isMultiSellerAuction,
      prebidResponse: state.prebidResponse,
    })
  );

  if (
    !isMultiSeller &&
    Object.keys(prebidResponse?.adUnits || {}).length === 0
  ) {
    return <AuctionsV1 />;
  }

  return <AuctionsV2 />;
};

export default Auctions;
