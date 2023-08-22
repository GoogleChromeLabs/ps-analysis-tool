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
import { frameFilteredCookies } from '../../../../../../utils/test-data/frameFilteredCookies';
import filterCookiesWithMapping from '../filterCookiesWithMapping';

describe('FilterCookiesWithoutRetentionPeriod:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(filterCookiesWithMapping(frameFilteredCookies, {}, '')).toBe(
      frameFilteredCookies
    );
  });

  it('Should return cookies as if no cookies are passed', () => {
    expect(filterCookiesWithMapping({}, {}, '')).toStrictEqual({});
  });

  it('Should return firstparty cookies', () => {
    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['First Party']),
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

  it('Should return thirdparty cookies', () => {
    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['Third Party']),
        },
        ''
      )
    ).toStrictEqual({
      LSOLH: frameFilteredCookies['LSOLH'],
      NID: frameFilteredCookies['NID'],
    });
  });

  it('Should return httponly cookies', () => {
    expect(
      filterCookiesWithMapping(
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

  it('Should return SameSite cookies', () => {
    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          'parsedCookie.samesite': new Set(['None']),
        },
        ''
      )
    ).toStrictEqual({
      LSOLH: frameFilteredCookies['LSOLH'],
      NID: frameFilteredCookies['NID'],
    });

    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          'parsedCookie.samesite': new Set(['Lax']),
        },
        ''
      )
    ).toStrictEqual({});

    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          'parsedCookie.samesite': new Set(['Strict']),
        },
        ''
      )
    ).toStrictEqual({});
  });

  it('Should return firstparty cookies in result and search for cookies with _parsely_session', () => {
    expect(
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          isFirstParty: new Set(['First Party', 'Third Party']),
        },
        '_parsely_session'
      )
    ).toStrictEqual({
      _parsely_session: frameFilteredCookies['_parsely_session'],
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });
});

describe('FilterCookiesWithoutRetentionPeriod:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(filterCookiesWithMapping(frameFilteredCookies, {}, '')).toBe(
      frameFilteredCookies
    );
  });

  it('Should return cookies as if no cookies are passed', () => {
    expect(filterCookiesWithMapping({}, {}, '')).toStrictEqual({});
  });

  it('Should return cookies which are going to expire in Short Term (< 24h)', () => {
    expect(
      filterCookiesWithMapping(
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
      filterCookiesWithMapping(
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
      filterCookiesWithMapping(
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
      filterCookiesWithMapping(
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
      filterCookiesWithMapping(
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
      filterCookiesWithMapping(
        frameFilteredCookies,
        {
          'parsedCookie.expires': new Set([
            'Session',
            'Extended Term (> 1 month)',
          ]),
        },
        '_parsely_session_expiry'
      )
    ).toStrictEqual({
      _parsely_session_expiry: frameFilteredCookies['_parsely_session_expiry'],
    });
  });
});
