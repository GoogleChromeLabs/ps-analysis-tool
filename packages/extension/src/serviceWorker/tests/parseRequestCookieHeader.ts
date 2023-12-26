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
import SinonChrome from 'sinon-chrome';
import { emptyAnalytics } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import parseRequestCookieHeader from '../parseRequestCookieHeader';

const normalCookie1 = {
  parsedCookie: {
    name: 'cookieKey1',
    value: 'value1',
    domain: '.example.com',
    expires: 'Session',
    path: '/',
    httponly: false,
    secure: false,
    samesite: '',
    partitionKey: '',
    priority: 'Medium',
    size: 16,
  },
  analytics: { ...emptyAnalytics },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
  isFirstParty: false,
  frameIdList: [1],
};

const normalCookie2 = {
  parsedCookie: {
    name: 'CookieKey2',
    value: 'value2',
    domain: '.example.com',
    expires: 'Session',
    path: '/',
    httponly: false,
    secure: false,
    samesite: '',
    partitionKey: '',
    priority: 'Medium',
    size: 16,
  },
  analytics: { ...emptyAnalytics },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
  isFirstParty: false,
  frameIdList: [1],
};

const specialCookie = {
  parsedCookie: {
    name: 'SpecialCookie',
    value: 'Special=Value',
    domain: '.example.com',
    expires: 'Session',
    path: '/',
    httponly: false,
    secure: false,
    samesite: '',
    partitionKey: '',
    priority: 'Medium',
    size: 26,
  },
  analytics: { ...emptyAnalytics },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
  isFirstParty: false,
  frameIdList: [1],
};

const wildcardCookie = {
  parsedCookie: {
    name: 'Wildcard_123',
    value: 'val',
    domain: '.example.com',
    expires: 'Session',
    path: '/',
    httponly: false,
    secure: false,
    samesite: '',
    partitionKey: '',
    priority: 'Medium',
    size: 15,
  },
  analytics: {
    platform: 'Google Analytics',
    category: 'Analytics',
    name: 'Wildcard_',
    domain:
      "google-analytics.com (3rd party) or advertiser's website domain (1st party)",
    description: 'ID used to identify users',
    retention: '2 years',
    dataController: 'Google',
    gdprUrl: 'https://privacy.google.com/take-control.html',
    wildcard: '1',
  },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
  isFirstParty: false,
  frameIdList: [1],
};

const normalCookie1Header = `${normalCookie1.parsedCookie.name}=${normalCookie1.parsedCookie.value}`;
const normalCookie2Header = `${normalCookie2.parsedCookie.name}=${normalCookie2.parsedCookie.value}`;
const specialCookieHeader = `${specialCookie.parsedCookie.name}=${specialCookie.parsedCookie.value}`;
const wildcardCookieHeader = `${wildcardCookie.parsedCookie.name}=${wildcardCookie.parsedCookie.value}`;

describe('parseRequestCookieHeader', () => {
  beforeAll(() => {
    globalThis.chrome = SinonChrome as unknown as typeof chrome;
  });

  it('Should parse all cookie header (request cookies)', async () => {
    const header = `${normalCookie1Header}; ${normalCookie2Header}; ${specialCookieHeader}`;
    const parsedCookie = await parseRequestCookieHeader(
      'https://example.com/public/api/alerts',
      header,
      {},
      'https://docs.google.com/',
      1,
      []
    );

    expect(parsedCookie).toEqual([normalCookie1, normalCookie2, specialCookie]);
  });

  it('Should parse cookie header and add analytics', async () => {
    const header = `${normalCookie1Header}; ${normalCookie2Header}; ${specialCookieHeader}; ${wildcardCookieHeader}`;
    const parsedCookie = await parseRequestCookieHeader(
      'https://example.com/public/api/alerts',
      header,
      {
        Wildcard: [
          {
            platform: 'Should not match',
            category: 'Analytics',
            name: '_ga',
            domain:
              "google-analytics.com (3rd party) or advertiser's website domain (1st party)",
            description: 'ID used to identify users',
            retention: '2 years',
            dataController: 'Google',
            gdprUrl: 'https://privacy.google.com/take-control.html',
            wildcard: '0',
          },
        ],
        'Wildcard_*': [
          {
            platform: 'Google Analytics',
            category: 'Analytics',
            name: 'Wildcard_',
            domain:
              "google-analytics.com (3rd party) or advertiser's website domain (1st party)",
            description: 'ID used to identify users',
            retention: '2 years',
            dataController: 'Google',
            gdprUrl: 'https://privacy.google.com/take-control.html',
            wildcard: '1',
          },
        ],
      },
      'https://docs.google.com/',
      1,
      []
    );

    expect(parsedCookie).toEqual([
      normalCookie1,
      normalCookie2,
      specialCookie,
      wildcardCookie,
    ]);
  });
});
