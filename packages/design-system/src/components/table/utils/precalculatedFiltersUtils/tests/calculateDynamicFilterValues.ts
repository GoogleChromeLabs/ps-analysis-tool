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
import { BlockedReason } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import calculateDynamicFilterValues from '../calculateDynamicFilterValues';

describe('calculateDynamicFilterValues', () => {
  it('should return an object with values calculated from the tabCookies', () => {
    // Arrange
    const tabCookies = [
      {
        parsedCookie: {
          name: 'countryCode',
          domain: 'cnn.com',
          path: '/',
          value: 'IN',
          sameSite: 'None',
          expires: 'Session',
          httpOnly: false,
          secure: true,
        },
        url: '',
        blockedReasons: ['DomainMismatch'] as BlockedReason[],
        frameIdList: [1, 2, 3],
      },
      {
        parsedCookie: {
          name: 'countryCode',
          domain: '.cnn.com',
          path: '/',
          value: 'IN',
          sameSite: 'None',
          expires: 'Session',
          httpOnly: false,
          secure: true,
        },
        url: '',
        blockedReasons: ['SameSiteUnspecifiedTreatedAsLax'] as BlockedReason[],
        frameIdList: [1, 2, 3],
      },
      {
        parsedCookie: {
          name: 'countryCode',
          domain: '.cnn.com',
          path: '/',
          value: 'IN',
          sameSite: 'None',
          expires: 'Session',
          httpOnly: false,
          secure: true,
        },
        url: '',
        blockedReasons: [
          'ThirdPartyPhaseout',
          'DomainMismatch',
        ] as BlockedReason[],
        frameIdList: [],
      },
    ];

    const expected = {
      'cnn.com': {
        selected: false,
      },
      '.cnn.com': {
        selected: false,
      },
    };

    const mockClearQuery = jest.fn();

    // Act
    const result = calculateDynamicFilterValues(
      'parsedCookie.domain',
      tabCookies,
      //@ts-ignore
      undefined,
      mockClearQuery
    );

    // Assert
    expect(result).toEqual(expected);
    expect(mockClearQuery).not.toHaveBeenCalled();

    const options = ['cnn.com', '.cnn.com'];

    const expectedWithSelected = {
      'cnn.com': {
        selected: true,
      },
      '.cnn.com': {
        selected: true,
      },
    };

    // Act
    const resultWithSelected = calculateDynamicFilterValues(
      'parsedCookie.domain',
      tabCookies,
      options,
      mockClearQuery
    );

    // Assert
    expect(resultWithSelected).toEqual(expectedWithSelected);
    expect(mockClearQuery).toHaveBeenCalledTimes(1);
  });
});
