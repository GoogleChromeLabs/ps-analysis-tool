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
 * Internal dependencies.
 */
import canProcessCookies from '../canProcessCookies';

describe('CanProcessCookies : ', () => {
  it('Should return false if tabUrl or responseHeaders is not present', () => {
    expect(
      canProcessCookies('unlimited', 'https://bbc.com', '', 123424, undefined)
    ).toBe(false);

    expect(
      canProcessCookies('unlimited', null, '', 123424, [
        { name: 'url', value: 'https://bbc.com' },
      ])
    ).toBe(false);
  });

  it('Should return false if mode is single and tabToRead is different from currentTabId', () => {
    expect(
      canProcessCookies(
        'single',
        'https://bbc.com',
        '123548',
        123424,
        undefined
      )
    ).toBe(false);
  });

  it('Should return false if tabUrl is a chrome new tab url', () => {
    expect(
      canProcessCookies('single', 'chrome://newtab/', '123424', 123424, [
        { name: 'url', value: 'chrome://newtab/' },
      ])
    ).toBe(false);
  });

  it('Should return true if tabmode is single and tabToRead is same as currentTabId', () => {
    expect(
      canProcessCookies('single', 'https://bbc.com', '123424', 123424, [
        { name: 'url', value: 'https://bbc.com' },
      ])
    ).toBe(true);
  });

  it('Should return true if tabmode is unlimited', () => {
    expect(
      canProcessCookies('unlimited', 'https://bbc.com', '', 123424, [
        { name: 'url', value: 'https://bbc.com' },
      ])
    ).toBe(true);
  });
});
