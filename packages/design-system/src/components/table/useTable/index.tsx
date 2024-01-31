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
import { useMemo } from 'react';
import {
  getValueByKey,
  CookieTableData,
  TechnologyData,
} from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import useColumnSorting, { type ColumnSortingOutput } from './useColumnSorting';
import useColumnVisibility, {
  type ColumnVisibilityOutput,
} from './useColumnVisibility';
import useColumnResizing, {
  type ColumnResizingOutput,
} from './useColumnResizing';
import useFiltering, { TableFilteringOutput } from './useFiltering';
import useSearch, { TableSearchOutput } from './useSearch';

export type TableData = CookieTableData | TechnologyData;

export type InfoType = number | string | boolean | string[] | [];

export type TableColumn = {
  header: string;
  accessorKey: string;
  cell?: (info: InfoType, details?: TableData) => React.JSX.Element | InfoType;
  enableHiding?: boolean;
  widthWeightagePercentage?: number;
  width?: number; // For internal use only
};

export type TableRow = {
  [accessorKey: string]: {
    value: React.JSX.Element | InfoType;
  };
  //@ts-ignore
  originalData: TableData;
};

export type TableFilter = {
  [accessorKey: string]: {
    title: string;
    description?: string;
    hasStaticFilterValues?: boolean;
    hasPrecalculatedFilterValues?: boolean;
    enableSelectAllOption?: boolean;
    filterValues?: {
      [filterValue: string]: {
        selected: boolean;
        description?: string;
      };
    };
    sortValues?: boolean; // for dynamic filters, values are sorted by default even if not specified.
    useGenericPersistenceKey?: boolean;
    calculateFilterValues?: (value: InfoType) => string;
    comparator?: (value: InfoType, filterValue: string) => boolean;
  };
};

export type PersistentStorageData = {
  columnsVisibility?: { [key: string]: boolean };
  columnsSizing?: { [key: string]: number };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  selectedFilters?: {
    [key: string]: TableFilter[keyof TableFilter]['filterValues'];
  };
  searchValue?: string;
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
  isFiltering: TableFilteringOutput['isFiltering'];
  toggleFilterSelection: TableFilteringOutput['toggleFilterSelection'];
  toggleSelectAllFilter: TableFilteringOutput['toggleSelectAllFilter'];
  resetFilters: TableFilteringOutput['resetFilters'];
  isSelectAllFilterSelected: TableFilteringOutput['isSelectAllFilterSelected'];
  searchValue: TableSearchOutput['searchValue'];
  setSearchValue: TableSearchOutput['setSearchValue'];
};

interface useTableProps {
  data: TableData[];
  tableColumns: TableColumn[];
  tableFilterData?: TableFilter;
  tableSearchKeys?: string[];
  tablePersistentSettingsKey?: string;
}

const useTable = ({
  data,
  tableColumns,
  tableFilterData,
  tableSearchKeys,
  tablePersistentSettingsKey,
}: useTableProps): TableOutput => {
  const commonKey = useMemo(() => {
    if (!tablePersistentSettingsKey) {
      return undefined;
    }

    const keys = tablePersistentSettingsKey.split('#');

    return keys[0];
  }, [tablePersistentSettingsKey]);

  const {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  } = useColumnVisibility(tableColumns, commonKey);

  const allTableColumnsKeys = useMemo(() => {
    return tableColumns.map(({ accessorKey }) => accessorKey);
  }, [tableColumns]);

  const { columns, tableContainerRef, onMouseDown, isResizing } =
    useColumnResizing(visibleColumns, allTableColumnsKeys, commonKey);

  const { sortedData, sortKey, sortOrder, setSortKey, setSortOrder } =
    useColumnSorting(data, commonKey);

  const {
    filters,
    selectedFilters,
    filteredData,
    isFiltering,
    toggleFilterSelection,
    toggleSelectAllFilter,
    resetFilters,
    isSelectAllFilterSelected,
  } = useFiltering(
    sortedData,
    tableFilterData,
    tablePersistentSettingsKey,
    commonKey
  );

  const { searchValue, setSearchValue, searchFilteredData } = useSearch(
    filteredData,
    tableSearchKeys,
    commonKey
  );

  const rows = useMemo(() => {
    return searchFilteredData.map((_data) => {
      const row = {
        originalData: _data,
      } as TableRow;

      columns.forEach((column) => {
        const value = getValueByKey(column.accessorKey, _data);
        row[column.accessorKey] = {
          value: column.cell?.(value, _data) ?? value,
        };
      });

      return row;
    });
  }, [searchFilteredData, columns]);

  const hideableColumns = useMemo(
    () => tableColumns.filter((column) => column.enableHiding !== false),
    [tableColumns]
  );

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
    isFiltering,
    toggleFilterSelection,
    toggleSelectAllFilter,
    resetFilters,
    isSelectAllFilterSelected,
    searchValue,
    setSearchValue,
  };
};

export default useTable;
