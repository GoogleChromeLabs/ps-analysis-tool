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
  type TabItems,
  TabsProvider,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import RWSJsonGenerator from './jsonGenerator';
import Insights from './insights';
import Panel from './panel';

const RelatedWebsiteSets = () => {
  const tabItems = useMemo<TabItems>(
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
    <TabsProvider items={tabItems}>
      <Panel />
    </TabsProvider>
  );
};

export default RelatedWebsiteSets;
