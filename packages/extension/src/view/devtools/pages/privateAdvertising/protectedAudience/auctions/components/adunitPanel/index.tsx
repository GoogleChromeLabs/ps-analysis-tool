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
import { useTabs } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import {
  useCookie,
  useProtectedAudience,
} from '../../../../../../stateProviders';
import Panel from './panel';

interface AdunitPanelProps {
  adunit: string;
  mediaContainerSize: number[][];
  bidders: string[];
  biddersCount: number;
  bidsCount: number;
  noBidsCount: number;
  winnerBid: string | null;
  winnerContainerSize?: number[];
}

const AdunitPanel = ({
  adunit,
  mediaContainerSize,
  bidders,
  biddersCount,
  bidsCount,
  noBidsCount,
  winnerBid = null,
  winnerContainerSize = [],
}: AdunitPanelProps) => {
  const { isInspecting, setIsInspecting } = useCookie(({ state, actions }) => ({
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
  }));

  const { setSelectedAdUnit } = useProtectedAudience(({ actions }) => ({
    setSelectedAdUnit: actions.setSelectedAdUnit,
  }));

  const { setStorage, setActiveTab } = useTabs(({ actions }) => ({
    setStorage: actions.setStorage,
    setActiveTab: actions.setActiveTab,
  }));

  return (
    <Panel
      adunit={adunit}
      mediaContainerSize={mediaContainerSize}
      bidders={bidders}
      biddersCount={biddersCount}
      bidsCount={bidsCount}
      noBidsCount={noBidsCount}
      isInspecting={isInspecting}
      setIsInspecting={setIsInspecting}
      setSelectedAdUnit={setSelectedAdUnit}
      setStorage={setStorage}
      setActiveTab={setActiveTab}
      winnerBid={winnerBid}
      winnerContainerSize={winnerContainerSize}
    />
  );
};

export default AdunitPanel;
