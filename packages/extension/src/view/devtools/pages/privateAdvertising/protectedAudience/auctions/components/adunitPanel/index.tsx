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
import React, { useState } from 'react';
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
  mediaContainerSize: Record<string, number[][]>;
  bidders: Record<string, string[]>;
  biddersCount: Record<string, number>;
  bidsCount: Record<string, number>;
  noBidsCount: Record<string, number>;
  winnerBid: Record<string, string | null> | null;
  winningMediaContainer?: Record<string, number[]>;
}

const AdunitPanel = ({
  adunit,
  mediaContainerSize,
  bidders,
  biddersCount,
  bidsCount,
  noBidsCount,
  winnerBid = null,
  winningMediaContainer = {},
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

  const [pillToggle, setPillToggle] = useState('Prebid');

  const pillLowerCase = pillToggle.toLowerCase();

  return (
    <Panel
      adunit={adunit}
      mediaContainerSize={mediaContainerSize[pillLowerCase]}
      bidders={bidders[pillLowerCase]}
      biddersCount={biddersCount[pillLowerCase]}
      bidsCount={bidsCount[pillLowerCase]}
      noBidsCount={noBidsCount[pillLowerCase]}
      isInspecting={isInspecting}
      setIsInspecting={setIsInspecting}
      setSelectedAdUnit={setSelectedAdUnit}
      setStorage={setStorage}
      setActiveTab={setActiveTab}
      winnerBid={winnerBid?.[pillLowerCase] || null}
      winningMediaContainer={winningMediaContainer[pillLowerCase] || []}
      pillToggle={pillToggle}
      setPillToggle={setPillToggle}
    />
  );
};

export default AdunitPanel;
