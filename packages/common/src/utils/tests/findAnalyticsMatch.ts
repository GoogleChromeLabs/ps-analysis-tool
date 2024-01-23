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
import { CookieDatabase } from '../../cookies.types';
import findAnalyticsMatch, { emptyAnalytics } from '../findAnalyticsMatch';

const DICT: CookieDatabase = {
  cookiePreferences: [
    {
      platform: 'Google Tag Manager',
      category: 'Functional',
      name: 'cookiePreferences',
      domain: '',
      description: 'Registers cookie preferences of a user',
      retention: '2 years',
      dataController: 'Google',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      wildcard: '0',
    },
  ],
  td: [
    {
      platform: 'Google Tag Manager',
      category: 'Analytics',
      name: 'td',
      domain: 'www.googletagmanager.com',
      description:
        "Registers statistical data on users' behaviour on the website. Used for internal analytics by the website operator.",
      retention: 'session',
      dataController: 'Google',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      wildcard: '0',
    },
  ],
  'CookieConsent_*': [
    {
      platform: 'Cookiebot',
      category: 'Functional',
      name: 'CookieConsent*',
      domain: 'cookiebot.com (3rd party) or',
      description: 'Registers cookie preferences of a user',
      retention: '1 year',
      dataController: 'Cookiebot',
      gdprUrl: 'https://www.cookiebot.com/en/cookie-declaration/',
      wildcard: '1',
    },
  ],

  '*_CookieConsent': [
    {
      platform: 'Cookiebot',
      category: 'Functional',
      name: 'CookieConsent*',
      domain: 'cookiebot.com (3rd party) or',
      description: 'Registers cookie preferences of a user',
      retention: '1 year',
      dataController: 'Cookiebot',
      gdprUrl: 'https://www.cookiebot.com/en/cookie-declaration/',
      wildcard: '1',
    },
  ],
};

describe('findAnalyticsMatch', () => {
  it('should return empty analytics if no match is found', () => {
    expect(findAnalyticsMatch('key', {})).toStrictEqual(emptyAnalytics);
  });

  it('should match normal keys', () => {
    const key = 'cookiePreferences';
    expect(findAnalyticsMatch(key, DICT)).toStrictEqual(DICT[key][0]);
  });

  it('should match keys with postfix wildcard', () => {
    expect(findAnalyticsMatch('CookieConsent_123', DICT)).toStrictEqual(
      DICT['CookieConsent_*'][0]
    );
  });

  it('should match keys with prefix wildcard', () => {
    expect(findAnalyticsMatch('123_CookieConsent', DICT)).toStrictEqual(
      DICT['*_CookieConsent'][0]
    );
  });
});
