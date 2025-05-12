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
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import Tabs from '..';
import { TabItems, TabsProvider } from '../useTabs';

const meta: Meta<typeof Tabs> = {
  title: 'DesignSystem/Tabs',
  component: Tabs,
  tags: ['autodocs'],
};

export default meta;

const mockData: TabItems = {
  'Group 1': [
    {
      title: 'Tab 1',
      content: {
        Element: () => <div>Tab 1 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
    {
      title: 'Tab 2',
      content: {
        Element: () => <div>Tab 2 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
  ],
  'Group 2': [
    {
      title: 'Tab 3',
      content: {
        Element: () => <div>Tab 3 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
    {
      title: 'Tab 4',
      content: {
        Element: () => <div>Tab 4 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
    {
      title: 'Tab 5',
      content: {
        Element: () => <div>Tab 5 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
    {
      title: 'Tab 6',
      content: {
        Element: () => <div>Tab 6 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
  ],
  'Group 3': [
    {
      title: 'Tab 7',
      content: {
        Element: () => <div>Tab 7 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
    {
      title: 'Tab 8',
      content: {
        Element: () => <div>Tab 8 Content</div>,
        props: {},
        className: '',
      },
      addSpacer: false,
    },
  ],
};

export const Primary: StoryObj<typeof meta> = {
  args: {},
  render: (args) => (
    <div className="w-full">
      {/* @ts-ignore */}
      <TabsProvider items={mockData}>
        <Tabs {...args} />
      </TabsProvider>
    </div>
  ),
};
