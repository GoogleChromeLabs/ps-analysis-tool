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
  TabsProvider,
  type TabItems,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import ExplorableExplanation from './explorableExplanation';
import TaxonomyTree from './taxonomyTree';
import Panel from './panel';
import TopicsClassifier from './topicsClassifier';

const Topics = () => {
  const tabItems = useMemo<TabItems>(
    () => ({
      Learning: [
        {
          title: 'Overview',
          content: {
            Element: InfoCard,
            props: {
              infoKey: PSInfoKey.Topics,
              showQuickLinks: true,
              isLandingPageContainer: true,
            },
            className: 'p-4',
          },
        },
        {
          title: 'Explorable Explanation',
          content: {
            Element: ExplorableExplanation,
            className: 'overflow-hidden',
            containerClassName: 'overflow-hidden',
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
        {
          title: 'Classifier',
          content: {
            Element: TopicsClassifier,
            className: 'overflow-hidden',
          },
        },
      ],
    }),
    []
  );

  return (
    <TabsProvider items={tabItems} name="topics">
      <Panel />
    </TabsProvider>
  );
};

export default Topics;
