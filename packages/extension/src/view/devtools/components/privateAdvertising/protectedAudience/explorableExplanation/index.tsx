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
import React, { useEffect, useMemo, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import IGTable from '../interestGroups/table';
import Auctions from './auctions';
import { SYNTHETIC_INTEREST_GROUPS } from './constants';
import type { InterestGroups } from '@google-psat/common';
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

  const [sitesVisited, setSitesVisited] = useState<string[]>([]);

  const interestGroupsRef = useRef<InterestGroups[]>([]);

  useEffect(() => {
    if (!currentSiteData) {
      interestGroupsRef.current = [];
    }
  }, [currentSiteData]);

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

    const { auctionData, receivedBids, winningBids } = configuredAuctionEvents(
      interestGroups.flat(),
      Array.from(advertiserSet),
      true,
      currentSiteData
    );

    return {
      auctionData,
      receivedBids,
      winningBids,
    };
  }, [currentSiteData, sitesVisited]);

  const interestGroupData = useMemo(() => {
    if (!currentSiteData || currentSiteData?.type === 'publisher') {
      return interestGroupsRef.current;
    }

    interestGroupsRef.current.push(
      ...SYNTHETIC_INTEREST_GROUPS[currentSiteData?.website]
    );

    setSitesVisited((prevState) => {
      const set = new Set<string>();
      prevState.forEach((site) => set.add(site));
      set.add(currentSiteData?.website);
      return Array.from(set);
    });

    return interestGroupsRef.current;
  }, [currentSiteData]);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: IGTable,
          props: {
            interestGroupDetails: [...(interestGroupData as InterestGroups[])],
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
            customAdsAndBidders: auctionsData.winningBids,
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
    [auctionsData, interestGroupData]
  );

  return (
    <TabsProvider items={tabItems}>
      <Panel
        currentSiteData={currentSiteData}
        setCurrentSite={setCurrentSiteData}
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
