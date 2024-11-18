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

/**
 * Internal dependencies.
 */
import ExplorableExplanation from './explorableExplanation';
import TaxonomyTree from './taxonomyTree';

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

const Topics = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabItems = useMemo<TabItems>(
    () => [
      {
        title: 'Overview',
        content: {
          Element: InfoCard,
          props: {
            infoKey: PSInfoKey.Topics,
          },
          className: 'p-4',
        },
      },
      {
        title: 'Explorable Explantion',
        content: {
          Element: ExplorableExplanation,
        },
      },
      {
        title: 'Taxonomy V2',
        content: {
          Element: TaxonomyTree,
          props: {
            taxonomyUrl:
              'https://raw.githubusercontent.com/patcg-individual-drafts/topics/refs/heads/main/taxonomy_v2.md',
            githubUrl:
              'https://github.com/patcg-individual-drafts/topics/blob/main/taxonomy_v2.md',
          },
          className: 'overflow-hidden',
        },
      },
      {
        title: 'Taxonomy V1',
        content: {
          Element: TaxonomyTree,
          props: {
            taxonomyUrl:
              'https://raw.githubusercontent.com/patcg-individual-drafts/topics/refs/heads/main/taxonomy_v1.md',
            githubUrl:
              'https://github.com/patcg-individual-drafts/topics/blob/main/taxonomy_v1.md',
          },
          className: 'overflow-hidden',
        },
      },
    ],
    []
  );

  const ActiveTabContent = tabItems[activeTab].content.Element;

  return (
    <div
      data-testid="topics-content"
      className="h-screen w-full flex flex-col overflow-hidden"
    >
      <div className="p-4">
        <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
          <h1 className="text-left">{I18n.getMessage('topics')}</h1>
        </div>
      </div>
      <Tabs
        items={tabItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <div
        className={classNames(
          'overflow-auto flex-1',
          tabItems[activeTab].content.className
        )}
        style={{
          minHeight: 'calc(100% - 93px)',
        }}
      >
        {ActiveTabContent && (
          <ActiveTabContent {...tabItems[activeTab].content.props} />
        )}
      </div>
    </div>
  );
};

export default Topics;
