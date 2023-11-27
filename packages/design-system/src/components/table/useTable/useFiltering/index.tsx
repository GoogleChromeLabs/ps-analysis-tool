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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import type { TableData, TableFilter } from '..';
import getValueByKey from '../../utils/getValueByKey';

export type TableFilteringOutput = {
  filters: TableFilter;
  selectedFilters: TableFilter;
  filteredData: TableData[];
  toggleFilterSelection: (filterKey: string, filterValue: string) => void;
  resetFilters: () => void;
};

const useFiltering = (
  data: TableData[],
  tableFilterData: TableFilter | undefined,
  options?: {
    [filterKey: string]: TableFilter[keyof TableFilter]['filterValues'];
  }
): TableFilteringOutput => {
  const [filters, setFilters] = useState<TableFilter>({
    ...(tableFilterData || {}),
  });

  useEffect(() => {
    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          const savedFilterValues = options?.[filterKey];
          const filterValues = filter.filterValues || {};

          if (!Object.keys(savedFilterValues || {}).length) {
            Object.entries(filterValues).forEach(
              ([filterValue, filterValueData]) => {
                filterValues[filterValue] = {
                  ...filterValueData,
                  selected: false,
                };
              }
            );

            return [filterKey, { ...filter, filterValues }];
          }

          Object.entries(savedFilterValues || {}).forEach(
            ([filterValue, filterValueData]) => {
              if (!filterValues?.[filterValue]) {
                filterValues[filterValue] = {
                  selected: false,
                };
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
  }, [options]);

  useEffect(() => {
    setFilters((prevFilters) =>
      Object.fromEntries(
        Object.entries(prevFilters).map(([filterKey, filter]) => {
          let filterValues = { ...(filter.filterValues || {}) };

          if (filter.hasStaticFilterValues) {
            return [filterKey, { ...filter, filterValues }];
          }

          filterValues = data
            .map((row) => {
              let value = getValueByKey(filterKey, row);

              if (filter.calculateFilterValues) {
                value = filter.calculateFilterValues(value);
              }

              return value;
            })
            .reduce((acc, value) => {
              if (value && !acc[value]) {
                if (filterValues[value]) {
                  acc[value] = {
                    ...filterValues[value],
                  };
                } else {
                  acc[value] = {
                    selected: false,
                  };
                }
              }

              return acc;
            }, {});

          return [filterKey, { ...filter, filterValues }];
        })
      )
    );
  }, [data]);

  const toggleFilterSelection = useCallback(
    (filterKey: string, filterValue: string) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        const filterValues = newFilters[filterKey].filterValues || {};

        if (filterValues[filterValue]) {
          filterValues[filterValue].selected =
            !filterValues[filterValue].selected;
        }

        return newFilters;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
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
  }, [data, selectedFilters]);

  return {
    filters,
    selectedFilters,
    filteredData,
    toggleFilterSelection,
    resetFilters,
  };
};

export default useFiltering;
