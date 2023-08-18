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
import '@testing-library/jest-dom';

/**
 * Internal dependencies.
 */
import filterCookiesWithoutRetentionPeriod from '../filterCookiesWithoutRetentionPeriod';
import { frameFilteredCookies } from '../../constants';

describe('FilterCookiesWithoutRetentionPeriod:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(frameFilteredCookies, {}, '')
    ).toBe(frameFilteredCookies);
  });

  it('Should return cookies as if no cookies are passed', () => {
    expect(filterCookiesWithoutRetentionPeriod({}, {}, '')).toStrictEqual({});
  });

  it('Should return firstparty cookies', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['True']),
        },
        ''
      )
    ).toStrictEqual({
      LSOLH: frameFilteredCookies['LSOLH'],
      NID: frameFilteredCookies['NID'],
    });
  });

  it('Should return thirdparty cookies', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['False']),
        },
        ''
      )
    ).toStrictEqual({
      _parsely_session: frameFilteredCookies['_parsely_session'],
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
      _ga_7HKDVLRRV4: frameFilteredCookies['_ga_7HKDVLRRV4'],
      _ga: frameFilteredCookies['_ga'],
    });
  });

  it('Should return httponly cookies', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.httponly': new Set(['True']),
        },
        ''
      )
    ).toStrictEqual({
      NID: frameFilteredCookies['NID'],
    });
  });

  it('Should return firstparty cookies in result', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['False']),
        },
        '_parsely_session'
      )
    ).toStrictEqual({
      _parsely_session: frameFilteredCookies['_parsely_session'],
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });

  it('Should search for cookies', () => {
    expect(
      filterCookiesWithoutRetentionPeriod(frameFilteredCookies, {}, 'LSOLH')
    ).toStrictEqual({ LSOLH: frameFilteredCookies['LSOLH'] });
  });
});
