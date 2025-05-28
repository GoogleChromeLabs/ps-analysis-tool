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
import Timeline from '..';
import { BidderType } from '../types';

const meta: Meta<typeof Timeline> = {
  title: 'DesignSystem/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const bidders: { name: string; duration: string; type: BidderType }[] = [
  { name: 'Pubmattic', duration: '270.1', type: BidderType.BID },
  { name: 'Sharethrough', duration: '210.4', type: BidderType.NO_BID },
  { name: 'appnexus', duration: '240.0', type: BidderType.NO_BID },
  { name: 'ix', duration: '380.1', type: BidderType.NO_BID },
  { name: 'Rubicon', duration: '125.51', type: BidderType.WON },
  { name: 'Criteo', duration: '470.05', type: BidderType.TIMED_OUT },
];

export const Primary: Story = {
  args: {
    auctionTimeout: 420,
    auctionId: '23949b7f-b733-4a58-b3b0-e72deed12e61',
    auctionStartTime: '12:18:27',
    auctionTime: '380.1',
    bidders,
    zoomLevel: 2,
  },
};
