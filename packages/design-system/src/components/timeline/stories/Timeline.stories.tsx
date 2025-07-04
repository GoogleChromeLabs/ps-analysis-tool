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
import { prepareTimelineData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Timeline, { TimelineProps } from '..';
import prebidResponse from './dummy-data';

const meta: Meta<typeof Timeline> = {
  title: 'DesignSystem/Timeline',
  component: Timeline,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  render: () => {
    const auctions: TimelineProps = prepareTimelineData(prebidResponse, true);

    return (
      <>
        {Object.entries(auctions).map(([auctionId, auction]) => {
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
