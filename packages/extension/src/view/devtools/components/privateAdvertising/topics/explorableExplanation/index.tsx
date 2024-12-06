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
import React, { useCallback, useMemo, useState } from 'react';
import {
  TabsProvider,
  useTabs,
  type TabItems,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import TopicsTable, { type TopicsTableType } from './topicsTable';
import Panel from './panel';

const ExplorableExplanation = () => {
  const [topicsTableData, setTopicsTableData] = useState<
    Record<number, TopicsTableType[]>
  >({});
  const [highlightAdTech, setHighlightAdTech] = useState<string | null>(null);
  // These are the actions that are being used in the PA panel tabs provider not the animation component.
  const { PAstorage, setPAActiveTab, setPAStorage } = useTabs(
    ({ state, actions }) => ({
      PAstorage: state.storage,
      setPAActiveTab: actions.setActiveTab,
      setPAStorage: actions.setStorage,
    })
  );

  const topicsNavigator = useCallback(
    (topic: string) => {
      setPAStorage(
        JSON.stringify({
          taxonomy: topic,
        })
      );
      setPAActiveTab(2);
    },
    [setPAActiveTab, setPAStorage]
  );

  const tabItems = useMemo<TabItems>(
    () =>
      ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'].map((item) => ({
        title: item,
        content: {
          Element: TopicsTable,
          props: {
            data: topicsTableData,
            highlightAdTech,
            setHighlightAdTech,
            topicsNavigator,
          },
        },
      })),
    [highlightAdTech, topicsNavigator, topicsTableData]
  );

  return (
    <TabsProvider items={tabItems}>
      <Panel
        topicsTableData={topicsTableData}
        setTopicsTableData={setTopicsTableData}
        PAstorage={PAstorage}
        setPAActiveTab={setPAActiveTab}
        setPAStorage={setPAStorage}
        setHighlightAdTech={setHighlightAdTech}
      />
    </TabsProvider>
  );
};

export default ExplorableExplanation;
