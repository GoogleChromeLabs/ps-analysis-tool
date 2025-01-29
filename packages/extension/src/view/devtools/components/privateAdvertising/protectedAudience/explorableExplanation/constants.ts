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
 * External dependencies
 */
import type { InterestGroups, singleAuctionEvent } from '@google-psat/common';

interface WebsiteInterestGroup {
  [websiteName: string]: InterestGroups[];
}
export const SYNTHETIC_INTEREST_GROUPS: WebsiteInterestGroup = {
  'adv1.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '101ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'shoes',
      time: 1696154400.101,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1696156992.101,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'shoes',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '102ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'heels',
      time: 1696154400.102,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1696156992.102,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'heels',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '103ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'phones',
      time: 1696154400.103,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1696156992.103,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'phones',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'adv2.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '101ms',
      type: 'join',
      ownerOrigin: 'https://www.adv2.com',
      name: 'stilletos',
      time: 1696157600.101,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698749600.101,
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
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '102ms',
      type: 'join',
      ownerOrigin: 'https://www.adv2.com',
      name: 'shorts',
      time: 1696157600.102,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698749600.102,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'shorts',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'pub1.com': [],
  'adv3.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '101ms',
      type: 'join',
      ownerOrigin: 'https://www.adv3.com',
      name: 'bike',
      time: 1696161200.101,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698853200.101,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'bike',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '102ms',
      type: 'join',
      ownerOrigin: 'https://www.adv3.com',
      name: 'car',
      time: 1696161200.102,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698853200.102,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'car',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'adv5.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '80ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'football',
      time: 1696161520.08,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698753520.08,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'football',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '81ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'basketball',
      time: 1696161520.081,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698753520.081,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'basketball',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '88ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'baseball',
      time: 1696161520.088,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698753520.088,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'baseball',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'pub2.com': [],
  'adv6.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '67ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'movies',
      time: 1696164860.067,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698756860.067,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'movies',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '69ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'series',
      time: 1696164860.069,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698756860.069,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'series',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '71ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'books',
      time: 1696164860.071,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698756860.071,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'books',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'adv7.com': [
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '71ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IGG220',
      time: 1696168400.071,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698760400.071,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'IGG220',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '76ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IGG201',
      time: 1696168400.076,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698760400.076,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'IGG201',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
    {
      eventType: 'interestGroupAccessed',
      formattedTime: '151ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IG225',
      time: 1696168400.151,
      details: {
        ads: [
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_1_crid","cid":"shoes_ad_1_cid","cat":["IAB-1"],"seat":"shoes_ad_1_seat_id","adomain":["shoes_ad_1_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-1.html',
          },
          {
            metadata:
              '{"type":"shoes","crid":"shoes_ad_2_crid","cid":"shoes_ad_2_cid","cat":["IAB-2"],"seat":"shoes_ad_2_seat_id","adomain":["shoes_ad_2_adomain.com"],"w":300,"h":250}',
            renderURL:
              'https://privacysandboxdemos-buyer-1.domain-aaa.com/advertiser/test-ad-2.html',
          },
        ],
        auctionServerRequestFlags: [],
        biddingLogicURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding-logic.js',
        enableBiddingSignalsPrioritization: false,
        executionMode: 'compatibility',
        expirationTime: 1698760400.151,
        joiningOrigin: 'https://privacysandboxdemos.domain-aaa.com',
        maxTrustedBiddingSignalsURLLength: 0,
        name: 'IG225',
        priority: 0,
        sellerCapabilities: {
          '*': [],
        },
        trustedBiddingSignalsKeys: ['remainingBudget', 'arbitrary-key'],
        trustedBiddingSignalsSlotSizeMode: 'none',
        trustedBiddingSignalsURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/bidding_signal-1.json',
        updateURL:
          'https://privacysandboxdemos-buyer-1.domain-aaa.com/dsp/daily_update_url-test.json',
        userBiddingSignals: '{"user_bidding_signals":"user_bidding_signals"}',
      },
    },
  ],
  'pub3.com': [],
};

export const SYNTHETIC_AUCTION_EVENT_STARTED: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  type: 'started',
  formattedTime: '-0 ms',
  time: -1734076669.500694,
  eventType: 'interestGroupAuctionEventOccurred',
};
export const SYNTHETIC_AUCTION_EVENT_CONFIG_RESOLVED: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  type: 'configResolved',
  formattedTime: '-0.75ms',
  time: -1734076669.501441,
  eventType: 'interestGroupAuctionEventOccurred',
};

export const SYNTHETIC_AUCTION_EVENT_LOADED: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  name: 'shoes',
  ownerOrigin: 'https://privacysandboxdemos-buyer-1.domain-aaa.com',
  formattedTime: '-2.16ms',
  type: 'loaded',
  time: -1734076669.502853,
  eventType: 'interestGroupAccessed',
};

export const SYNTHETIC_AUCTION_EVENT_BIDDERJS: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  formattedTime: '-77.17ms',
  type: 'Start fetch bidderJs',
  time: -1734076669.577862,
  eventType: 'interestGroupAuctionNetworkRequestCreated',
};

export const SYNTHETIC_AUCTION_EVENTS_BID: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  name: 'shoes',
  ownerOrigin: 'https://privacysandboxdemos-buyer-1.domain-aaa.com',
  formattedTime: '-472.61ms',
  type: 'bid',
  time: -1734076669.973304,
  eventType: 'interestGroupAccessed',
  bid: 24,
  bidCurrency: 'USD',
};

export const SYNTHETIC_AUCTION_EVENTS_WIN: singleAuctionEvent = {
  uniqueAuctionId: '27A93A016A30D0A5FB7B8C8779D98AF8',
  name: 'shoes',
  ownerOrigin: 'https://privacysandboxdemos-buyer-1.domain-aaa.com',
  formattedTime: '-629.06ms',
  type: 'win',
  time: -1734076670.129756,
  eventType: 'interestGroupAccessed',
};

export const SYNTHETIC_AUCTION_CONFIG = {
  auctionSignals: {
    pending: false,
    value: '{"auction_signals":"auction_signals"}',
  },
  decisionLogicURL:
    'https://privacysandboxdemos-seller.domain-aaa.com/ssp/decision-logic.js',
  deprecatedRenderURLReplacements: {
    pending: false,
    value: [],
  },
  expectsAdditionalBids: false,
  expectsDirectFromSellerSignalsHeaderAdSlot: false,
  interestGroupBuyers: ['https://dsp.com'],
  maxTrustedScoringSignalsURLLength: 0,
  perBuyerCumulativeTimeouts: {
    pending: false,
    value: {},
  },
  perBuyerCurrencies: {
    pending: false,
    value: {},
  },
  perBuyerExperimentGroupIds: {},
  perBuyerGroupLimits: {
    '*': 65535,
  },
  perBuyerMultiBidLimit: {
    '*': 0,
  },
  perBuyerPrioritySignals: {},
  perBuyerSignals: {
    pending: false,
    value: {
      'https://dsp.com': '{"buyerdata":"per_buyer_signals"}',
    },
  },
  perBuyerTimeouts: {
    pending: false,
    value: {},
  },
  requiredSellerCapabilities: [],
  seller: 'https://privacysandboxdemos-seller.domain-aaa.com',
  sellerSignals: {
    pending: false,
    value:
      '{"bidFloor":7,"floor":7,"auctionID":"id_683036","divId":"ad-container","type":"image","size":[300,250],"isFencedFrame":true}',
  },
  trustedScoringSignalsURL:
    'https://privacysandboxdemos-seller.domain-aaa.com/ssp/kv.json',
};
