/*
 * Copyright 2025 Google LLC
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
import mergeUnique2DArrays from '../mergeUnique2DArrays';

describe('mergeUnique2DArrays', () => {
  it('should merge two 2D arrays and return unique inner arrays', () => {
    const arr1 = [
      [1, 2],
      [3, 4],
    ];
    const arr2 = [
      [3, 4],
      [5, 6],
    ];
    const result = mergeUnique2DArrays(arr1, arr2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should return an empty array when both inputs are empty', () => {
    const arr1: any[][] = [];
    const arr2: any[][] = [];
    const result = mergeUnique2DArrays(arr1, arr2);
    expect(result).toEqual([]);
  });

  it('should handle cases where one array is empty', () => {
    const arr1 = [
      [1, 2],
      [3, 4],
    ];
    const arr2: any[][] = [];
    const result = mergeUnique2DArrays(arr1, arr2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });

  it('should handle arrays with duplicate inner arrays within the same input', () => {
    const arr1 = [
      [1, 2],
      [1, 2],
      [3, 4],
    ];
    const arr2 = [
      [3, 4],
      [5, 6],
    ];
    const result = mergeUnique2DArrays(arr1, arr2);
    expect(result).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should handle arrays with complex inner arrays', () => {
    const arr1 = [[{ a: 1 }], [{ b: 2 }]];
    const arr2 = [[{ b: 2 }], [{ c: 3 }]];
    const result = mergeUnique2DArrays(arr1, arr2);
    expect(result).toEqual([[{ a: 1 }], [{ b: 2 }], [{ c: 3 }]]);
  });

  it('should not modify the original arrays', () => {
    const arr1 = [
      [1, 2],
      [3, 4],
    ];
    const arr2 = [
      [3, 4],
      [5, 6],
    ];
    const arr1Copy = JSON.parse(JSON.stringify(arr1));
    const arr2Copy = JSON.parse(JSON.stringify(arr2));
    mergeUnique2DArrays(arr1, arr2);
    expect(arr1).toEqual(arr1Copy);
    expect(arr2).toEqual(arr2Copy);
  });
});
