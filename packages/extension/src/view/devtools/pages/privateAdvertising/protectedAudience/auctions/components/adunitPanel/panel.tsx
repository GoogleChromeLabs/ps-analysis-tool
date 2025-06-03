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
import React, { useEffect, useMemo } from 'react';
import { FrameIcon, MoneyIcon, ScreenIcon } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import Tile from './tile';
import Matrix from './matrix';

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
  setStorage?: (data: string, index?: number) => void;
  setActiveTab?: (tab: number) => void;
  winnerBid?: string | null;
  winningMediaContainer?: number[];
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
  setSelectedAdUnit,
  setStorage,
  setActiveTab,
  winnerBid = null,
  winningMediaContainer = [],
}: PanelProps) => {
  const items = useMemo(
    () => [
      {
        name: 'Ad Unit Code',
        Icon: FrameIcon,
        buttons: [
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
        buttons: [
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
        buttons: [
          ...(bidders || []).map((bidder) => ({
            name: bidder,
            onClick: () => {
              setStorage?.(
                JSON.stringify({
                  bidder,
                  adUnitCode: adunit,
                })
              );
              setActiveTab?.(5);
            },
            className:
              winnerBid === bidder
                ? '!border-[#5AAD6A] !text-[#5AAD6A] !bg-[#F5F5F5]'
                : '',
          })),
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
      winnerBid,
      setStorage,
      setActiveTab,
    ]
  );

  useEffect(() => {
    return () => {
      setIsInspecting?.(false);
      setSelectedAdUnit?.(null);
    };
  }, [setIsInspecting, setSelectedAdUnit, adunit]);

  return (
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
  );
};

export default Panel;
