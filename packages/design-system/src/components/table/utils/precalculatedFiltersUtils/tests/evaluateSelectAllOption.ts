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

import { I18n } from '@google-psat/i18n';
import evaluateSelectAllOption from '../evaluateSelectAllOption';

describe('evaluateSelectAllOption', () => {
  beforeAll(() => {
    globalThis.chrome.i18n = null;

    I18n.initMessages({
      selectAll: {
        message: 'All',
      },
    });
  });

  it('should return true if the first option is "All"', () => {
    // Arrange
    const filterKey = 'blockedReasons';
    const parsedQuery = {
      filter: {
        blockedReasons: ['All'],
      },
    };
    const clearActivePanelQuery = jest.fn();

    const result = evaluateSelectAllOption(
      filterKey,
      {},
      clearActivePanelQuery
    );

    // Assert
    expect(result).toBe(false);
    expect(clearActivePanelQuery).not.toHaveBeenCalled();

    // Act
    const result2 = evaluateSelectAllOption(
      filterKey,
      parsedQuery,
      clearActivePanelQuery
    );

    // Assert
    expect(result2).toBe(true);
    expect(clearActivePanelQuery).toHaveBeenCalled();
  });
});
