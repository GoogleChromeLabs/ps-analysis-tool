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
import prebidResponse from './dummy-data';
import prepareTimelineData from '../utils/prepareTimelineData';

const meta: Meta<typeof Timeline> = {
  title: 'DesignSystem/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const bidders: {
  name: string;
  startTime?: number;
  duration: string;
  type: BidderType;
}[] =
  //@ts-ignore
  prepareTimelineData(prebidResponse);

export const Primary: Story = {
  args: {
    auctionTimeout: 420,
    auctionId: '40eb202e-d5fc-44db-b602-5be0a7b1f844',
    auctionStartTime: '12:18:27',
    auctionTime: '380.1',
    bidders,
    zoomLevel: 2,
    auctionEvent:
      prebidResponse.auctionEvents['40eb202e-d5fc-44db-b602-5be0a7b1f844'],
  },
};
