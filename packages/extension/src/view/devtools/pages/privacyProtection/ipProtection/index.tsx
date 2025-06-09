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
  PSInfoKey,
  TabsProvider,
  type TabItems,
} from '@google-psat/design-system';
import Panel from './panel';
import Overview from './overview';
import MDLTable from './mdlTable';

const IPProtection = () => {
  const tabItems = useMemo<TabItems>(
    () => ({
      Learning: [
        {
          title: 'Overview',
          content: {
            Element: Overview,
            props: {
              infoKey: PSInfoKey.IPProtection,
            },
            className: 'p-4',
          },
        },
        {
          title: 'Masked Domain List',
          content: {
            Element: MDLTable,
            props: {},
            className: 'overflow-hidden',
          },
        },
      ],
    }),
    []
  );

  return (
    <TabsProvider items={tabItems} name="ipProtection">
      <Panel />
    </TabsProvider>
  );
};

export default IPProtection;
