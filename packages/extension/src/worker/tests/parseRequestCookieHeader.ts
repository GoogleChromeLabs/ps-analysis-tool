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
 * Internal dependencies.
 */
import parseRequestCookieHeader from '../parseRequestCookieHeader';

const normalCookie1 = {
  parsedCookie: {
    name: 'cookieKey1',
    value: 'value1',
    domain: 'example.com',
  },
  analytics: null,
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const normalCookie2 = {
  parsedCookie: {
    name: 'CookieKey2',
    value: 'value2',
    domain: 'example.com',
  },
  analytics: null,
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const specialCookie = {
  parsedCookie: {
    name: 'SpecialCookie',
    value: 'Special=Value',
    domain: 'example.com',
  },
  analytics: null,
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const wildcardCookie = {
  parsedCookie: {
    name: 'Wildcard_123',
    value: 'val',
    domain: 'example.com',
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
    GDPRUrl: 'https://privacy.google.com/take-control.html',
    wildcard: '1',
  },
  url: 'https://example.com/public/api/alerts',
  headerType: 'request',
};

const normalCookie1Header = `${normalCookie1.parsedCookie.name}=${normalCookie1.parsedCookie.value}`;
const normalCookie2Header = `${normalCookie2.parsedCookie.name}=${normalCookie2.parsedCookie.value}`;
const specialCookieHeader = `${specialCookie.parsedCookie.name}=${specialCookie.parsedCookie.value}`;
const wildcardCookieHeader = `${wildcardCookie.parsedCookie.name}=${wildcardCookie.parsedCookie.value}`;

describe('parseRequestCookieHeader', () => {
  it('Should parse all cookie header (request cookies)', () => {
    const header = `${normalCookie1Header}; ${normalCookie2Header}; ${specialCookieHeader}`;
    const parsedCookie = parseRequestCookieHeader(
      'https://example.com/public/api/alerts',
      header,
      {}
    );

    expect(parsedCookie).toEqual([normalCookie1, normalCookie2, specialCookie]);
  });
  it('Should parse cookie header and add analytics', () => {
    const header = `${normalCookie1Header}; ${normalCookie2Header}; ${specialCookieHeader}; ${wildcardCookieHeader}`;
    const parsedCookie = parseRequestCookieHeader(
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
            GDPRUrl: 'https://privacy.google.com/take-control.html',
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
            GDPRUrl: 'https://privacy.google.com/take-control.html',
            wildcard: '1',
          },
        ],
      }
    );

    expect(parsedCookie).toEqual([
      normalCookie1,
      normalCookie2,
      specialCookie,
      wildcardCookie,
    ]);
  });
});
