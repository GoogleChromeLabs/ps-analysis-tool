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
import {
  FrameIcon,
  MoneyIcon,
  ScreenIcon,
  useTabs,
} from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import Matrix from './matrix';
import Tile from './tile';
import { useCookie, useProtectedAudience } from '../../../../../stateProviders';

interface AdunitPanelProps {
  adunit: string;
}

const AdunitPanel = ({ adunit }: AdunitPanelProps) => {
  const { isInspecting, setIsInspecting } = useCookie(({ state, actions }) => ({
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
  }));

  const { adsAndBidders, setSelectedAdUnit } = useProtectedAudience(
    ({ state, actions }) => ({
      adsAndBidders: state.adsAndBidders,
      setSelectedAdUnit: actions.setSelectedAdUnit,
    })
  );

  const { setStorage, setActiveTab } = useTabs(({ actions }) => ({
    setStorage: actions.setStorage,
    setActiveTab: actions.setActiveTab,
  }));

  const currentAd = adsAndBidders[adunit];

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
                setIsInspecting(false);
                setSelectedAdUnit(null);
              } else {
                setIsInspecting(true);
                setSelectedAdUnit(adunit);
              }
            },
          },
        ],
      },
      {
        name: 'Ad Container Sizes',
        Icon: ScreenIcon,
        buttons: [
          ...(currentAd?.mediaContainerSize || []).map((size) => ({
            name: `${size[0]}x${size[1]}`,
          })),
        ],
      },
      {
        name: 'Bidders',
        Icon: MoneyIcon,
        buttons: [
          ...(currentAd?.bidders || []).map((bidder) => ({
            name: bidder,
            onClick: () => {
              setStorage(
                JSON.stringify({
                  bidder,
                  adUnitCode: adunit,
                })
              );
              setActiveTab(5);
            },
          })),
        ],
      },
    ],
    [
      adunit,
      currentAd?.bidders,
      currentAd?.mediaContainerSize,
      isInspecting,
      setActiveTab,
      setIsInspecting,
      setSelectedAdUnit,
      setStorage,
    ]
  );

  useEffect(() => {
    return () => {
      setIsInspecting(false);
      setSelectedAdUnit(null);
    };
  }, [setIsInspecting, setSelectedAdUnit, adunit]);

  return (
    <>
      <Matrix adUnitCode={adunit} />
      <div className="p-4 flex gap-4 flex-wrap">
        {items.map((item) => (
          <Tile key={item.name} item={item} />
        ))}
      </div>
    </>
  );
};

export default AdunitPanel;
