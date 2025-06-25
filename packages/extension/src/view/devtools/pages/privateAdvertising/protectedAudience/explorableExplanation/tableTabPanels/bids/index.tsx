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
import React, { useState } from 'react';
import { PillToggle } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Panel from '../../../bids/panel';
import type { NoBidsType, ReceivedBids } from '@google-psat/common';

enum BidsPillOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
}

interface BidsPanelProps {
  receivedBids: ReceivedBids[];
  noBids: NoBidsType[keyof NoBidsType][];
}

const BidsPanel = ({ receivedBids, noBids }: BidsPanelProps) => {
  const [bidsPillToggle, setBidsPillToggle] = useState<string>(
    BidsPillOptions.ReceivedBids
  );

  return (
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="flex justify-between items-center">
        <div className="px-4 pb-4 flex gap-4 items-center">
          <PillToggle
            options={[BidsPillOptions.ReceivedBids, BidsPillOptions.NoBids]}
            pillToggle={bidsPillToggle}
            setPillToggle={setBidsPillToggle}
            eeAnimatedTab={false}
          />
        </div>
      </div>
      <Panel
        receivedBids={receivedBids}
        noBids={noBids}
        bidsPillToggle={bidsPillToggle}
        panelPillToggle="PAAPI"
        eeAnimatedTab
      />
    </div>
  );
};

export default BidsPanel;
