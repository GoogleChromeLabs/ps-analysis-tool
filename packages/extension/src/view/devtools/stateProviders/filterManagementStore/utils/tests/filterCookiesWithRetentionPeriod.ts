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
import { frameFilteredCookies } from '../../constants';

describe('FilterCookiesWithoutRetentionPeriod:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(filterCookiesWithRetentionPeriod(frameFilteredCookies, {}, '')).toBe(
      frameFilteredCookies
    );
  });

  it('Should return cookies as if no cookies are passed', () => {
    expect(filterCookiesWithRetentionPeriod({}, {}, '')).toStrictEqual({});
  });

  it('Should return cookies which are going to expire in less than a day', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          retentionPeriod: new Set(['less than a day']),
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
          retentionPeriod: new Set(['Session']),
        },
        ''
      )
    ).toStrictEqual({
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });

  it('Should return nothing for a day to a week cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          retentionPeriod: new Set(['a day to a week']),
        },
        ''
      )
    ).toStrictEqual({});
  });

  it('Should return nothing for a week to a month cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          retentionPeriod: new Set(['a week to a month']),
        },
        ''
      )
    ).toStrictEqual({});
  });

  it('Should return nothing for more than a month cookies', () => {
    expect(
      filterCookiesWithRetentionPeriod(
        frameFilteredCookies,
        {
          retentionPeriod: new Set(['more than a month']),
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
          retentionPeriod: new Set(['Session']),
        },
        '_parsely_session_expiry'
      )
    ).toStrictEqual({
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });
});
