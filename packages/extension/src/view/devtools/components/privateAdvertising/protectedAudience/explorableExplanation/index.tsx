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
import React, { useCallback, useMemo, useState } from 'react';
import type { InterestGroups } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import IGTable from '../interestGroups/table';
import Auctions from './auctions';
import { SYNTHETIC_INTEREST_GROUPS } from './constants';
import { createAuctionEvents } from './auctionEventTransformers';
import InfoPanel from './infoPanel';
import BidsPanel from '../bids/panel';

export interface CurrentSiteData {
  type: 'advertiser' | 'publisher';
  website: string;
  datetime: string;
  igGroupsCount: number;
  interestGroups: string[];
  visited: boolean;
  visitedIndex: boolean;
}
export type AdUnitLiteral = 'div-200-1' | 'div-200-2' | 'div-200-3';

const ExplorableExplanation = () => {
  const [currentSiteData, setCurrentSiteData] =
    useState<CurrentSiteData | null>(null);
  const [interestGroupsData, setInterestGroupsData] = useState<
    InterestGroups[]
  >([]);

  const _setCurrentSiteData = (siteData: typeof currentSiteData) => {
    setCurrentSiteData(() => siteData);
    setInterestGroupsData((prev) => getInterestGroupData([...prev], siteData));
  };

  const [sitesVisited, setSitesVisited] = useState<string[]>([]);

  const getInterestGroupData = useCallback(
    (data: InterestGroups[], siteData: typeof currentSiteData) => {
      if (!siteData) {
        return [];
      }

      if (siteData?.type === 'publisher') {
        return data;
      }

      data.push(...SYNTHETIC_INTEREST_GROUPS[siteData?.website]);

      setSitesVisited((prevState) => {
        const set = new Set<string>();
        prevState.forEach((site) => set.add(site));
        set.add(siteData?.website);
        return Array.from(set);
      });

      return data;
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

    const dateTimeString = new Date(currentSiteData?.datetime).toUTCString();
    const websiteString = `https://www.${currentSiteData?.website}`;

    const auctionData = {
      'div-200-1': {
        [dateTimeString]: {
          [websiteString]: {
            [websiteString]: createAuctionEvents(
              interestGroups.flat(),
              currentSiteData?.website,
              Array.from(advertiserSet),
              new Date(currentSiteData?.datetime).getTime()
            ),
          },
        },
      },
      'div-200-2': {
        [dateTimeString]: {
          [websiteString]: {
            [websiteString]: createAuctionEvents(
              interestGroups.flat(),
              currentSiteData?.website,
              Array.from(advertiserSet),
              new Date(currentSiteData?.datetime).getTime()
            ),
          },
        },
      },
      'div-200-3': {
        [dateTimeString]: {
          [websiteString]: {
            [websiteString]: createAuctionEvents(
              interestGroups.flat(),
              currentSiteData?.website,
              Array.from(advertiserSet),
              new Date(currentSiteData?.datetime).getTime()
            ),
          },
        },
      },
    };

    return {
      auctionData,
      receivedBids: {
        'div-200-1':
          auctionData['div-200-1']?.[dateTimeString]?.[websiteString]?.[
            websiteString
          ].filter((event) => event.type === 'bid') ?? [],
        'div-200-2':
          auctionData['div-200-2']?.[dateTimeString]?.[websiteString]?.[
            websiteString
          ].filter((event) => event.type === 'bid') ?? [],
        'div-200-3':
          auctionData['div-200-3']?.[dateTimeString]?.[websiteString]?.[
            websiteString
          ].filter((event) => event.type === 'bid') ?? [],
      },
    };
  }, [currentSiteData, sitesVisited]);

  const customAdsAndBidders = useMemo(() => {
    if (!currentSiteData || currentSiteData?.type === 'advertiser') {
      return {};
    }

    const currentWebsite = `https://www.${currentSiteData?.website}`;

    return {
      'div-200-1': {
        adUnitCode: 'div-200-1',
        bidders: ['DSP 1', 'DSP 2'],
        mediaContainerSize: [[320, 320]],
        winningBid: auctionsData.auctionData?.['div-200-1']?.[
          new Date(currentSiteData?.datetime).toUTCString()
        ]?.[currentWebsite]?.[currentWebsite].filter(
          ({ type }) => type === 'win'
        )?.[0]?.bid,
        bidCurrency: 'USD',
        winningBidder: 'DSP 1',
      },
      'div-200-2': {
        adUnitCode: 'div-200-2',
        bidders: ['DSP 1', 'DSP 2'],
        mediaContainerSize: [[320, 320]],
        winningBid: auctionsData.auctionData?.['div-200-2']?.[
          new Date(currentSiteData?.datetime).toUTCString()
        ]?.[currentWebsite]?.[currentWebsite].filter(
          ({ type }) => type === 'win'
        )?.[0]?.bid,
        bidCurrency: 'USD',
        winningBidder: 'DSP 1',
      },
      'div-200-3': {
        adUnitCode: 'div-200-3',
        bidders: ['DSP 1', 'DSP 2'],
        mediaContainerSize: [[320, 320]],
        winningBid: auctionsData.auctionData?.['div-200-3']?.[
          new Date(currentSiteData?.datetime).toUTCString()
        ]?.[currentWebsite]?.[currentWebsite].filter(
          ({ type }) => type === 'win'
        )?.[0]?.bid,
        bidCurrency: 'USD',
        winningBidder: 'DSP 2',
      },
    };
  }, [auctionsData, currentSiteData]);

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
            customAdsAndBidders: customAdsAndBidders,
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
    [auctionsData, customAdsAndBidders, interestGroupsData]
  );

  return (
    <TabsProvider items={tabItems}>
      <Panel
        currentSiteData={currentSiteData}
        setCurrentSite={_setCurrentSiteData}
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
