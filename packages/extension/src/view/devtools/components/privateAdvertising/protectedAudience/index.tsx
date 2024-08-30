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
import React, { useMemo, useState } from 'react';
import {
  InfoCard as InfoCardTemplate,
  PSInfoKey,
  QuickLinksList,
  Tabs,
  type PSInfoKeyType,
  type TabItems,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import classNames from 'classnames';
import InterestGroups from './interestGroups';
import AdUnits from './adUnits';
import Auctions from './auctions';
import Bids from './bids';

const InfoCard = ({ infoKey }: { infoKey: PSInfoKeyType }) => {
  return (
    <>
      <InfoCardTemplate infoKey={infoKey} />
      <div className="mt-8 border-t border-gray-300 dark:border-quartz">
        <QuickLinksList />
      </div>
    </>
  );
};

const ProtectedAudience = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Overview',
        content: {
          Element: InfoCard,
          props: {
            infoKey: PSInfoKey.ProtectedAudience,
          },
          className: 'p-4',
        },
      },
      {
        title: 'Interest Groups',
        content: {
          Element: InterestGroups,
          className: 'pt-4 overflow-hidden',
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

  const ActiveTabContent = tabItems[activeTab].content.Element;

  return (
    <div
      data-testid="protected-audience-content"
      className="h-screen w-full flex flex-col"
    >
      <div className="p-4">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('protectedAudience')}</h1>
        </div>
      </div>
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div
        className={classNames(tabItems[activeTab].content.className, 'flex-1')}
      >
        {ActiveTabContent && (
          <ActiveTabContent {...tabItems[activeTab].content.props} />
        )}
      </div>
    </div>
  );
};

export default ProtectedAudience;
