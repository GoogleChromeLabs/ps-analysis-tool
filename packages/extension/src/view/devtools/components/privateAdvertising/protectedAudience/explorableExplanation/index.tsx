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
import { TabsProvider, type TabItems } from '@google-psat/design-system';
import type { InterestGroups } from '@google-psat/common';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { app, config } from '@google-psat/explorable-explanations';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import IGTable from '../interestGroups/table';
import Auctions from './auctions';
import { SYNTHETIC_INTEREST_GROUPS } from './constants';
import {
  configuredAuctionEvents,
  type CurrentSiteData,
  type AdUnitLiteral,
} from './auctionEventTransformers';
import InfoPanel from './infoPanel';
import BidsPanel from '../bids/panel';

const ExplorableExplanation = () => {
  const [currentSiteData, setCurrentSiteData] =
    useState<CurrentSiteData | null>(null);

  const [isMultiSeller, setIsMultiSeller] = useState(false);

  const [interestGroupsData, setInterestGroupsData] = useState<
    InterestGroups[]
  >([]);
  const [sitesVisited, setSitesVisited] = useState<string[]>([]);

  const [interactiveMode, _setInteractiveMode] = useState(false);

  const setInteractiveMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSitesVisited([]);
      _setInteractiveMode(event.target.checked);
      app.toggleInteractiveMode();
    },
    []
  );

  useEffect(() => {
    if (interactiveMode !== app.isInteractiveMode) {
      app.toggleInteractiveMode();
      setSitesVisited([]);
    }
  }, [interactiveMode]);

  useEffect(() => {
    return () => {
      app.isInteractiveMode = false;
      app.isMultiSeller = false;
      app.isAutoExpand = true;
    };
  }, []);

  const _setCurrentSiteData = (siteData: typeof currentSiteData) => {
    setCurrentSiteData(() => siteData);
    setInterestGroupsData(() => getInterestGroupData(siteData));
  };

  const getInterestGroupData = useCallback(
    (siteData: typeof currentSiteData) => {
      if (!siteData) {
        return [];
      }

      if (app.isInteractiveMode) {
        const _sitesVisited: string[] = [];
        const requiredIG: InterestGroups[] = [];

        app.visitedIndexOrder.forEach((index: number) => {
          const website = config.timeline.circles[index].website;
          _sitesVisited.push(website);
          requiredIG.push(...SYNTHETIC_INTEREST_GROUPS[website]);
        });

        setSitesVisited(() => _sitesVisited);
        return requiredIG;
      }

      let hasReached = -1;
      const requiredIG = Object.keys(SYNTHETIC_INTEREST_GROUPS)
        .map((site, index) => {
          if (hasReached !== -1) {
            return null;
          }

          if (site === siteData?.website) {
            hasReached = index;
          }

          return SYNTHETIC_INTEREST_GROUPS[site];
        })
        .filter((_data) => _data !== null)
        .flat();

      setSitesVisited(() =>
        Object.keys(SYNTHETIC_INTEREST_GROUPS).slice(0, hasReached + 1)
      );

      return requiredIG;
    },
    []
  );

  const auctionsData = useMemo(() => {
    if (!currentSiteData || currentSiteData?.type === 'advertiser') {
      return {};
    }

    //@ts-ignore since SYNTHETIC_INTEREST_GROUPS is a constant and type is not defined.
    const advertiserSet = sitesVisited.filter(
      (site) => Object.keys(SYNTHETIC_INTEREST_GROUPS[site]).length > 0
    );

    const interestGroups = advertiserSet.map((advertiser) => {
      return SYNTHETIC_INTEREST_GROUPS[advertiser].map((interestGroup) => {
        return {
          interestGroupName: interestGroup.name as string,
          ownerOrigin: interestGroup.ownerOrigin as string,
        };
      });
    });

    const { auctionData, receivedBids, adsAndBidders } =
      configuredAuctionEvents(
        interestGroups.flat(),
        Array.from(advertiserSet),
        isMultiSeller,
        currentSiteData
      );

    return {
      auctionData,
      receivedBids,
      adsAndBidders,
    };
  }, [currentSiteData, sitesVisited, isMultiSeller]);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: IGTable,
          props: {
            interestGroupDetails: [...(interestGroupsData as InterestGroups[])],
          },
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
          props: {
            auctionEvents: {
              ...auctionsData,
            },
            customAdsAndBidders: auctionsData.adsAndBidders,
          },
        },
      },
      {
        title: 'Bids',
        content: {
          Element: BidsPanel,
          props: {
            receivedBids: Object.keys(auctionsData.receivedBids ?? {})
              .map(
                (key: string) =>
                  auctionsData?.receivedBids?.[key as AdUnitLiteral] ?? []
              )
              .flat(),
            noBids: {},
            eeAnimatedTab: true,
          },
        },
      },
      {
        title: 'Info',
        content: {
          Element: InfoPanel,
          props: {
            data: undefined,
          },
        },
      },
    ],
    [auctionsData, interestGroupsData]
  );

  return (
    <TabsProvider items={tabItems}>
      <Panel
        currentSiteData={currentSiteData}
        setCurrentSite={_setCurrentSiteData}
        setInteractiveMode={setInteractiveMode}
        interactiveMode={interactiveMode}
        isMultiSeller={isMultiSeller}
        setIsMultiSeller={setIsMultiSeller}
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
