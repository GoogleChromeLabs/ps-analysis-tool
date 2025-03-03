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
 * External dependencies
 */
import React from 'react';
import type {
  AdsAndBiddersType,
  NoBidsType,
  ReceivedBids,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import PresentationalMatrix from './presentationalMatrix';
import Matrix from './matrix';

interface MatrixData {
  adUnitCode: string;
  adsAndBidders: AdsAndBiddersType;
  receivedBids?: ReceivedBids[];
  noBids?: NoBidsType;
}
const MatrixHOC = ({
  adUnitCode,
  adsAndBidders,
  receivedBids,
  noBids,
}: MatrixData) => {
  if (adUnitCode && adsAndBidders && receivedBids && noBids) {
    return (
      <PresentationalMatrix
        adUnitCode={adUnitCode}
        adsAndBidders={adsAndBidders}
        receivedBids={receivedBids}
        noBids={noBids}
      />
    );
  }

  return <Matrix adUnitCode={adUnitCode} />;
};

export default MatrixHOC;
