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

import { TabFrames } from '@ps-analysis-tool/common';
import { renderHook } from '@testing-library/react';
import useFiltersMapping from '../useFiltersMapping';
import { useSidebar } from '../../sidebar/useSidebar';

jest.mock('../../sidebar/useSidebar', () => ({
  useSidebar: jest.fn(),
}));
const mockUseSidebar = useSidebar as jest.Mock;

describe('useFiltersMapping', () => {
  it('shoule return correct query object', () => {
    // Arrange
    const tabFrames = {
      frame1: {
        frameIds: [],
      },
      frame2: {
        frameIds: [],
      },
    } as TabFrames;
    const updateSelectedItemKey = jest.fn();

    mockUseSidebar.mockReturnValue(updateSelectedItemKey);

    // Act
    const { result } = renderHook(() => useFiltersMapping(tabFrames));

    // Assert
    expect(result.current.selectedItemUpdater).toBeDefined();

    // Act
    result.current.selectedItemUpdater('title', 'accessorKey');

    // Assert
    expect(updateSelectedItemKey).toHaveBeenCalledWith(
      'frame1',
      '{"filter":{"accessorKey":["title"]}}'
    );

    // Act
    result.current.selectedItemUpdater('title');

    // Assert
    expect(updateSelectedItemKey).toHaveBeenCalledWith(
      'frame1',
      '{"filter":{}}'
    );
  });
});
