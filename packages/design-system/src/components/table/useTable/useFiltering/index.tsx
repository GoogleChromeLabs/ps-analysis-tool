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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getValueByKey } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { PersistentStorageData, TableData, TableFilter } from '../types';
import {
  useFiltersExtraction,
  useFiltersOptions,
  useFiltersPersistence,
} from './hooks';

export type TableFilteringOutput = {
  filters: TableFilter;
  selectedFilters: TableFilter;
  filteredData: TableData[];
  isFiltering: boolean;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean
  ) => void;
  toggleSelectAllFilter: (
    filterKey: string,
    isSingleFilterRemovalAction?: boolean
  ) => void;
  isSelectAllFilterSelected: (filterKey: string) => boolean;
  resetFilters: () => void;
};

const useFiltering = (
  data: TableData[],
  tableFilterData: TableFilter | undefined,
  specificTablePersistentSettingsKey?: string,
  genericTablePersistentSettingsKey?: string
): TableFilteringOutput => {
  const [filters, setFilters] = useState<TableFilter>({
    ...(tableFilterData || {}),
  });
  const options = useRef<PersistentStorageData['selectedFilters']>({});
  const [selectAllFilterSelection, setSelectAllFilterSelection] = useState<{
    [accessorKey: string]: { selected: boolean | null };
  }>({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  // extract saved filters from persistent storage
  useFiltersPersistence(
    filters,
    options,
    selectAllFilterSelection,
    setIsDataLoading,
    specificTablePersistentSettingsKey,
    genericTablePersistentSettingsKey
  );

  // run options on filters to update filter values
  useFiltersOptions(
    setSelectAllFilterSelection,
    setFilters,
    options,
    isDataLoading
  );

  // extract filters from data
  useFiltersExtraction(
    data,
    tableFilterData,
    options,
    selectAllFilterSelection,
    setFilters,
    setSelectAllFilterSelection
  );

  const isSelectAllFilterSelected = useCallback(
    (filterKey: string) => {
      return Boolean(selectAllFilterSelection?.[filterKey]?.selected);
    },
    [selectAllFilterSelection]
  );

  const toggleSelectAllFilter = useCallback(
    (filterKey: string, isSingleFilterRemovalAction?: boolean) => {
      let valueToSet = false;
      setSelectAllFilterSelection((prev) => {
        const newSelectAllFilterSelection = { ...prev };

        newSelectAllFilterSelection[filterKey] = {
          selected: !newSelectAllFilterSelection[filterKey].selected,
        };

        valueToSet = Boolean(newSelectAllFilterSelection[filterKey].selected);

        return newSelectAllFilterSelection;
      });

      if (isSingleFilterRemovalAction) {
        return;
      }

      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const filterValues = newFilters[filterKey].filterValues || {};

        Object.entries(filterValues).forEach(([filterValue]) => {
          filterValues[filterValue].selected = valueToSet;
        });

        return newFilters;
      });
    },
    []
  );

  const toggleFilterSelection = useCallback(
    (filterKey: string, filterValue: string, isRemovalAction?: boolean) => {
      if (selectAllFilterSelection?.[filterKey]?.selected) {
        toggleSelectAllFilter(filterKey, isRemovalAction);
      }

      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const filterValues = newFilters[filterKey].filterValues || {};

        if (filterValues[filterValue]) {
          filterValues[filterValue].selected = isRemovalAction
            ? false
            : !filterValues[filterValue].selected;
        }

        return newFilters;
      });
    },
    [selectAllFilterSelection, toggleSelectAllFilter]
  );

  const resetFilters = useCallback(() => {
    setSelectAllFilterSelection((prev) => {
      const newSelectAllFilterSelection = { ...prev };

      Object.entries(newSelectAllFilterSelection).forEach(
        ([filterKey, filterValueData]) => {
          newSelectAllFilterSelection[filterKey] = {
            ...filterValueData,
            selected: false,
          };
        }
      );

      return newSelectAllFilterSelection;
    });

    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      Object.entries(newFilters).forEach(([, filter]) => {
        const filterValues = filter.filterValues || {};

        Object.keys(filterValues).forEach((filterValue) => {
          filterValues[filterValue].selected = false;
        });
      });

      return newFilters;
    });
  }, []);

  const selectedFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).map(([filterKey, filter]) => {
          const filterValues = Object.fromEntries(
            Object.entries(filter.filterValues || {}).filter(
              ([, filterValueData]) => filterValueData.selected
            )
          );

          return [filterKey, { ...filter, filterValues }];
        })
      ),
    [filters]
  );

  const filteredData = useMemo<TableData[]>(() => {
    if (isDataLoading) {
      return [];
    }

    if (
      Object.values(selectedFilters).every(
        (filter) => Object.keys(filter.filterValues || {}).length === 0
      )
    ) {
      return data;
    }

    return data.filter((row) => {
      return Object.entries(selectedFilters).every(([filterKey, filter]) => {
        const filterValues = filter.filterValues || {};

        if (Object.keys(filterValues).length === 0) {
          return true;
        }

        const value = getValueByKey(filterKey, row);

        if (filter.comparator !== undefined) {
          return Object.keys(filterValues).some((filterValue) =>
            filter.comparator?.(value, filterValue)
          );
        } else if (filterValues[value]) {
          return filterValues[value].selected;
        }

        return false;
      });
    });
  }, [data, isDataLoading, selectedFilters]);

  const isFiltering = useMemo(
    () =>
      Object.values(selectedFilters).some((filter) =>
        Object.values(filter.filterValues).some(
          (filterValue) => filterValue.selected
        )
      ),
    [selectedFilters]
  );

  useEffect(() => {
    if (isDataLoading) {
      return;
    }

    // loop options to check if any filter value has changed since last time
    options.current = Object.entries(options.current || {}).reduce<
      PersistentStorageData['selectedFilters']
    >((acc, [filterKey, filterValues]) => {
      if (!acc) {
        acc = {};
      }

      acc[filterKey] = Object.fromEntries(
        Object.entries(filterValues || {}).map(
          ([filterValue, filterValueData]) => {
            const isSelected =
              filters[filterKey]?.filterValues?.[filterValue]?.selected;

            if (isSelected === undefined) {
              return [filterValue, filterValueData];
            }

            return [
              filterValue,
              {
                ...filterValueData,
                selected: isSelected || null,
              },
            ];
          }
        )
      );

      return acc;
    }, {});

    // add new filters to options if they are not present
    Object.entries(filters).forEach(([filterKey, filter]) => {
      Object.entries(filter.filterValues || {}).forEach(
        ([filterValue, filterData]) => {
          if (!options.current) {
            options.current = {};
          }

          if (!options.current?.[filterKey]) {
            options.current[filterKey] = {};
          }

          if (
            !options.current?.[filterKey]?.[filterValue] &&
            filterData.selected !== null
          ) {
            // @ts-ignore
            options.current[filterKey][filterValue] = {
              ...filterData,
            };
          }
        }
      );
    });

    // add selectAll filter values to options if they are not present
    Object.entries(selectAllFilterSelection).forEach(
      ([filterKey, filterValueData]) => {
        if (!options.current) {
          options.current = {};
        }

        if (!options.current?.[filterKey]) {
          options.current[filterKey] = {};
        }

        // @ts-ignore
        options.current[filterKey].All = {
          ...filterValueData,
        };
      }
    );
  }, [filters, isDataLoading, selectAllFilterSelection]);

  return {
    filters,
    selectedFilters,
    filteredData,
    isFiltering,
    toggleFilterSelection,
    toggleSelectAllFilter,
    isSelectAllFilterSelected,
    resetFilters,
  };
};

export default useFiltering;
