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
import { BlockedReason, CookieData } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import calculateExemptionReason from '../calculateExemptionReasons';

describe('calculateExemptionReason', () => {
  it('should no exemption reasons', () => {
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
        exemptionReason: 'None' as CookieData['exemptionReason'],
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
        exemptionReason: 'TPCDHeuristics' as CookieData['exemptionReason'],
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
        blockedReasons: ['DomainMismatch'] as BlockedReason[],
        frameIdList: [],
        exemptionReason: 'UserSettings' as CookieData['exemptionReason'],
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

  it('should return unique set of exemption reason.', () => {
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
        exemptionReason: 'None' as CookieData['exemptionReason'],
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
        exemptionReason: 'TPCDHeuristics' as CookieData['exemptionReason'],
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
        blockedReasons: ['DomainMismatch'] as BlockedReason[],
        frameIdList: [],
        exemptionReason: 'UserSettings' as CookieData['exemptionReason'],
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
