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
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import generateSummaryDataCSV from '../generateSummaryDataCSV';
import { mockData1 } from './data.mock';

describe('generateSummaryDataCSV', () => {
  beforeAll(() => {
    globalThis.chrome.i18n = null;

    I18n.initMessages({
      totalCookies: {
        message: 'Total Cookies',
      },
      totalFirstPartyCookies: {
        message: 'Total First Party Cookies',
      },
      totalThirdPartyCookies: {
        message: 'Total Third Party Cookies',
      },
      analyticsCookies: {
        message: 'Analytics Cookies',
      },
      functionalCookies: {
        message: 'Functional Cookies',
      },
      marketingCookies: {
        message: 'Marketing Cookies',
      },
      uncategorizedCookies: {
        message: 'Uncategorised Cookies',
      },
      cookiesWithIssues: {
        message: 'Cookies With Issues',
      },
      analyticsCookiesWithIssues: {
        message: 'Analytics Cookies With Issues',
      },
      functionalCookiesWithIssues: {
        message: 'Functional Cookies With Issues',
      },
      marketingCookiesWithIssues: {
        message: 'Marketing Cookies With Issues',
      },
      uncategorisedCookiesWithIssues: {
        message: 'Uncategorised Cookies With Issues',
      },
    });
  });

  it('should create CSV string for summary data', () => {
    const CSVString = generateSummaryDataCSV(mockData1);

    console.log(CSVString);

    expect(CSVString.split('\r\n').filter((str) => str).length).toBe(12);
  });

  it('shoulde have 3 cookies', () => {
    const CSVString = generateSummaryDataCSV(mockData1);

    expect(
      CSVString.split('\r\n').filter(
        (str) => str.split(',')[0] === 'Total Cookies'
      )
    ).toStrictEqual(['Total Cookies, 3']);
  });
});
