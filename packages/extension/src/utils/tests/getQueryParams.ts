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
import getQueryParams from '../getQueryParams';

describe('Test getQueryParams', () => {
  test('should return empty params object if no URL string is provided', () => {
    const params = getQueryParams('');

    expect(params).toEqual({
      psat_cdp: '',
      psat_multitab: '',
    });
  });

  test('should return params object with values extracted from the URL string', () => {
    const urlString = 'https://example.com/?psat_cdp=on&psat_multitab=on';
    const params = getQueryParams(urlString);

    expect(params).toEqual({
      psat_cdp: 'on',
      psat_multitab: 'on',
    });
  });

  test('should return default params if URL string is invalid', () => {
    const urlString = 'invalid_url';
    const params = getQueryParams(urlString);

    expect(params).toEqual({
      psat_cdp: '',
      psat_multitab: '',
    });
  });
});
