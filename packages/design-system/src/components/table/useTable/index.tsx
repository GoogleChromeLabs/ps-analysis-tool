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
import { useEffect, useMemo } from 'react';
import { CookieTableData, TechnologyData } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import getValueByKey from '../utils/getValueByKey';
import useColumnSorting, {
  DefaultOptions,
  type ColumnSortingOutput,
} from './useColumnSorting';
import useColumnVisibility, {
  type ColumnVisibilityOutput,
} from './useColumnVisibility';
import useColumnResizing, {
  type ColumnResizingOutput,
} from './useColumnResizing';
import useFiltering, { TableFilteringOutput } from './useFiltering';
import useSearch, { TableSearchOutput } from './useSearch';
import usePersistentSettings from './usePersistentSettings';

export type TableData = CookieTableData | TechnologyData;

export type InfoType = number | string | boolean | [];

export type TableColumn = {
  header: string;
  accessorKey: string;
  cell?: (info: InfoType) => React.JSX.Element | InfoType;
  enableHiding?: boolean;
  width?: number;
};

export type TableRow = {
  [accessorKey: string]: {
    value: React.JSX.Element | InfoType;
  };
  originalData: TableData;
};

export type TableFilter = {
  [accessorKey: string]: {
    title: string;
    description?: string;
    hasStaticFilterValues?: boolean;
    filterValues?: {
      [filterValue: string]: {
        selected: boolean;
        description?: string;
      };
    };
    calculateFilterValues?: (value: InfoType) => string;
    comparator?: (value: InfoType, filterValue: string) => boolean;
  };
};

export type TableOutput = {
  columns: TableColumn[];
  hideableColumns: TableColumn[];
  rows: TableRow[];
  sortKey: ColumnSortingOutput['sortKey'];
  sortOrder: ColumnSortingOutput['sortOrder'];
  setSortKey: ColumnSortingOutput['setSortKey'];
  setSortOrder: ColumnSortingOutput['setSortOrder'];
  hideColumn: ColumnVisibilityOutput['hideColumn'];
  toggleVisibility: ColumnVisibilityOutput['toggleVisibility'];
  areAllColumnsVisible: ColumnVisibilityOutput['areAllColumnsVisible'];
  showColumn: ColumnVisibilityOutput['showColumn'];
  isColumnHidden: ColumnVisibilityOutput['isColumnHidden'];
  tableContainerRef: ColumnResizingOutput['tableContainerRef'];
  onMouseDown: ColumnResizingOutput['onMouseDown'];
  isResizing: ColumnResizingOutput['isResizing'];
  filters: TableFilter;
  selectedFilters: TableFilter;
  toggleFilterSelection: TableFilteringOutput['toggleFilterSelection'];
  resetFilters: TableFilteringOutput['resetFilters'];
  searchValue: TableSearchOutput['searchValue'];
  setSearchValue: TableSearchOutput['setSearchValue'];
};

interface useTableProps {
  data: TableData[];
  tableColumns: TableColumn[];
  tableFilterData?: TableFilter;
  tableSearchKeys?: string[];
  tablePersistentSettingsKey?: string;
  options?: {
    columnSizing?: Record<string, number>;
    columnSorting?: DefaultOptions;
    selectedColumns?: Record<string, boolean>;
  };
}

const useTable = ({
  data,
  tableColumns,
  tableFilterData,
  tableSearchKeys,
  tablePersistentSettingsKey,
  options,
}: useTableProps): TableOutput => {
  const [tableOptions, updater] = usePersistentSettings(
    tablePersistentSettingsKey
  );

  const {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  } = useColumnVisibility(
    tableColumns,
    options?.selectedColumns ?? tableOptions?.columnsVisibility
  );

  const { columns, tableContainerRef, onMouseDown, isResizing } =
    useColumnResizing(
      visibleColumns,
      options?.columnSizing ?? tableOptions?.columnsSizing
    );

  const tabOptionsColumnSorting = useMemo<DefaultOptions>(
    () => ({
      defaultSortKey: tableOptions?.sortBy,
      defaultSortOrder: tableOptions?.sortOrder,
    }),
    [tableOptions?.sortBy, tableOptions?.sortOrder]
  );

  const { sortedData, sortKey, sortOrder, setSortKey, setSortOrder } =
    useColumnSorting(data, options?.columnSorting ?? tabOptionsColumnSorting);

  const {
    filters,
    selectedFilters,
    filteredData,
    toggleFilterSelection,
    resetFilters,
  } = useFiltering(sortedData, tableFilterData, tableOptions?.selectedFilters);

  const { searchValue, setSearchValue, searchFilteredData } = useSearch(
    filteredData,
    tableSearchKeys,
    tableOptions?.searchValue
  );

  const rows = useMemo(() => {
    return searchFilteredData.map((_data) => {
      const row = {
        originalData: _data,
      } as TableRow;

      columns.forEach((column) => {
        const value = getValueByKey(column.accessorKey, _data);
        row[column.accessorKey] = {
          value: column.cell?.(value) ?? value,
        };
      });

      return row;
    });
  }, [searchFilteredData, columns]);

  const hideableColumns = useMemo(
    () => tableColumns.filter((column) => column.enableHiding !== false),
    [tableColumns]
  );

  useEffect(() => {
    updater({
      columns: tableColumns,
      visibleColumns: columns,
      sortBy: sortKey,
      sortOrder: sortOrder,
      selectedFilters,
      searchValue,
    });
  }, [
    columns,
    searchValue,
    selectedFilters,
    sortKey,
    sortOrder,
    tableColumns,
    updater,
    visibleColumns,
  ]);

  return {
    columns,
    hideableColumns,
    rows,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
    tableContainerRef,
    onMouseDown,
    isResizing,
    filters,
    selectedFilters,
    toggleFilterSelection,
    resetFilters,
    searchValue,
    setSearchValue,
  };
};

export default useTable;
