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
import { renderHook } from '@testing-library/react';
import SinonChrome from 'sinon-chrome';

/**
 * Internal dependencies.
 */
import * as mock from '../../../../../../../utils/test-data/cookieMockData';
import useHighlighting from '../useHighlighting';

describe('useHighlighting', () => {
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

  it('should call setTableData with the correct values', () => {
    let nextState;
    const mockSetTableData = jest.fn().mockImplementation((callback) => {
      nextState = callback(mock.default.tabCookies);
    });

    renderHook(() =>
      useHighlighting(mock.default.tabCookies, mockSetTableData)
    );

    expect(nextState['KRTBCOOKIE_290.pubmatic.com']).toEqual(
      expect.objectContaining(mock.default.tabCookies['KRTBCOOKIE_290'])
    );
  });
});
