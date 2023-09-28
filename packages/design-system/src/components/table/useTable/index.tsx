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
import { CookieTableData } from '@cookie-analysis-tool/common';
/**
 * Internal dependencies.
 */
import getValueByKey from '../utils/getValueByKey';
import useColumnSorting, {
  DefaultOptions,
  type ColumnSortingOutput,
} from '../useColumnSorting';
import useColumnVisibility, {
  type ColumnVisibilityOutput,
} from '../useColumnVisibility';
import useColumnResizing, {
  type ColumnResizingOutput,
} from '../useColumnResizing';

export type TableData = CookieTableData;

export type InfoType = number | string | boolean;

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
    originalData: TableData;
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
};

interface useTableProps {
  tableColumns: TableColumn[];
  data: TableData[];
  options?: {
    columnSizing?: Record<string, number>;
    columnSorting?: DefaultOptions;
    selectedColumns?: Record<string, boolean>;
  };
}

const useTable = ({
  tableColumns,
  data,
  options,
}: useTableProps): TableOutput => {
  const {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  } = useColumnVisibility(tableColumns, options?.selectedColumns);

  const { columns, tableContainerRef, onMouseDown } = useColumnResizing(
    visibleColumns,
    options?.columnSizing
  );

  const { sortedData, sortKey, sortOrder, setSortKey, setSortOrder } =
    useColumnSorting(data, options?.columnSorting);

  const rows = useMemo(() => {
    return sortedData.map((_data) => {
      const row = {} as TableRow;

      columns.forEach((column) => {
        const value = getValueByKey(column.accessorKey, _data);
        row[column.accessorKey] = {
          value: column.cell?.(value) ?? value,
          originalData: _data,
        };
      });

      return row;
    });
  }, [sortedData, columns]);

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
  };
};

export default useTable;
