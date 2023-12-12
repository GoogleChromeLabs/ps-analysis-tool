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
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import type { PersistentStorageData, TableColumn } from '..';
import { useTablePersistentSettingsStore } from '../../persistentSettingsStore';

export type ColumnResizingOutput = {
  columns: TableColumn[];
  tableContainerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (
    selectedColumnRef: React.RefObject<HTMLTableHeaderCellElement>,
    index: number
  ) => void;
  isResizing: boolean;
};

const useColumnResizing = (
  tableColumns: TableColumn[],
  allTableColumnsKeys: string[],
  tablePersistentSettingsKey?: string
): ColumnResizingOutput => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const columnsSizingRef = useRef<{ [key: string]: number }>({});

  const resizeColumns = useCallback(
    (columnsToResize: TableColumn[], tableWidth: number) => {
      const totalWidth = columnsToResize.reduce(
        (acc, column) => acc + (column.width || 0),
        0
      );

      let diff = tableWidth - totalWidth;

      if (diff > 0) {
        const perColumnDiff = diff / columnsToResize.length;
        columnsToResize.forEach((column) => {
          if (!column.width) {
            column.width = 0;
          }

          column.width += perColumnDiff;
        });
      } else if (diff < 0) {
        let perColumnDiff = -diff / columnsToResize.length;

        const sortedColumns = [...columnsToResize].sort(
          ({ width: width1 }, { width: width2 }) =>
            (width1 || 0) - (width2 || 0)
        );

        sortedColumns.forEach((column, idx) => {
          if (!column.width) {
            column.width = 40;
          }

          const diffCanApply =
            column.width - perColumnDiff < 40
              ? column.width - 40
              : perColumnDiff;

          column.width -= diffCanApply;

          diff += diffCanApply;

          const newPerColumnDiff = -diff / (columnsToResize.length - idx - 1);
          perColumnDiff = newPerColumnDiff;
        });
      }

      return columnsToResize;
    },
    []
  );

  useEffect(() => {
    setColumns((prev) => {
      const newColumns = tableColumns.map((column) => ({
        ...column,
        width:
          prev.find(({ accessorKey }) => accessorKey === column.accessorKey)
            ?.width ||
          columnsSizingRef.current?.[column.accessorKey] ||
          40,
      }));

      return resizeColumns(
        newColumns,
        tableContainerRef.current?.scrollWidth || 0
      );
    });
  }, [resizeColumns, tableColumns]);

  const setColumnsCallback = useCallback(
    (columnsSizing?: { [key: string]: number }) => {
      setColumns((prevColumns) => {
        const tableWidth = tableContainerRef.current?.scrollWidth || 0;
        const newColumns = prevColumns.map((column) => ({
          ...column,
          width:
            columnsSizing?.[column.accessorKey] ||
            column.width ||
            tableWidth / prevColumns.length,
        }));

        return resizeColumns(newColumns, tableWidth);
      });
    },
    [resizeColumns]
  );

  useEffect(() => {
    const _setColumnsCallback = () => setColumnsCallback();
    window.addEventListener('resize', _setColumnsCallback);
    return () => {
      window.removeEventListener('resize', _setColumnsCallback);
    };
  }, [setColumnsCallback]);

  const onMouseDown = useCallback(
    (
      selectedColumnRef: React.RefObject<HTMLTableHeaderCellElement>,
      index: number
    ) => {
      const onMove = (clientXPos: number) => {
        setColumns((prev) => {
          setIsResizing(true);
          const startOffset =
            selectedColumnRef.current?.getBoundingClientRect().left || 0;

          const selectedColumn = index;

          const column1 = prev[selectedColumn],
            column2 = prev[selectedColumn + 1];

          if (selectedColumn + 1 === prev.length) {
            return prev;
          }

          const column1Width = column1.width || 0,
            column2Width = column2.width || 0;
          const widthChange = clientXPos - (startOffset + column1Width);

          let newColumn1Width = 40,
            newColumn2Width = 40;

          if (widthChange > 0) {
            newColumn2Width = Math.max(40, column2Width - widthChange);
            newColumn1Width =
              newColumn2Width === 40
                ? column1Width + column2Width - 40
                : column1Width + widthChange;
          } else {
            newColumn1Width = Math.max(40, column1Width + widthChange);
            newColumn2Width =
              newColumn1Width === 40
                ? column1Width + column2Width - 40
                : column2Width - widthChange;
          }

          const newColumns = [...prev];

          newColumns[selectedColumn] = {
            ...column1,
            width: newColumn1Width,
          };

          newColumns[selectedColumn + 1] = {
            ...column2,
            width: newColumn2Width,
          };

          return newColumns;
        });
      };

      const mouseEvents = {
        moveHandler: (e: MouseEvent) => onMove(e.clientX),
        upHandler: () => {
          setTimeout(() => setIsResizing(false), 100);
          document.removeEventListener('mousemove', mouseEvents.moveHandler);
          document.removeEventListener('mouseup', mouseEvents.upHandler);
        },
      };

      document.addEventListener('mousemove', mouseEvents.moveHandler);
      document.addEventListener('mouseup', mouseEvents.upHandler);
    },
    []
  );

  useEffect(() => {
    const resizer = new ResizeObserver(() => {
      setColumnsCallback();
    });

    if (tableContainerRef.current) {
      resizer.observe(tableContainerRef.current);
    }

    return () => resizer.disconnect();
  }, [setColumnsCallback]);

  const { getPreferences, setPreferences } = useTablePersistentSettingsStore(
    ({ actions }) => ({
      getPreferences: actions.getPreferences,
      setPreferences: actions.setPreferences,
    })
  );

  useEffect(() => {
    if (tablePersistentSettingsKey) {
      const data = getPreferences(tablePersistentSettingsKey, 'columnsSizing');

      if (data) {
        columnsSizingRef.current =
          (data as PersistentStorageData['columnsSizing']) || {};
        setColumnsCallback(
          (data as PersistentStorageData['columnsSizing']) || {}
        );
      }
    }

    return () => {
      setColumns([]);
    };
  }, [getPreferences, setColumnsCallback, tablePersistentSettingsKey]);

  useEffect(() => {
    const _columns = columns.reduce((acc, { accessorKey, width }) => {
      acc[accessorKey] = width || 0;

      return acc;
    }, {} as { [key: string]: number });

    const _columnsSizing = (allTableColumnsKeys || []).reduce(
      (acc, accessorKey) => {
        acc[accessorKey] =
          _columns[accessorKey] || columnsSizingRef.current[accessorKey] || 40;

        return acc;
      },
      {} as { [key: string]: number }
    );

    columnsSizingRef.current = {
      ...columnsSizingRef.current,
      ..._columnsSizing,
    };

    if (tablePersistentSettingsKey) {
      setPreferences(
        {
          columnsSizing: _columnsSizing,
        },
        tablePersistentSettingsKey
      );
    }
  }, [
    allTableColumnsKeys,
    columns,
    setPreferences,
    tablePersistentSettingsKey,
  ]);

  return {
    columns,
    tableContainerRef,
    onMouseDown,
    isResizing,
  };
};

export default useColumnResizing;
