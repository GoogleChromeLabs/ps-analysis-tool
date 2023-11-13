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
import { useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import type { TableData, TableFilter } from '..';
import getValueByKey from '../../utils/getValueByKey';

export type TableFilteringOutput = {
  filters: TableFilter;
  filteredData: TableData[];
  toggleFilterSelection: (filterKey: string, filterValue: string) => void;
};

const useFiltering = (
  data: TableData[],
  tableFilterData: TableFilter
): TableFilteringOutput => {
  const [filters, setFilters] = useState<TableFilter>({});

  useEffect(() => {
    const newFilters = Object.entries(tableFilterData).map(
      ([filterKey, filter]) => {
        const filterValues = filter.filterValues || {};

        data.forEach((row) => {
          const value = getValueByKey(filterKey, row);

          if (value && !filterValues[value]) {
            filterValues[value] = {
              selected: false,
            };
          }
        });

        filter.filterValues = filterValues;

        return [filterKey, filter];
      }
    );

    setFilters(Object.fromEntries(newFilters));
  }, [data, tableFilterData]);

  const toggleFilterSelection = (filterKey: string, filterValue: string) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      const filterValues = newFilters[filterKey].filterValues || {};

      if (filterValues[filterValue]) {
        filterValues[filterValue].selected =
          !filterValues[filterValue].selected;
      }

      return newFilters;
    });
  };

  const filteredData = useMemo<TableData[]>(() => {
    return data.filter((row) => {
      const filterKeys = Object.keys(filters);

      return filterKeys.some((filterKey) => {
        const filterValues = filters[filterKey].filterValues || {};
        const value = getValueByKey(filterKey, row);

        if (filterValues[value] && filterValues[value].selected) {
          return true;
        }

        return false;
      });
    });
  }, [data, filters]);

  return {
    filters,
    filteredData,
    toggleFilterSelection,
  };
};

export default useFiltering;
