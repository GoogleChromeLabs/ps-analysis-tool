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

import calculateBlockedReasonsFilterValues from '../calculateBlockedReasonsFilterValues';

describe('calculateBlockedReasonsFilterValues', () => {
  it('should return an object with values calculated from the tabCookies', () => {
    // Arrange
    const tabCookies = [
      {
        blockedReasons: ['foo', 'bar'],
        frameIdList: [1, 2, 3],
      },
      {
        blockedReasons: ['foo', 'baz'],
        frameIdList: [1, 2, 3],
      },
      {
        blockedReasons: ['zee', 'zoo'],
      },
    ];

    const expected = {
      foo: {
        selected: false,
      },
      bar: {
        selected: false,
      },
      baz: {
        selected: false,
      },
    };
    const mockClearQuery = jest.fn();

    const result = calculateBlockedReasonsFilterValues(
      tabCookies,
      undefined,
      mockClearQuery
    );

    expect(result).toEqual(expected);
    expect(mockClearQuery).not.toHaveBeenCalled();

    const options = ['foo', 'bar'];

    const expectedWithSelected = {
      foo: {
        selected: true,
      },
      bar: {
        selected: true,
      },
      baz: {
        selected: false,
      },
    };

    const resultWithSelected = calculateBlockedReasonsFilterValues(
      tabCookies,
      options,
      mockClearQuery
    );

    expect(resultWithSelected).toEqual(expectedWithSelected);
    expect(mockClearQuery).toHaveBeenCalledTimes(1);
  });
});
