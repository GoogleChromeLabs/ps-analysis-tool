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
import filterCookiesWithRetentionPeriod from '../filterCookiesWithRetentionPeriod';
import { frameFilteredCookies } from '../../../../../../utils/test-data/frameFilteredCookies';

describe('FilterCookiesWithoutRetentionPeriod:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(filterCookiesWithRetentionPeriod(frameFilteredCookies, {}, '')).toBe(
      frameFilteredCookies
    );
  });

  it('Should return cookies as if no cookies are passed', () => {
    expect(filterCookiesWithRetentionPeriod({}, {}, '')).toStrictEqual({});
  });

  it('Should return cookies which are going to expire in Short Term (< 24h)', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Short Term (< 24h)']),
        },
        ''
      )
    ).toStrictEqual({
      _parsely_session: frameFilteredCookies['_parsely_session'],
    });
  });

  it('Should return Session cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Session']),
        },
        ''
      )
    ).toStrictEqual({
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });

  it('Should return nothing for Medium Term (24h - 1 week) cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Medium Term (24h - 1 week)']),
        },
        ''
      )
    ).toStrictEqual({});
  });

  it('Should return nothing for Long Term (1 week - 1 month) cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Long Term (1 week - 1 month)']),
        },
        ''
      )
    ).toStrictEqual({});
  });

  it('Should return nothing for Extended Term (> 1 month) cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Extended Term (> 1 month)']),
        },
        ''
      )
    ).toStrictEqual({
      LSOLH: frameFilteredCookies['LSOLH'],
      NID: frameFilteredCookies['NID'],
      _ga: frameFilteredCookies['_ga'],
      _ga_7HKDVLRRV4: frameFilteredCookies['_ga_7HKDVLRRV4'],
    });
  });

  it('Should search for cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set(['Session']),
        },
        '_parsely_session_expiry'
      )
    ).toStrictEqual({
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });
});
