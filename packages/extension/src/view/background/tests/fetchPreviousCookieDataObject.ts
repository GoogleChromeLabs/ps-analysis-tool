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
import { findPreviousCookieDataObject } from '../findPreviousCookieDataObject';

describe('findPreviousCookieDataObject', () => {
  beforeAll(() => {
    //@ts-ignore
    globalThis.chrome = {
      storage: {
        //@ts-ignore
        local: {
          //@ts-ignore
          get: () => {
            throw Error('cannot get');
          },
        },
      },
    };
  });

  it('Should return null if cookie is not stored.', async () => {
    expect(await findPreviousCookieDataObject('478098564', '1P_JARS')).toBe(
      null
    );
  });
});
