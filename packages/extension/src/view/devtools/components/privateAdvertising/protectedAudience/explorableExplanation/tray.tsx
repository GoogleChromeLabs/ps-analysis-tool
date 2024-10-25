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
import type { TabItems } from '@google-psat/design-system';
import React, { useMemo } from 'react';

/**
 * Internal dependencies.
 */
import TableTray from '../../../explorableExplanation/tableTray';
import InterestGroups from '../interestGroups';
import Auctions from '../auctions';
import AdUnits from '../adUnits';
import Bids from '../bids';

const Tray = () => {
  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Interest Groups',
        content: {
          Element: InterestGroups,
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
        },
      },
      {
        title: 'Ad Units',
        content: {
          Element: AdUnits,
        },
      },
      {
        title: 'Bids',
        content: {
          Element: Bids,
        },
      },
    ],
    []
  );

  return <TableTray tabItems={tabItems} />;
};

export default Tray;
