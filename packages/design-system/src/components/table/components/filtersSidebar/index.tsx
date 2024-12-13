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
import React, { useMemo } from 'react';
/**
 * Internal dependencies.
 */
import { TableFilter } from '../../useTable';
import FiltersSidebar, { FilterSidebarValue } from '../../../filtersSidebar';

interface TableFiltersSidebarProps {
  filters: TableFilter;
  isSelectAllFilterSelected: (filterKey: string) => boolean;
  toggleFilterSelection: (
    filterKey: string,
    filterValue: string,
    isRemovalAction?: boolean | undefined
  ) => void;
  toggleSelectAllFilter: (
    filterKey: string,
    isSingleFilterRemovalAction?: boolean | undefined
  ) => void;
}

const TableFiltersSidebar = ({
  filters,
  isSelectAllFilterSelected,
  toggleFilterSelection,
  toggleSelectAllFilter,
}: TableFiltersSidebarProps) => {
  const _filters = useMemo<FilterSidebarValue[]>(
    () =>
      Object.keys(filters).map((filterKey) => {
        const filter = filters[filterKey];
        return {
          key: filterKey,
          title: filter.title,
          values: Object.keys(filter.filterValues || {}),
          sortValues: filter.sortValues,
          description: filter.description,
          enableSelectAll: filter.enableSelectAllOption,
          isSelectAllFilterEnabled: filter.enableSelectAllOption,
        };
      }),
    [filters]
  );

  const selectedFilterValues = useMemo(
    () =>
      Object.keys(filters).reduce((acc, filterKey) => {
        acc[filterKey] = Object.keys(
          filters[filterKey].filterValues || {}
        ).filter(
          (filterValue) => filters[filterKey].filterValues?.[filterValue]
        );
        return acc;
      }, {} as Record<string, string[]>),
    [filters]
  );

  return (
    <FiltersSidebar
      filters={_filters}
      selectedFilterValues={selectedFilterValues}
      isSelectAllFilterSelected={isSelectAllFilterSelected}
      toggleFilterSelection={toggleFilterSelection}
      toggleSelectAllFilter={toggleSelectAllFilter}
    />
  );
};

export default TableFiltersSidebar;
