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
import { useMemo, useState, useEffect, useCallback } from 'react';
import { CookieTableData, TechnologyData } from '@ps-analysis-tool/common';
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

export type TableData = CookieTableData | TechnologyData;

export type InfoType = number | string | boolean | [];

export type TableColumn = {
  header: string;
  accessorKey: string;
  cell?: (
    info: InfoType,
    details?: TableData,
    rowHighlighter?: (value: boolean, cookieKey: string) => void
  ) => React.JSX.Element | InfoType;
  enableHiding?: boolean;
  width?: number;
};

export type TableRow = {
  [accessorKey: string]: {
    value: React.JSX.Element | InfoType;
  };
  originalData: TableData;
};

export type TableOutput = {
  highlightRowForVisibility: (value: boolean, cookieKey: string) => void;
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
  const [rows, setRows] = useState<TableRow[]>([]);

  const {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  } = useColumnVisibility(tableColumns, options?.selectedColumns);

  const { columns, tableContainerRef, onMouseDown, isResizing } =
    useColumnResizing(visibleColumns, options?.columnSizing);

  const { sortedData, sortKey, sortOrder, setSortKey, setSortOrder } =
    useColumnSorting(data, options?.columnSorting);

  const highlightRowForVisibility = useCallback(
    (value: boolean, cookieKey: string) => {
      setRows((prevState) => {
        const tempRows = prevState;
        const indexToBeReplaced = tempRows.findIndex(
          (row: TableRow) =>
            (row.originalData.parsedCookie.name as string) +
              (row.originalData.parsedCookie.domain as string) +
              (row.originalData.parsedCookie.path as string) ===
            cookieKey
        );
        tempRows[indexToBeReplaced].originalData.highlighted = value;
        return tempRows;
      });
    },
    []
  );

  const memoisedRows = useMemo(() => {
    return sortedData.map((_data) => {
      const row = {
        originalData: {
          ..._data,
          highlighted: false,
        },
      } as TableRow;

      columns.forEach((column) => {
        const value = getValueByKey(column.accessorKey, _data);
        row[column.accessorKey] = {
          value:
            column.cell?.(value, _data, highlightRowForVisibility) ?? value,
        };
      });

      return row;
    });
  }, [sortedData, columns, highlightRowForVisibility]);

  useEffect(() => {
    setRows(memoisedRows);
  }, [memoisedRows]);

  const hideableColumns = useMemo(
    () => tableColumns.filter((column) => column.enableHiding !== false),
    [tableColumns]
  );

  const rowsToBeProcessed =
    rows && rows[0] && rows[0]['parsedCookie.name'] ? rows : memoisedRows;

  return {
    highlightRowForVisibility,
    columns,
    hideableColumns,
    rows: rowsToBeProcessed,
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
  };
};

export default useTable;
