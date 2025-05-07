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
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { getValueByKey } from '@google-psat/common';
/**
 * Internal dependencies.
 */
import useColumnSorting from './useColumnSorting';
import useColumnVisibility from './useColumnVisibility';
import useColumnResizing from './useColumnResizing';
import useFiltering from './useFiltering';
import useSearch from './useSearch';
import { TableContext } from './context';
import { TableRow, TableProviderProps, TableData } from './types';

export const TableProvider = ({
  data,
  tableColumns,
  tableFilterData,
  tableSearchKeys,
  tablePersistentSettingsKey,
  onRowClick,
  onRowContextMenu,
  getRowObjectKey,
  conditionalTableRowClassesHandler,
  exportTableData,
  hasVerticalBar,
  getVerticalBarColorHash,
  isRowSelected,
  children,
}: PropsWithChildren<TableProviderProps>) => {
  const [allData, setAllData] = useState(data);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [paginatedData, setPaginatedData] = useState<TableData[]>([]);

  useEffect(() => {
    if (data) {
      setAllData(data);
    }
  }, [data]);

  const commonKey = useMemo(() => {
    if (!tablePersistentSettingsKey) {
      return undefined;
    }

    const keys = tablePersistentSettingsKey.split('#');

    return keys[0];
  }, [tablePersistentSettingsKey]);

  const { searchValue, setSearchValue, searchFilteredData } = useSearch(
    allData,
    tableSearchKeys,
    commonKey
  );

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
    searchFilteredData,
    tableFilterData,
    tablePersistentSettingsKey,
    commonKey
  );

  useEffect(() => {
    if (filteredData.length) {
      const start = page * 500;
      const end = start + 500;
      const _pages = Math.ceil(filteredData.length / 500);
      setPages(_pages);

      if (page >= _pages) {
        setPage(_pages - 1);
      }
      const _paginatedData = filteredData.slice(start, end);
      setPaginatedData(_paginatedData);
    }
  }, [page, filteredData]);

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
    useColumnSorting(paginatedData, tableColumns, commonKey);

  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    const newRows = sortedData.map((_data) => {
      const row = {
        originalData: _data,
      } as TableRow;

      columns.forEach((column) => {
        const value = getValueByKey(column.accessorKey, _data);
        row[column.accessorKey] = {
          value: () => column.cell(value, _data) as React.JSX.Element,
        };
      });

      return row;
    });

    setRows(newRows);
  }, [sortedData, columns]);

  const hideableColumns = useMemo(
    () => tableColumns.filter((column) => column.enableHiding !== false),
    [tableColumns]
  );

  useEffect(() => {
    const filteredRows = rows.filter(
      (row) => isRowSelected?.(row.originalData) ?? true
    );

    if (filteredRows.length === 0) {
      onRowClick(null);
    }
  }, [isRowSelected, onRowClick, rows]);

  return (
    <TableContext.Provider
      value={{
        state: {
          columns,
          hideableColumns,
          rows,
          sortKey,
          sortOrder,
          areAllColumnsVisible,
          tableContainerRef,
          isResizing,
          filters,
          selectedFilters,
          isFiltering,
          searchValue,
          pages,
          selectedPage: page,
        },
        actions: {
          setSortKey,
          setSortOrder,
          hideColumn,
          toggleVisibility,
          showColumn,
          isColumnHidden,
          onMouseDown,
          toggleFilterSelection,
          toggleSelectAllFilter,
          resetFilters,
          isSelectAllFilterSelected,
          setSearchValue,
          onRowClick,
          onRowContextMenu,
          getRowObjectKey,
          conditionalTableRowClassesHandler,
          exportTableData,
          hasVerticalBar,
          getVerticalBarColorHash,
          setPage,
        },
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
