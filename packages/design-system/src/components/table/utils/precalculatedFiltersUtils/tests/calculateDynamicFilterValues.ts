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

import calculateDynamicFilterValues from '../calculateDynamicFilterValues';

describe('calculateDynamicFilterValues', () => {
  it('should return an object with values calculated from the tabCookies', () => {
    // Arrange
    const tabCookies = [
      {
        keyToExtract: 'value1',
      },
      {
        keyToExtract: 'value2',
      },
      {
        keyToExtract: 'value3',
      },
    ];

    const expected = {
      value1: {
        selected: false,
      },
      value2: {
        selected: false,
      },
      value3: {
        selected: false,
      },
    };

    const mockClearQuery = jest.fn();

    // Act
    const result = calculateDynamicFilterValues(
      'keyToExtract',
      tabCookies,
      undefined,
      mockClearQuery
    );

    // Assert
    expect(result).toEqual(expected);
    expect(mockClearQuery).not.toHaveBeenCalled();

    const options = ['value1', 'value2'];

    const expectedWithSelected = {
      value1: {
        selected: true,
      },
      value2: {
        selected: true,
      },
      value3: {
        selected: false,
      },
    };

    // Act
    const resultWithSelected = calculateDynamicFilterValues(
      'keyToExtract',
      tabCookies,
      options,
      mockClearQuery
    );

    // Assert
    expect(resultWithSelected).toEqual(expectedWithSelected);
    expect(mockClearQuery).toHaveBeenCalledTimes(1);
  });
});
