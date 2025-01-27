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
import AdTable from './adTable';
import AdMatrix from './adMatrix';
import type {
  AdsAndBiddersType,
  NoBidsType,
  ReceivedBids,
} from '@google-psat/common';
import type { AdUnitLiteral } from '../explorableExplanation';
import EvaluationEnvironment from '../evaluationEnvironment';

interface AdUnitsPanelProps {
  adsAndBidders: AdsAndBiddersType;
  receivedBids: Record<AdUnitLiteral, ReceivedBids[]>;
  noBids: NoBidsType;
  setSelectedAdUnit: React.Dispatch<React.SetStateAction<string | null>>;
  selectedAdUnit: string | null;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdUnitsPanel = ({
  adsAndBidders,
  receivedBids,
  noBids,
  setSelectedAdUnit,
  selectedAdUnit,
  setIsInspecting,
}: AdUnitsPanelProps) => {
  return (
    <div className="flex flex-col h-full w-full">
      {adsAndBidders && Object.keys(adsAndBidders).length > 0 ? (
        <>
          <AdMatrix
            adsAndBidders={adsAndBidders}
            receivedBids={Object.keys(receivedBids ?? {})
              .map((key: string) => receivedBids?.[key as AdUnitLiteral] ?? [])
              .flat()}
            noBids={noBids}
          />
          <AdTable
            adsAndBidders={adsAndBidders}
            setSelectedAdUnit={setSelectedAdUnit}
            selectedAdUnit={selectedAdUnit}
            setIsInspecting={setIsInspecting}
          />
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-sm text-raisin-black dark:text-bright-gray">
            No ad units were recorded.
          </p>
          <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the ad units." />
        </div>
      )}
    </div>
  );
};

export default AdUnitsPanel;
