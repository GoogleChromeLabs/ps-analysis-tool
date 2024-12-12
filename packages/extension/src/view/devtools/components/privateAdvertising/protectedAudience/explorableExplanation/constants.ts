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
export const SYNTHETIC_INTEREST_GROUPS = {
  'adv1.com': [
    {
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'shoes',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'heels',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv1.com',
      name: 'phones',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv2.com',
      name: 'stilletos',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv2.com',
      name: 'shorts',
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
        expirationTime: 1736593408.252279,
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
  'adv3.com': [
    {
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv3.com',
      name: 'bike',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv3.com',
      name: 'car',
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
        expirationTime: 1736593408.252279,
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
  'adv4.com': [
    {
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv4.com',
      name: 'football',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv4.com',
      name: 'basketball',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv4.com',
      name: 'baseball',
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
        expirationTime: 1736593408.252279,
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
  'adv5.com': [
    {
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'football',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'basketball',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv5.com',
      name: 'baseball',
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
        expirationTime: 1736593408.252279,
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
  'adv6.com': [
    {
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'movies',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'series',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv6.com',
      name: 'books',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IGG220',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IGG201',
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
        expirationTime: 1736593408.252279,
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
      formattedTime: '123ms',
      type: 'join',
      ownerOrigin: 'https://www.adv7.com',
      name: 'IG225',
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
        expirationTime: 1736593408.252279,
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
};
