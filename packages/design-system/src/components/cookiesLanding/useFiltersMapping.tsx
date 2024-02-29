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
import { useCallback, useMemo } from 'react';
import { useSidebar } from '@ps-analysis-tool/design-system';
import type { TabFrames } from '@ps-analysis-tool/common';

const useFiltersMapping = (tabFrames: TabFrames) => {
  const firstFrame = useMemo(
    () => Object.keys(tabFrames || {})?.[0] || '',
    [tabFrames]
  );

  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  const selectedItemUpdater = useCallback(
    (title: string, accessorKey?: string) => {
      const queryObject = accessorKey
        ? {
            [accessorKey]: [title],
          }
        : {};

      const modifiedQuery = {
        filter: {
          ...queryObject,
        },
      };

      updateSelectedItemKey(firstFrame, JSON.stringify(modifiedQuery));
    },
    [firstFrame, updateSelectedItemKey]
  );

  return { selectedItemUpdater };
};

export default useFiltersMapping;
