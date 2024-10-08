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
  Breadcrumbs,
  InfoCard,
  PSInfoKey,
  QuickLinksList,
  Tabs,
  useSidebar,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import RWSJsonGenerator from './jsonGenerator';
import Insights from './insights';

const RelatedWebsiteSets = () => {
  const { extractSelectedItemKeyTitles } = useSidebar(({ actions }) => ({
    extractSelectedItemKeyTitles: actions.extractSelectedItemKeyTitles,
  }));

  const tabItems = useMemo(
    () => [
      {
        title: 'Overview',
        content: {
          Element: InfoCard,
          props: {
            infoKey: PSInfoKey.RelatedWebsiteSets,
          },
        },
      },
      {
        title: 'Membership',
        content: {
          Element: Insights,
        },
      },
      {
        title: 'JSON Generator',
        content: {
          Element: RWSJsonGenerator,
        },
      },
    ],
    []
  );

  return (
    <div data-testid="related-website-sets-content" className="h-full w-full">
      <div className="p-4 flex flex-col gap-1 mb-2">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('rws')}</h1>
        </div>
        <Breadcrumbs items={extractSelectedItemKeyTitles()} />
      </div>
      <Tabs items={tabItems} />
      <div className="mt-8 border-t border-gray-300 dark:border-quartz">
        <QuickLinksList />
      </div>
    </div>
  );
};

export default RelatedWebsiteSets;
