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
import TopicsTable, { type TopicsTableType } from './topicsTable';

interface TrayProps {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
  topicsTableData: TopicsTableType[];
}

const Tray = ({ activeTab, setActiveTab, topicsTableData }: TrayProps) => {
  const tabItems = useMemo<TabItems>(
    () =>
      ['Epoch 1', 'Epoch 2', 'Epoch 3', 'Epoch 4'].map((item) => ({
        title: item,
        content: {
          Element: TopicsTable,
          props: {
            data: topicsTableData,
          },
        },
      })),
    [topicsTableData]
  );

  return (
    <TableTray
      tabItems={tabItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    />
  );
};

export default Tray;
