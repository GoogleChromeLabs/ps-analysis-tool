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

import { I18n } from '@google-psat/i18n';
import generateReportObject from '../generateReportObject';
import { data, libraryMatches, tabCookies, tabFrames } from './data.mock';

describe('generateReport', () => {
  beforeAll(() => {
    I18n.initMessages({
      totalCookies: {
        message: 'Total Cookies',
      },
      '1stPartyCookies': {
        message: '1st Party Cookies',
      },
      '3rdPartyCookies': {
        message: '3rd Party Cookies',
      },
      blockedCookies: {
        message: 'Blocked cookies',
      },
      exemptedCookies: {
        message: 'Exempted Cookies',
      },
    });
    globalThis.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });
    globalThis.chrome.i18n = null;
  });

  it.skip('should generate report object', async () => {
    const result = await generateReportObject(
      tabCookies,
      tabFrames,
      libraryMatches,
      'http://example.com'
    );

    expect(result).toEqual(data);
    //@ts-ignore
  });
});
