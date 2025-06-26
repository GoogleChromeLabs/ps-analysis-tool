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
import JsonView from '../jsonView';

const meta = {
  title: 'DesignSystem/JsonView',
  component: JsonView,
  tags: ['autodocs'],
} as Meta<typeof JsonView>;

export default meta;

type Story = StoryObj<typeof meta>;

const json = {
  eventType: 'interestGroupAccessed',
  formattedTime: '101ms',
  type: 'join',
  ownerOrigin: 'https://www.myntra.com',
  name: 'stilletos',
  time: 1743777780,
  details: {
    ads: [
      {
        metadata:
          '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
        renderURL: 'https://www.myntra.com/advertiser/test-ad-1.html',
      },
      {
        metadata:
          '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
        renderURL: 'https://www.myntra.com/advertiser/test-ad-2.html',
      },
    ],
    auctionServerRequestFlags: [],
    biddingLogicURL: 'https://www.myntra.com/dsp/bidding-logic.js',
    enableBiddingSignalsPrioritization: false,
    executionMode: 'compatibility',
    expirationTime: 1743813780,
    joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
    maxTrustedBiddingSignalsURLLength: 0,
    name: 'stilletos',
    priority: 0,
    sellerCapabilities: {
      '*': [],
    },
    trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
    trustedBiddingSignalsSlotSizeMode: 'none',
    trustedBiddingSignalsURL:
      'https://www.myntra.com/dsp/bidding_signal-1.json',
    updateURL:
      'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
    userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
  },
};

export const Default: Story = {
  args: {
    src: json,
  },
};
