/*
 * Copyright 2023 Google LLC
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
import React, { useMemo } from 'react';
import {
  PSInfoKey,
  TabsProvider,
  type TabItems,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import InterestGroups from './interestGroups';
import Auctions from './auctions';
import Bids from './bids';
import Panel from './panel';
import AdUnits from './adUnits';
import ExplorableExplanation from './explorableExplanation';
import WorkletBreakpoints from './workletBreakpoints';
import Overview from './overview';

const ProtectedAudience = () => {
  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Overview',
        content: {
          Element: Overview,
          props: {
            infoKey: PSInfoKey.ProtectedAudience,
          },
          className: 'p-4',
        },
      },
      {
        title: 'Explorable Explanation',
        content: {
          Element: ExplorableExplanation,
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Interest Groups',
        content: {
          Element: InterestGroups,
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Ad Units',
        content: {
          Element: AdUnits,
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Bids',
        content: {
          Element: Bids,
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Worklet Breakpoints',
        content: {
          Element: WorkletBreakpoints,
        },
      },
    ],
    []
  );

  return (
    <TabsProvider items={tabItems} name="protectedAudience">
      <Panel />
    </TabsProvider>
  );
};

export default ProtectedAudience;
