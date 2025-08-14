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
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  FrameIcon,
  MoneyIcon,
  PillToggle,
  ScreenIcon,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
} from '@google-psat/design-system';
import type { ReceivedBids } from '@google-psat/common';
/**
 * Internal dependencies
 */
import Tile from './tile';
import Matrix from './matrix';
import { useSettings } from '../../../../../../stateProviders';

interface PanelProps {
  adunit: string;
  mediaContainerSize?: number[][];
  bidders?: string[];
  biddersCount: number;
  bidsCount: number;
  noBidsCount: number;
  isInspecting?: boolean;
  setIsInspecting?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAdUnit?: React.Dispatch<React.SetStateAction<string | null>>;
  winnerBid?: string | null;
  winningMediaContainer?: number[];
  pillToggle: string | null;
  setPillToggle: React.Dispatch<React.SetStateAction<string | null>>;
  highlightOption?: string;
  setHighlightOption?: React.Dispatch<React.SetStateAction<string>>;
  receivedBids?: ReceivedBids[];
  isEE?: boolean;
}

const Panel = ({
  adunit,
  mediaContainerSize,
  bidders,
  biddersCount,
  bidsCount,
  noBidsCount,
  isInspecting,
  setIsInspecting,
  receivedBids,
  setSelectedAdUnit,
  winnerBid = null,
  winningMediaContainer = [],
  pillToggle,
  setPillToggle,
  highlightOption,
  setHighlightOption,
  isEE = false,
}: PanelProps) => {
  const items = useMemo(
    () => [
      {
        name: 'Ad Unit Code',
        Icon: FrameIcon,
        pills: [
          {
            name: adunit,
            onClick: () => {
              if (isInspecting) {
                setIsInspecting?.(false);
                setSelectedAdUnit?.(null);
              } else {
                setIsInspecting?.(true);
                setSelectedAdUnit?.(adunit);
              }
            },
          },
        ],
      },
      {
        name: 'Ad Container Sizes',
        Icon: ScreenIcon,
        pills: [
          ...(mediaContainerSize || [])
            .filter(
              (size) =>
                size?.length === 2 &&
                typeof size[0] === 'number' &&
                typeof size[1] === 'number'
            )
            .map((size) => {
              return {
                name: `${size?.[0]}x${size?.[1]}`,
                className:
                  winningMediaContainer?.[0] === size?.[0] &&
                  winningMediaContainer?.[1] === size?.[1]
                    ? '!border-[#5AAD6A] !text-[#5AAD6A] !bg-[#F5F5F5]'
                    : '',
              };
            }),
        ],
      },
      {
        name: 'Bidders',
        Icon: MoneyIcon,
        pills: [
          ...(bidders || []).map((bidder) => {
            const receivedBidsClassname = receivedBids?.find(
              (bid) => bid.ownerOrigin === bidder && adunit === bid.adUnitCode
            )
              ? '!border-[#438ED9] !text-[#438ED9] !bg-[#F5F5F5]'
              : '';
            const winningBidClassname =
              winnerBid === bidder
                ? '!border-[#5AAD6A] !text-[#5AAD6A] !bg-[#F5F5F5]'
                : '';
            return {
              name: bidder,
              className: winningBidClassname ?? receivedBidsClassname,
            };
          }),
        ],
      },
    ],
    [
      adunit,
      mediaContainerSize,
      bidders,
      isInspecting,
      setIsInspecting,
      setSelectedAdUnit,
      winningMediaContainer,
      receivedBids,
      winnerBid,
    ]
  );

  useEffect(() => {
    return () => {
      setIsInspecting?.(false);
      setSelectedAdUnit?.(null);
    };
  }, [setIsInspecting, setSelectedAdUnit, adunit]);

  const { updateSelectedItemKey } = useSidebar(({ actions }) => ({
    updateSelectedItemKey: actions.updateSelectedItemKey,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const cdpNavigation = useCallback(() => {
    document.getElementById('cookies-landing-scroll-container')?.scrollTo(0, 0);
    updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
  }, [updateSelectedItemKey]);

  return (
    <div className="flex flex-col h-full w-full ">
      {!isEE && (
        <div className="p-4">
          <PillToggle
            options={['Prebid', 'PAAPI']}
            pillToggle={pillToggle}
            setPillToggle={setPillToggle}
            eeAnimatedTab={false}
            highlightOption={highlightOption}
            setHighlightOption={setHighlightOption}
            persistenceKey="auctionAdUnitPillToggle"
          />
        </div>
      )}
      {(pillToggle || isEE) && (
        <>
          {biddersCount === 0 ? (
            !isUsingCDP && pillToggle === 'PAAPI' ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-raisin-black dark:text-bright-gray">
                  To view ad unit data, enable PSAT to use CDP via the{' '}
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
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-raisin-black dark:text-bright-gray">
                  No data available for this ad unit.
                </p>
              </div>
            )
          ) : (
            <>
              <Matrix
                biddersCount={biddersCount}
                bidsCount={bidsCount}
                noBidsCount={noBidsCount}
              />
              <div className="p-4 flex gap-4 flex-wrap">
                {items.map((item) => (
                  <Tile key={item.name} item={item} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Panel;
