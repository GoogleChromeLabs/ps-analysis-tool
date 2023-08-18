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
import filterCookies from '../filterCookies';
import { frameFilteredCookies } from '../../../../../../test-utils/constants';

describe('FilterCookies:', () => {
  it('Should return cookies as is if no filter is selected', () => {
    expect(filterCookies(frameFilteredCookies, {}, '')).toBe(
      frameFilteredCookies
    );
  });

  it('Should return cookies with only those whose retention period is filter passing.', () => {
    expect(
      filterCookies(
        frameFilteredCookies,
        {
          retentionPeriod: new Set<string>(['less than a day']),
        },
        ''
      )
    ).toStrictEqual({
      _parsely_session: frameFilteredCookies['_parsely_session'],
    });
  });

  it('Should return cookies with only those whose filter except retention period is set.', () => {
    expect(
      filterCookies(
        frameFilteredCookies,
        {
          'analytics.category': new Set<string>(['Analytics']),
        },
        ''
      )
    ).toStrictEqual({
      _ga: frameFilteredCookies['_ga'],
      _ga_7HKDVLRRV4: frameFilteredCookies['_ga_7HKDVLRRV4'],
    });
  });

  it('Should return cookies with only those whose retention period and other filter is set.', () => {
    expect(
      filterCookies(
        frameFilteredCookies,
        {
          'analytics.category': new Set<string>(['Analytics']),
          retentionPeriod: new Set<string>(['more than a month']),
        },
        ''
      )
    ).toStrictEqual({
      _ga: frameFilteredCookies['_ga'],
      _ga_7HKDVLRRV4: frameFilteredCookies['_ga_7HKDVLRRV4'],
    });
  });

  it('Should search for cookie using name.', () => {
    expect(filterCookies(frameFilteredCookies, {}, 'LSOLH')).toStrictEqual({
      LSOLH: frameFilteredCookies['LSOLH'],
    });
  });
});
