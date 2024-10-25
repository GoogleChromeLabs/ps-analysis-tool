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
import { Tabs, type TabItems } from '@google-psat/design-system';
import React, { useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import TopicsTable from './topicsTable';

const TableTray = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = useMemo<TabItems>(() => {
    return [
      {
        title: 'Epoch 1',
        content: {
          Element: TopicsTable,
          props: {},
          className: '',
        },
      },
      {
        title: 'Epoch 2',
        content: {
          Element: TopicsTable,
          props: {},
          className: '',
        },
      },
      {
        title: 'Epoch 3',
        content: {
          Element: TopicsTable,
          props: {},
          className: '',
        },
      },
      {
        title: 'Epoch 4',
        content: {
          Element: TopicsTable,
          props: {},
          className: '',
        },
      },
    ];
  }, []);

  const ActiveTabContent = tabs[activeTab].content.Element;

  return (
    <div className="w-full">
      <div className="bg-sky-100 h-fit pt-2">
        <Tabs
          items={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          showBottomBorder={false}
        />
      </div>
      <ActiveTabContent />
    </div>
  );
};

export default TableTray;
