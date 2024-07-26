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
import { useCallback, useEffect } from 'react';

/**
 * Internal dependencies.
 */
import { PersistentStorageData, TableFilter } from '../../types';

const useFiltersOptions = (
  setSelectAllFilterSelection: React.Dispatch<
    React.SetStateAction<{ [filterKey: string]: { selected: boolean | null } }>
  >,
  setFilters: React.Dispatch<React.SetStateAction<TableFilter>>,
  options: React.MutableRefObject<PersistentStorageData['selectedFilters']>,
  isDataLoading: boolean
) => {
  const runOptionsOnSelectAllFilters = useCallback(() => {
    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.keys(newSelectAllFilterSelection).forEach((filterKey) => {
        const savedFilters = options.current?.[filterKey];
        const isSelectAllSelected = savedFilters?.All?.selected;

        if (!isSelectAllSelected) {
          return;
        }

        newSelectAllFilterSelection[filterKey].selected = true;
      });

      return newSelectAllFilterSelection;
    });
  }, [options, setSelectAllFilterSelection]);

  const runOptionsOnFilters = useCallback(() => {
    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          const savedFilterValues = options.current?.[filterKey];
          const filterValues = filter.filterValues || {};

          if (!Object.keys(savedFilterValues || {}).length) {
            return [filterKey, { ...filter, filterValues }];
          }

          Object.entries(savedFilterValues || {}).forEach(
            ([filterValue, filterValueData]) => {
              if (filterValue === 'All') {
                return;
              }

              filterValues[filterValue] = {
                ...filterValueData,
              };
            }
          );

          return [filterKey, { ...filter, filterValues }];
        })
      )
    );
  }, [options, setFilters]);

  // use stored filters to set selected state
  useEffect(() => {
    if (isDataLoading) {
      return;
    }

    runOptionsOnSelectAllFilters();
    runOptionsOnFilters();
  }, [isDataLoading, runOptionsOnFilters, runOptionsOnSelectAllFilters]);
};

export default useFiltersOptions;
