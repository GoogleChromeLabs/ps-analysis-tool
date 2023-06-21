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
import parseResponseCookieHeader from '../parseResponseCookieHeader';

describe('parseResponseCookieHeader', () => {
  it('Should parse all set-cookie header (response cookies)', () => {
    const parsedCookie = parseResponseCookieHeader(
      'https://example.com/public/api/alerts',
      'https://example.com/',
      'countryCode=IN; Domain=.example.com; Path=/; SameSite=None; Secure'
    );

    expect(parsedCookie).toEqual({
      parsedCookie: {
        expires: 0,
        httponly: false,
        secure: true,
        path: '/',
        domain: '.example.com',
        samesite: 'None',
        name: 'countryCode',
        value: 'IN',
      },
      url: 'https://example.com/public/api/alerts',
      toplevel: 'https://example.com',
      headerType: 'response',
    });
  });
});
