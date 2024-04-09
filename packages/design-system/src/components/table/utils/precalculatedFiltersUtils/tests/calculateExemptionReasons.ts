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

import calculateExemptionReason from '../calculateExemptionReasons';

describe('calculateExemptionReason', () => {
  it('should no exemption reasons', () => {
    const tabCookies = [
      {
        exemptionReason: 'None',
      },
      {
        exemptionReason: 'None',
      },
      {
        exemptionReason: 'None',
      },
    ];

    const expected = {};

    const clearActivePanelQuery = jest.fn();

    const result = calculateExemptionReason(tabCookies, clearActivePanelQuery);

    // Assert
    expect(result).toStrictEqual(expected);
    expect(clearActivePanelQuery).not.toHaveBeenCalled();
  });

  it('should return unique set of exemption reason.', () => {
    const tabCookies = [
      {
        exemptionReason: 'UserSettings',
      },
      {
        exemptionReason: 'TPCDHeuristics',
      },
      {
        exemptionReason: 'None',
      },
    ];

    const expected = {
      UserSettings: {
        selected: false,
      },
      TPCDHeuristics: {
        selected: false,
      },
    };

    const clearActivePanelQuery = jest.fn();

    const result = calculateExemptionReason(tabCookies, clearActivePanelQuery);

    // Assert
    expect(result).toStrictEqual(expected);
    expect(clearActivePanelQuery).not.toHaveBeenCalled();
  });
});
