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
import mergeDeep from '../mergeDeep';

describe('mergeDeep', () => {
  it('merges two objects deeply', () => {
    const target = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
      },
    };
    const source = {
      a: 2,
      c: {
        e: 5,
        f: 6,
      },
    };
    const result = {
      a: 2,
      b: 2,
      c: {
        d: 3,
        e: 5,
        f: 6,
      },
    };

    expect(mergeDeep(target, source)).toEqual(result);
  });

  it('merges two objects deeply with nested arrays', () => {
    const target = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
        f: [1, 2, 3],
      },
    };
    const source = {
      a: 2,
      c: {
        e: 5,
        f: [4, 5, 6],
      },
    };
    const result = {
      a: 2,
      b: 2,
      c: {
        d: 3,
        e: 5,
        f: [4, 5, 6],
      },
    };

    expect(mergeDeep(target, source)).toEqual(result);
  });
});
