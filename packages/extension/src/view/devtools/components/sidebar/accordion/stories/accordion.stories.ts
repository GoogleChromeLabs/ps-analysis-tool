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
import type { Meta, StoryObj } from '@storybook/react';

/**
 * Internal dependencies.
 */
import Accordion from '..';

// @todo To be removed after we add any story.
// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Accordion> = {
  title: 'Extension/Accordion',
  component: Accordion,
  argTypes: {
    accordionState: { control: 'boolean' },
    tabName: { control: 'text' },
    index: { control: 'number' },
    selectedIndex: { control: 'number' },
    selectedFrame: { control: 'text' },
  },
};

export default meta;

export const Primary: StoryObj<typeof Accordion> = {
  args: {
    tabName: 'Cookies',
    index: 1,
    selectedIndex: 1,
    tabFrames: {
      'https://edition.cnn.com': { frameIds: [1] },
      'https://crxd.net': { frameIds: [2] },
      'https://pubmatic.com': { frameIds: [3] },
    },
    setSelectedFrame: () => undefined,
    selectedFrame: 'https://edition.cnn.com',
    accordionState: false,
    keyboardNavigator: () => undefined,
    setAccordionState: () => undefined,
    setIndex: () => undefined,
  },
};
