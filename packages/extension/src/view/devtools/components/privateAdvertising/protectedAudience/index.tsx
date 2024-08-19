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
  InfoCard,
  PSInfoKey,
  QuickLinksList,
  Tabs,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import InterestGroups from './interestGroups';
import AdUnits from './adUnits';
import Auctions from './auctions';
import Bids from './bids';

const ProtectedAudience = () => {
  const tabItems = useMemo(
    () => [
      {
        title: 'Overview',
        content: {
          Element: InfoCard,
          props: {
            infoKey: PSInfoKey.ProtectedAudience,
          },
        },
      },
      {
        title: 'Interest Groups',
        content: {
          Element: InterestGroups,
        },
      },
      {
        title: 'Ad Units',
        content: {
          Element: AdUnits,
        },
      },
      {
        title: 'Auctions',
        content: {
          Element: Auctions,
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

  return (
    <div data-testid="protected-audience-content" className="h-full w-full">
      <div className="p-4">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('protectedAudience')}</h1>
        </div>
      </div>
      <Tabs items={tabItems} />
      <div className="mt-8 border-t border-gray-300 dark:border-quartz">
        <QuickLinksList />
      </div>
    </div>
  );
};

export default ProtectedAudience;
