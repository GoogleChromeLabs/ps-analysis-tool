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
import { getValueByKey } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import useColumnSorting from './useColumnSorting';
import useColumnVisibility from './useColumnVisibility';
import useColumnResizing from './useColumnResizing';
import useFiltering from './useFiltering';
import useSearch from './useSearch';
import { TableContext } from './context';
import { TableRow, TableProviderProps } from './types';

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
  children,
}: PropsWithChildren<TableProviderProps>) => {
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

  const [rows, setRows] = useState<TableRow[]>([]);

  useEffect(() => {
    const newRows = searchFilteredData.map((_data) => {
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
  }, [searchFilteredData, columns]);

  const hideableColumns = useMemo(
    () => tableColumns.filter((column) => column.enableHiding !== false),
    [tableColumns]
  );

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
        },
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
