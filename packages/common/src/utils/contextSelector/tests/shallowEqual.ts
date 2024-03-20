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
 * External dependencies
 */

/**
 * Internal dependencies
 */
import { shallowEqual } from '../shallowEqual';

describe('shallowEqual', () => {
  it('should return true if the objects are equal', () => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: 2 };
    expect(shallowEqual(a, b)).toBe(true);
  });

  it('should return false if the objects are not equal', () => {
    const a = { a: 1, b: 2 };
    const b = { a: 1, b: 3 };
    expect(shallowEqual(a, b)).toBe(false);
  });

  it('should return true if the arrays are equal', () => {
    const a = [1, 2, 3];
    const b = [1, 2, 3];
    expect(shallowEqual(a, b)).toBe(true);
  });

  it('should return false if the arrays are not equal', () => {
    const a = [1, 2, 3];
    const b = [1, 2, 4];
    expect(shallowEqual(a, b)).toBe(false);
  });

  it('should return true if the arrays of objects are equal', () => {
    const a = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    const b = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    expect(shallowEqual(a, b)).toBe(true);
  });

  it('should return false if the arrays of objects are not equal', () => {
    const a = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    const b = [
      { a: 1, b: 2 },
      { a: 3, b: 5 },
    ];
    expect(shallowEqual(a, b)).toBe(false);
  });

  it('should return false if the arrays of objects are not equal', () => {
    const a = [
      { a: 1, b: 2 },
      { a: 3, b: 4 },
    ];
    const b = [
      { a: 1, b: 2 },
      { a: 3, b: 5 },
    ];
    expect(shallowEqual(a, b)).toBe(false);
  });
});
