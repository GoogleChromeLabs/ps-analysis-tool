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
 * External dependencies
 */
import type { CookieTableData } from '@ps-analysis-tool/common';

export const frameFilteredCookies: { [key: string]: CookieTableData } = {
  LSOLH: {
    analytics: {
      category: 'Functional',
      dataController: 'Google',
      description: 'This cookie is for authentication with your Google account',
      domain: 'accounts.google.com',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: 'LSOLH',
      platform: 'Google',
      retention: '1 year',
      wildcard: '0',
    },
    frameIdList: [0],
    headerType: 'request',
    isFirstParty: false,
    parsedCookie: {
      domain: 'accounts.google.com',
      expires: String(new Date(Number(new Date()) + 5259487666).toISOString()),
      httponly: false,
      name: 'LSOLH',
      path: '/',
      samesite: 'none',
      secure: true,
      value:
        '|_SVI_EMmpku6Lz4ADGBAiP01BRURIZl9xZWR4OHp5aUhCQ1h5RnVzcXFlb1NPUUVQeXVPZGlSTjBLeXdLMnRMOGpfd3JQZDk0STh3ZWJVNA_:|28192806:3705',
    },
    url: 'https://accounts.google.com/gsi/status?client_id=549796576131-8aoqmiheqf84a8bh3dl10ec2kp2v6e7p.apps.googleusercontent.com&as=ujHsjnl%2BJlozSZHE2Z6o2A',
    isBlocked: true,
  },
  NID: {
    analytics: {
      category: 'Marketing',
      dataController: 'Google',
      description:
        'This cookies is used to collect website statistics and track conversion rates and Google ad personalisation',
      domain: 'google.com',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: 'NID',
      platform: 'Google',
      retention: '1 year',
      wildcard: '0',
    },
    frameIdList: [3964, 3967, 0],
    headerType: 'request',
    isFirstParty: false,
    parsedCookie: {
      domain: '.google.com',
      expires: String(new Date(Number(new Date()) + 5259487666).toISOString()),
      httponly: true,
      name: 'NID',
      path: '/',
      samesite: 'none',
      secure: true,
      value:
        '511=Wrres5z7l_wUKKUzHhf2KIqAnj6papQrcGn1F12gPxd2SdxEGS-567t-hT7Yuzb8tJsENk8pT_9xCJ1UMPLbXKQk4mPUCtMp7VeFXp0yi8t0xPMvqgfUKKBpQwV8XmrveNPPwLmwxriIpyicaBYoJ-ZzfHvqnCZDya9rU_s_JwGk5JvIDTqIEYVQKzKJDyFQjiAINLhRFCmWOTWF7X3C3mYKVaUQrT4JLhZRAGEoj4Qz_ig5MbxpLB372-PjFrNofa5FvfmYWn3uBEFYm0UvAqhhyOcsND5eAf_iYYWufJAVGReSyfWZ0spF25g4TS-pUdU8l3zDJC-7',
    },
    url: 'https://www.google.com/recaptcha/api2/anchor?ar=1&k=6Le6JpwaAAAAAFkASVap1OUThl-lQSJC0r9kLl2I&co=aHR0cHM6Ly9ydGNhbXAuY29tOjQ0Mw..&hl=en&v=QybaJej5brGL8d7EvWmfKMZU&theme=light&size=invisible&badge=bottomright&cb=hztbhk44za6a',
    isBlocked: true,
  },
  _ga: {
    analytics: {
      category: 'Analytics',
      dataController: 'Google',
      description: 'ID used to identify users',
      domain:
        "google-analytics.com (3rd party) or advertiser's website domain (1st party)",
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: '_ga',
      platform: 'Google Analytics',
      retention: '2 years',
      wildcard: '0',
    },
    frameIdList: [0],
    headerType: 'request',
    isFirstParty: true,
    parsedCookie: {
      domain: '.rtcamp.com',
      expires: String(new Date(Number(new Date()) + 5259487666).toISOString()),
      httponly: false,
      name: '_ga',
      path: '/',
      samesite: '',
      secure: false,
      value: 'GA1.1.2118227284.1688917659',
    },
    url: 'https://rtcamp.com/wp-content/mu-plugins/jetpack-12.4/css/jetpack.css?ver=12.4',
    isBlocked: true,
  },
  _ga_7HKDVLRRV4: {
    analytics: {
      category: 'Analytics',
      dataController: 'Google',
      description: 'ID used to identify users',
      domain:
        "google-analytics.com (3rd party) or advertiser's website domain (1st party)",
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: '_ga_*',
      platform: 'Google Analytics',
      retention: '2 years',
      wildcard: '1',
    },
    frameIdList: [0],
    headerType: 'request',
    isFirstParty: true,
    parsedCookie: {
      domain: '.rtcamp.com',
      expires: String(new Date(Number(new Date()) + 5259487666).toISOString()),
      httponly: false,
      name: '_ga_7HKDVLRRV4',
      path: '/',
      samesite: '',
      secure: false,
      value: 'GS1.1.1692264828.19.1.1692264924.55.0.0',
    },
    url: 'https://rtcamp.com/wp-content/mu-plugins/jetpack-12.4/css/jetpack.css?ver=12.4',
    isBlocked: true,
  },
  _parsely_session: {
    analytics: {
      category: '',
      dataController: '',
      description: '',
      domain: '',
      gdprUrl: '',
      name: '',
      platform: '',
      retention: '',
      wildcard: '',
    },
    frameIdList: [0],
    headerType: 'request',
    isFirstParty: true,
    parsedCookie: {
      domain: '.rtcamp.com',
      expires: String(new Date(Number(new Date()) + 86400000).toISOString()),
      httponly: false,
      name: '_parsely_session',
      path: '/',
      samesite: '',
      secure: false,
      value:
        '{%22sid%22:8%2C%22surl%22:%22https://rtcamp.com/%22%2C%22sref%22:%22%22%2C%22sts%22:1692264828254%2C%22slts%22:1692261902478}',
    },
    url: 'https://rtcamp.com/wp-content/mu-plugins/jetpack-12.4/css/jetpack.css?ver=12.4',
    isBlocked: false,
  },
  _parsely_session_expiry: {
    analytics: {
      category: '',
      dataController: '',
      description: '',
      domain: '',
      gdprUrl: '',
      name: '',
      platform: '',
      retention: '',
      wildcard: '',
    },
    frameIdList: [0],
    headerType: 'request',
    isFirstParty: true,
    parsedCookie: {
      domain: '.rtcamp.com',
      expires: 'Session',
      httponly: false,
      name: '_parsely_session_expiry',
      path: '/',
      samesite: '',
      secure: false,
      value:
        '{%22sid%22:8%2C%22surl%22:%22https://rtcamp.com/%22%2C%22sref%22:%22%22%2C%22sts%22:1692264828254%2C%22slts%22:1692261902478}',
    },
    url: 'https://rtcamp.com/wp-content/mu-plugins/jetpack-12.4/css/jetpack.css?ver=12.4',
    isBlocked: false,
  },
};
