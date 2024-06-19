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
import extractReportData from '../extractReportData';
import { tempMultiPageData } from './data.mock';

describe('extractReportData', () => {
  it('should return an empty object if no cookies are present', () => {
    expect(extractReportData([])).toEqual({
      landingPageCookies: {},
      consolidatedLibraryMatches: {},
    });
  });

  it('should return an object with the cookies', () => {
    expect(extractReportData(tempMultiPageData)).toEqual({
      landingPageCookies: {
        'https://edition.cnn.com': {
          ['countryCode:.cnn.com:/']: {
            parsedCookie: {
              name: 'countryCode',
              domain: '.cnn.com',
              path: '/',
              value: 'IN',
              sameSite: 'None',
              expires: 'Session',
              httpOnly: false,
              secure: true,
            },
            analytics: {
              platform: 'Unknown',
              category: 'Uncategorized',
              GDPR: '',
              description: '',
            },
            url: '',
            pageUrl: 'https://edition.cnn.com/index.html',
            isBlocked: false,
            blockedReasons: ['ThirdPartyPhaseout', 'ExcludeDomainNonASCII'],
            isFirstParty: true,
          },
        },
      },
      consolidatedLibraryMatches: {
        'https://edition.cnn.com/index.html': undefined,
        'https://www.cnn.com/index.html': undefined,
      },
    });
  });
});
