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
import { frameFilteredCookies } from './testUtils';

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
      _parsely_session: {
        analytics: {
          category: '',
          dataController: '',
          description: '',
          domain: '',
          gdprUrl: '',
          name: '',
          platform: '',
          retention: '',
          wildcard: '',
        },
        frameIdList: [0],
        headerType: 'request',
        isFirstParty: true,
        parsedCookie: {
          domain: '.rtcamp.com',
          expires: '2023-08-17T10:05:20.000Z',
          httponly: false,
          name: '_parsely_session',
          path: '/',
          samesite: '',
          secure: false,
          value:
            '{%22sid%22:8%2C%22surl%22:%22https://rtcamp.com/%22%2C%22sref%22:%22%22%2C%22sts%22:1692264828254%2C%22slts%22:1692261902478}',
        },
        url: 'https://rtcamp.com/wp-content/mu-plugins/jetpack-12.4/css/jetpack.css?ver=12.4',
        isCookieSet: false,
      },
    });
  });
});
