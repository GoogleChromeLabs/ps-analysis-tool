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
 * Internal dependencies
 */
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';
import extractCookies from '../extractCookies';
import { tempSinglePageData } from './data.mock';

describe('extractCookies', () => {
  it('should return an empty object if no cookies are present', () => {
    expect(extractCookies({}, '')).toEqual({});
  });

  it('should return an object with the cookies', () => {
    let isLandingPage = true;
    const pageUrl = 'https://edition.cnn.com';

    expect(
      extractCookies(tempSinglePageData.cookieData, pageUrl, isLandingPage)
    ).toEqual({
      'https://edition.cnn.com': {
        'countryCode:.cnn.com:/': {
          name: 'countryCode',
          domain: '.cnn.com',
          path: '/',
          value: 'IN',
          sameSite: 'None',
          expires: 'Session',
          httpOnly: false,
          secure: true,
          isBlocked: false,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: true,
          pageUrl,
          frameUrl: 'https://edition.cnn.com',
        },
      },
      'Unknown frame(s)': {},
    });

    isLandingPage = false;

    expect(
      extractCookies(tempSinglePageData.cookieData, pageUrl, isLandingPage)
    ).toEqual({
      'https://edition.cnn.com': {
        ['countryCode:.cnn.com:/' + pageUrl]: {
          name: 'countryCode',
          domain: '.cnn.com',
          path: '/',
          value: 'IN',
          sameSite: 'None',
          expires: 'Session',
          httpOnly: false,
          secure: true,
          isBlocked: false,
          platform: 'Unknown',
          category: 'Uncategorized',
          GDPR: '',
          description: '',
          isFirstParty: true,
          pageUrl,
          frameUrl: 'https://edition.cnn.com',
        },
      },
      [UNKNOWN_FRAME_KEY]: {},
    });
  });
});
