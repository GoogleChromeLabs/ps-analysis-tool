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
import { createContext, noop } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import {
  TableColumn,
  TableFilter,
  TableRow,
  TableProviderProps,
} from './types';
import { ColumnResizingOutput } from './useColumnResizing';
import { ColumnSortingOutput } from './useColumnSorting';
import { ColumnVisibilityOutput } from './useColumnVisibility';
import { TableFilteringOutput } from './useFiltering';
import { TableSearchOutput } from './useSearch';

export interface TableStoreContext {
  state: {
    columns: TableColumn[];
    hideableColumns: TableColumn[];
    rows: TableRow[];
    sortKey: ColumnSortingOutput['sortKey'];
    sortOrder: ColumnSortingOutput['sortOrder'];
    areAllColumnsVisible: ColumnVisibilityOutput['areAllColumnsVisible'];
    tableContainerRef: ColumnResizingOutput['tableContainerRef'];
    isResizing: ColumnResizingOutput['isResizing'];
    filters: TableFilter;
    selectedFilters: TableFilter;
    isFiltering: TableFilteringOutput['isFiltering'];
    searchValue: TableSearchOutput['searchValue'];
  };
  actions: {
    setSortKey: ColumnSortingOutput['setSortKey'];
    setSortOrder: ColumnSortingOutput['setSortOrder'];
    hideColumn: ColumnVisibilityOutput['hideColumn'];
    toggleVisibility: ColumnVisibilityOutput['toggleVisibility'];
    showColumn: ColumnVisibilityOutput['showColumn'];
    isColumnHidden: ColumnVisibilityOutput['isColumnHidden'];
    onMouseDown: ColumnResizingOutput['onMouseDown'];
    toggleFilterSelection: TableFilteringOutput['toggleFilterSelection'];
    toggleSelectAllFilter: TableFilteringOutput['toggleSelectAllFilter'];
    resetFilters: TableFilteringOutput['resetFilters'];
    isSelectAllFilterSelected: TableFilteringOutput['isSelectAllFilterSelected'];
    setSearchValue: TableSearchOutput['setSearchValue'];
    onRowClick: TableProviderProps['onRowClick'];
    onRowContextMenu: TableProviderProps['onRowContextMenu'];
    getRowObjectKey: TableProviderProps['getRowObjectKey'];
    conditionalTableRowClassesHandler?: TableProviderProps['conditionalTableRowClassesHandler'];
    exportTableData?: TableProviderProps['exportTableData'];
    hasVerticalBar?: TableProviderProps['hasVerticalBar'];
  };
}

const initialState: TableStoreContext = {
  state: {
    columns: [],
    hideableColumns: [],
    rows: [],
    sortKey: '',
    sortOrder: 'asc',
    areAllColumnsVisible: true,
    tableContainerRef: null,
    isResizing: false,
    filters: {},
    selectedFilters: {},
    isFiltering: false,
    searchValue: '',
  },
  actions: {
    setSortKey: noop,
    setSortOrder: noop,
    hideColumn: noop,
    toggleVisibility: noop,
    showColumn: noop,
    isColumnHidden: () => false,
    onMouseDown: noop,
    toggleFilterSelection: noop,
    toggleSelectAllFilter: noop,
    resetFilters: noop,
    isSelectAllFilterSelected: () => false,
    setSearchValue: noop,
    onRowClick: noop,
    onRowContextMenu: noop,
    getRowObjectKey: () => '',
  },
};

export const TableContext = createContext<TableStoreContext>(initialState);
