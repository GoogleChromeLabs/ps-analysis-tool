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

/*
 * Internal dependencies
 */
import { checkIbcCompliance } from '../checkIbcCompliance';

describe('checkIbcCompliance', () => {
  beforeAll(() => {
    //@ts-ignore
    globalThis.chrome = {
      cookies: {
        //@ts-ignore
        get: () => {
          return true;
        },
      },
    };
  });
  it('Should work with no samesite attribute', async () => {
    const isIbcCompliant = await checkIbcCompliance(
      undefined,
      undefined,
      'cookieName',
      'https://example.com'
    );

    expect(isIbcCompliant).toBeTruthy();
  });

  it('Should work with no samesite set to none', async () => {
    const isIbcCompliant = await checkIbcCompliance(
      'none',
      undefined,
      'cookieName',
      'https://example.com'
    );

    expect(isIbcCompliant).toBeFalsy();
  });

  it('Should work with no samesite set to none and secure attribute', async () => {
    const isIbcCompliant = await checkIbcCompliance(
      'none',
      true,
      'cookieName',
      'https://example.com'
    );

    expect(isIbcCompliant).toBeTruthy();
  });

  it('Should work with no samesite set to none and secure attribute', async () => {
    const isIbcCompliant = await checkIbcCompliance(
      'none',
      true,
      'cookieName',
      'https://example.com'
    );

    expect(isIbcCompliant).toBeTruthy();
  });
});
