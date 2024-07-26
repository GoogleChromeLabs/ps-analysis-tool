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

import evaluateStaticFilterValues from '../evaluateStaticFilterValues';

describe('evaluateSelectAllOption', () => {
  it('should return filter values based on the parsed query', () => {
    // Arrange
    const filterKey = 'isFioo';
    const parsedQuery = {
      filter: {
        isFioo: ['Option1', 'Option2'],
      },
    };
    const clearActivePanelQuery = jest.fn();
    const staticValues = {
      Option1: { selected: false },
      Option2: { selected: false },
      Option3: { selected: false },
    };

    // Arrange
    const result1 = evaluateStaticFilterValues(
      staticValues,
      filterKey,
      {},
      clearActivePanelQuery
    );

    // Assert
    expect(result1).toEqual({
      Option1: { selected: false },
      Option2: { selected: false },
      Option3: { selected: false },
    });
    expect(clearActivePanelQuery).not.toHaveBeenCalled();

    // Act
    const result2 = evaluateStaticFilterValues(
      staticValues,
      filterKey,
      parsedQuery,
      clearActivePanelQuery
    );

    // Assert
    expect(result2).toEqual({
      Option1: { selected: true },
      Option2: { selected: true },
      Option3: { selected: false },
    });
    expect(clearActivePanelQuery).toHaveBeenCalled();
  });
});
