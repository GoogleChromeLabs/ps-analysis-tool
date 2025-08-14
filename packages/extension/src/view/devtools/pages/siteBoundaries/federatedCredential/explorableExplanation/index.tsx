/*
 * Copyright 2025 Google LLC
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
import { useMemo } from 'react';
import { TabsProvider, type TabItems } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Panel from './panel';
import Legend from './legend';

const ExplorableExplanation = () => {
  const tabItems = useMemo<TabItems[keyof TabItems]>(
    () => [
      {
        title: 'Legend',
        content: {
          Element: Legend,
        },
      },
    ],
    []
  );

  return (
    <TabsProvider
      items={tabItems}
      name="fedcm-explorable-explanation"
      isGroup={false}
    >
      <Panel />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
