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
import prebidResponse from './dummy-data';
import prepareTimelineData from '../utils/prepareTimelineData';

const meta: Meta<typeof Timeline> = {
  title: 'DesignSystem/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    const auctions = prepareTimelineData(prebidResponse);

    return (
      <>
        {Object.entries(auctions).map(([auctionId, auction]) => {
          console.log(auction.auctionTimeout);
          return (
            <div key={auctionId} style={{ marginBottom: '2rem' }}>
              <Timeline {...auction} />
            </div>
          );
        })}
      </>
    );
  },
};
