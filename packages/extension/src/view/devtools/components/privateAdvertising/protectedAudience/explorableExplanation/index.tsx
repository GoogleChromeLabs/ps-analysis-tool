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
import React, { useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import IGTable from '../interestGroups/table';
import Auctions from './auctions';
import { SYNTHETIC_INTEREST_GROUPS } from './constants';
import type { InterestGroups } from '@google-psat/common';

const ExplorableExplanation = () => {
  const [currentSiteData, setCurrentSiteData] = useState<object | null>(null);

  const interestGroupData = useMemo(() => {
    if (!currentSiteData) {
      return [];
    }

    const perSiteInterestGroups: InterestGroups[] =
      //@ts-ignore
      SYNTHETIC_INTEREST_GROUPS[currentSiteData?.website];

    return perSiteInterestGroups;
  }, [currentSiteData]);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: IGTable,
          props: {
            interestGroupDetails: [...interestGroupData],
          },
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
          props: {
            auctionEvents: {},
          },
        },
      },
    ],
    [interestGroupData]
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
