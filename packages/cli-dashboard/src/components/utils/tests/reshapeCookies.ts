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
import type { CookieFrameStorageType } from '../../../types';
import reshapeCookies from '../reshapeCookies';

describe('reshapeCookies', () => {
  it('should return an empty object if no cookies are present', () => {
    expect(reshapeCookies({})).toEqual({});
  });

  it('should return an object with the cookies', () => {
    const cookies: CookieFrameStorageType = {
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
          pageUrl: 'https://www.cnn.com/index.html',
          frameUrls: { sadf: 'https://edition.cnn.com' },
        },
      },
      'Unknown frame(s)': {},
    };

    expect(reshapeCookies(cookies)).toEqual({
      'countryCode.cnn.com/': {
        parsedCookie: {
          name: 'countryCode',
          value: 'IN',
          domain: '.cnn.com',
          path: '/',
          expires: 'Session',
          httponly: false,
          secure: true,
          samesite: 'None',
        },
        analytics: {
          platform: 'Unknown',
          category: 'Uncategorized',
          description: '',
        },
        isFirstParty: true,
        url: 'https://www.cnn.com/index.html',
        frameUrls: ['https://edition.cnn.com'],
        frameIdList: ['https://edition.cnn.com'],
        isBlocked: false,
        headerType: 'response',
      },
    });
  });
});
