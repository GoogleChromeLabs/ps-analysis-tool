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
import {
  JsonView,
  PillToggle,
  Timeline,
  BidderType,
  type Bidder,
} from '@google-psat/design-system';
import React, { useMemo, useState } from 'react';
import { I18n } from '@google-psat/i18n';
import { Resizable } from 're-resizable';
import type { NoBidsType, ReceivedBids } from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import ReceivedBidsTable from './receivedBidsTable';
import NoBidsTable from './noBidsTable';
import { useProtectedAudience } from '../../../../stateProviders';

enum PillToggleOptions {
  ReceivedBids = 'Received Bids',
  NoBids = 'No Bids',
  TimelineName = 'Timeline',
}

const preBidData = {
  name: 'books',
  index: 10,
  ownerOrigin: 'https://privacysandboxdemos-buyer-1.domain-aaa.com',
  uniqueAuctionId: 'A17572BD290E03586F266F2C95675C07',
  formattedTime: '77.95ms',
  type: 'bid',
  time: 1748410268.854791,
  eventType: 'interestGroupAccessed',
  bid: 14,
  bidCurrency: 'USD',
  mediaContainerSize: [],
  adUnitCode: 'ad-container',
  adType: 'image',
};

const bidders: Bidder[] = [
  {
    name: 'Pubmattic',
    duration: '270.1',
    type: BidderType.BID,
    data: {
      ...preBidData,
      name: 'sports',
      index: 1,
      bid: 12,
      formattedTime: '70.23ms',
      time: 1748410210.123,
      ownerOrigin: 'https://pubmattic.bidder.com',
    },
  },
  {
    name: 'Sharethrough',
    duration: '210.4',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'news',
      index: 2,
      bid: 0,
      formattedTime: '80.11ms',
      time: 1748410220.456,
      ownerOrigin: 'https://sharethrough.bidder.com',
    },
  },
  {
    name: 'appnexus',
    duration: '240.0',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'tech',
      index: 3,
      bid: 0,
      formattedTime: '85.76ms',
      time: 1748410230.789,
      ownerOrigin: 'https://appnexus.bidder.com',
    },
  },
  {
    name: 'ix',
    duration: '380.1',
    type: BidderType.NO_BID,
    data: {
      ...preBidData,
      name: 'gaming',
      index: 4,
      bid: 0,
      formattedTime: '90.50ms',
      time: 1748410241.321,
      ownerOrigin: 'https://ix.bidder.com',
    },
  },
  {
    name: 'Rubicon',
    duration: '125.51',
    type: BidderType.WON,
    data: {
      ...preBidData,
      name: 'travel',
      index: 5,
      bid: 18,
      formattedTime: '65.33ms',
      time: 1748410252.654,
      ownerOrigin: 'https://rubicon.bidder.com',
    },
  },
  {
    name: 'Criteo',
    duration: '470.05',
    type: BidderType.TIMED_OUT,
    data: {
      ...preBidData,
      name: 'fashion',
      index: 6,
      bid: 0,
      formattedTime: '100.22ms',
      time: 1748410263.987,
      ownerOrigin: 'https://criteo.bidder.com',
    },
  },
];

interface PanelProps {
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  eeAnimatedTab?: boolean;
}

const Panel = ({ storage, setStorage, eeAnimatedTab = false }: PanelProps) => {
  const { receivedBids, noBids } = useProtectedAudience(({ state }) => ({
    receivedBids: state.receivedBids,
    noBids: state.noBids,
  }));
  const [selectedRow, setSelectedRow] = useState<
    ReceivedBids | NoBidsType[keyof NoBidsType] | null
  >(null);
  const [pillToggle, setPillToggle] = useState<string>(
    PillToggleOptions.ReceivedBids
  );

  const showBottomTray = useMemo(() => {
    if (pillToggle === PillToggleOptions.ReceivedBids) {
      return receivedBids.length > 0;
    } else if (pillToggle === PillToggleOptions.NoBids) {
      return Object.keys(noBids).length > 0;
    } else {
      return true; // Always show for Timeline
    }
  }, [noBids, pillToggle, receivedBids.length]);

  let activePage = null;

  if (pillToggle === PillToggleOptions.ReceivedBids) {
    activePage = (
      <div className="w-full h-full border-t border-american-silver dark:border-quartz overflow-auto">
        <ReceivedBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
          receivedBids={receivedBids}
          storage={storage}
          setStorage={setStorage}
          showEvaluationPlaceholder={!eeAnimatedTab}
        />
      </div>
    );
  } else if (pillToggle === PillToggleOptions.NoBids) {
    activePage = (
      <div
        className={classNames(
          'h-full border-r border-t border-american-silver dark:border-quartz',
          Object.keys(noBids).length > 0 ? 'w-[42rem]' : 'w-full'
        )}
      >
        <NoBidsTable
          setSelectedRow={setSelectedRow}
          selectedRow={selectedRow}
          noBids={noBids}
          showEvaluationPlaceholder={!eeAnimatedTab}
        />
      </div>
    );
  } else if (pillToggle === PillToggleOptions.TimelineName) {
    activePage = (
      <div className="w-full px-5 pb-10">
        <Timeline
          auctionTimeout={420}
          auctionId="23949b7f-b733-4a58-b3b0-e72deed12e61"
          auctionStartTime="12:18:27"
          auctionTime="380.1"
          bidders={bidders}
          zoomLevel={2}
          setSelectedRow={setSelectedRow}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-4 h-full w-full">
      <div className="px-4 pb-4">
        <PillToggle
          options={[
            PillToggleOptions.ReceivedBids,
            PillToggleOptions.NoBids,
            PillToggleOptions.TimelineName,
          ]}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={eeAnimatedTab}
        />
      </div>
      <div className="flex-1 overflow-auto text-outer-space-crayola">
        {activePage}
      </div>
      {showBottomTray && (
        <Resizable
          defaultSize={{
            width: '100%',
            height: '20%',
          }}
          minHeight="10%"
          maxHeight="90%"
          enable={{
            top: true,
          }}
        >
          <div className="text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
            {selectedRow ? (
              <div className="text-xs py-1 px-1.5">
                <JsonView src={selectedRow} />
              </div>
            ) : (
              <div className="h-full p-8 flex items-center">
                <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
                  {I18n.getMessage('selectRowToPreview')}
                </p>
              </div>
            )}
          </div>
        </Resizable>
      )}
    </div>
  );
};

export default Panel;
