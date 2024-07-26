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
 * External dependencies.
 */
import React from 'react';
import SinonChrome from 'sinon-chrome';
import { renderHook } from '@testing-library/react';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import useCookieListing from '..';
import * as mock from '../../../../../../../utils/test-data/cookieMockData';
import { useCookie } from '../../../../../stateProviders/cookie';

jest.mock('../../../../../stateProviders/cookie', () => ({
  useCookie: jest.fn(),
}));

const mockUseCookieStore = useCookie as jest.Mock;

describe('useCookieListing', () => {
  const mockUseEffect = jest.fn();
  jest.spyOn(React, 'useEffect').mockImplementation(mockUseEffect);

  globalThis.chrome = {
    ...(SinonChrome as unknown as typeof chrome),
    storage: {
      // @ts-ignore
      session: {
        // @ts-ignore
        onChanged: {
          addListener: () => undefined,
          removeListener: () => undefined,
        },
      },
    },
  };

  globalThis.chrome.i18n = null;

  I18n.initMessages({
    name: {
      message: 'Name',
    },
    scope: {
      message: 'Scope',
    },
    firstParty: {
      message: 'First Party',
    },
    category: {
      message: 'Category',
    },
    marketing: {
      message: 'Marketing',
    },
    uncategorized: {
      message: 'Uncategorized',
    },
    true: {
      message: 'True',
    },
    session: {
      message: 'Session',
    },
    shortTerm: {
      message: 'Short Term (< 24h)',
    },
    mediumTerm: {
      message: 'Medium Term (24h - 1 week)',
    },
    longTerm: {
      message: 'Long Term (1 week - 1 month)',
    },
    extentedTerm: {
      message: 'Extended Term (>1 month)',
    },
  });

  it('should return the correct values', () => {
    mockUseCookieStore.mockReturnValue({
      cookies: Object.values(mock.default.tabCookies),
      selectedFrame: '',
    });

    const { result, rerender } = renderHook(() =>
      useCookieListing(new Set<string>())
    );

    expect(result.current.tableColumns[0].header).toBe('Name');
    expect(result.current.tableColumns[1].header).toBe('Scope');
    const stringifiedCell = JSON.stringify(
      result.current.tableColumns[1].cell(true)
    );
    expect(stringifiedCell).toMatch(/\bFirst Party\b/);

    expect(result.current.filters['analytics.category'].title).toBe('Category');
    expect(
      result.current.filters['analytics.category'].hasPrecalculatedFilterValues
    ).toBe(true);
    expect(result.current.filters['analytics.category'].filterValues).toEqual({
      Marketing: {
        selected: false,
      },
      Uncategorized: {
        selected: false,
      },
    });
    expect(
      result.current.filters['isFirstParty'].comparator(true, 'First Party')
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.httponly'].comparator(true, 'True')
    ).toBe(true);

    expect(
      result.current.filters['parsedCookie.expires'].comparator(
        'Session',
        'Session'
      )
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.expires'].comparator(
        // 2 hours ahead in utc
        new Date(new Date().getTime() + 7200000).toUTCString(),
        'Short Term (< 24h)'
      )
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.expires'].comparator(
        // 2 days ahead
        new Date(new Date().getTime() + 172800000).toUTCString(),
        'Medium Term (24h - 1 week)'
      )
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.expires'].comparator(
        // 2 weeks ahead
        new Date(new Date().getTime() + 1209600000).toUTCString(),
        'Long Term (1 week - 1 month)'
      )
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.expires'].comparator(
        // 2 months ahead
        new Date(new Date().getTime() + 5184000000).toUTCString(),
        'Extended Term (>1 month)'
      )
    ).toBe(true);

    expect(
      result.current.filters['headerType'].comparator('javascript', 'JS')
    ).toBe(true);
    expect(
      result.current.filters['headerType'].comparator('response', 'HTTP')
    ).toBe(true);

    expect(
      result.current.filters['parsedCookie.samesite'].comparator(
        'Strict',
        'Strict'
      )
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.samesite'].comparator('Lax', 'Lax')
    ).toBe(true);
    expect(
      result.current.filters['parsedCookie.samesite'].comparator('None', 'None')
    ).toBe(true);

    expect(result.current.searchKeys).toEqual([
      'parsedCookie.name',
      'parsedCookie.domain',
    ]);

    expect(result.current.tablePersistentSettingsKey).toBe('cookieListing');

    mockUseCookieStore.mockReturnValue({
      cookies: [],
      selectedFrame: mock.default.selectedFrame,
    });

    rerender();

    expect(result.current.tablePersistentSettingsKey).toBe(
      'cookieListing#https://edition.cnn.com/'
    );
  });
});
