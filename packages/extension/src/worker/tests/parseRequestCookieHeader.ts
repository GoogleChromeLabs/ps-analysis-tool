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
import parseRequestCookieHeader from '../parseRequestCookieHeader';

describe('parseResponseCookieHeader', () => {
  it('Should parse all set-cookie header (response cookies)', () => {
    const parsedCookie = parseRequestCookieHeader(
      'https://example.com/public/api/alerts',
      'cookieKey1=value1; CookieKey2=value2; SpecialCookie=Special=Value',
      {}
    );

    expect(parsedCookie).toEqual([
      {
        parsedCookie: {
          name: 'cookieKey1',
          value: 'value1',
          domain: 'example.com',
        },
        analytics: null,
        url: 'https://example.com/public/api/alerts',
        headerType: 'request',
      },
      {
        parsedCookie: {
          name: 'CookieKey2',
          value: 'value2',
          domain: 'example.com',
        },
        analytics: null,
        url: 'https://example.com/public/api/alerts',
        headerType: 'request',
      },
      {
        parsedCookie: {
          name: 'SpecialCookie',
          value: 'Special=Value',
          domain: 'example.com',
        },
        analytics: null,
        url: 'https://example.com/public/api/alerts',
        headerType: 'request',
      },
    ]);
  });
});
