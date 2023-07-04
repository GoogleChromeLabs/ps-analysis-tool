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
import filterCookies from '../filterCookies';
import type { Cookies } from '../../../../../../../../localStore';

const dummyCookie: Cookies = {
  '1P_JAR': {
    analytics: {
      category: 'Marketing',
      dataController: 'Google',
      description:
        'These cookies are set via embedded youtube-videos. They register anonymous statistical data on for example how many times the video is displayed and what settings are used for playback.',
      domain: '.gstatic.com',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: '1P_JAR',
      platform: 'Google',
      retention: '1 month',
      wildcard: '0',
    },
    headerType: 'request',
    parsedCookie: {
      domain: 'play.google.com',
      name: '1P_JAR',
      value: '2023-07-04-01',
    },
    url: 'https://play.google.com/log?format=json&hasfast=true&authuser=0',
  },
  AEC: {
    analytics: null,
    headerType: 'request',
    parsedCookie: {
      domain: 'play.google.com',
      name: 'AEC',
      value: 'Ad49MVHTLoyvoyItxo-EgG7Qkn_yBRYQnPPCPgq3aX1nhShg7counit5qcs',
    },
    url: 'https://play.google.com/log?format=json&hasfast=true&authuser=0',
  },
  APISID: {
    analytics: {
      category: 'Marketing',
      dataController: 'Google',
      description:
        'Download certain Google Tools and save certain preferences, for example the number of search results per page or activation of the SafeSearch Filter. Adjusts the ads that appear in Google Search.',
      domain: 'google.com',
      gdprUrl: 'https://privacy.google.com/take-control.html',
      name: 'APISID',
      platform: 'Google',
      retention: '2 years',
      wildcard: '0',
    },
    headerType: 'request',
    parsedCookie: {
      domain: 'play.google.com',
      name: 'APISID',
      value: 'bbOh-iDa2mglBKTr/AyHP5WBgyoUzkagH_',
    },
    url: 'https://play.google.com/log?format=json&hasfast=true&authuser=0',
  },
};

describe.skip('filterCookies', () => {
  it('Should return filtered cookies', () => {
    expect(filterCookies(dummyCookie, {})).toStrictEqual(dummyCookie);
  });
});
