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
import type { TableColumn } from '../useTable';

export type ColumnResizingOutput = {
  columns: TableColumn[];
  tableContainerRef: React.RefObject<HTMLDivElement>;
  onMouseDown: (
    selectedColumnRef: React.RefObject<HTMLTableHeaderCellElement>,
    index: number
  ) => void;
};

const useColumnResizing = (
  tableColumns: TableColumn[],
  options?: Record<string, number>
): ColumnResizingOutput => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<TableColumn[]>([]);

  const setColumnsCallback = useCallback(() => {
    const tableWidth = tableContainerRef.current?.scrollWidth || 0;
    const newColumns = tableColumns.map((column) => ({
      ...column,
      width: options?.[column.accessorKey]
        ? options[column.accessorKey]
        : tableWidth / tableColumns.length,
    }));

    const totalWidth = newColumns.reduce(
      (acc, column) => acc + column.width,
      0
    );

    const diff = tableWidth - totalWidth;

    if (diff > 0) {
      const perColumnDiff = diff / newColumns.length;
      newColumns.forEach((column) => {
        column.width += perColumnDiff;
      });
    }

    setColumns(newColumns);
  }, [options, tableColumns]);

  useEffect(() => {
    setColumnsCallback();
    window.addEventListener('resize', setColumnsCallback);
    return () => {
      window.removeEventListener('resize', setColumnsCallback);
    };
  }, [setColumnsCallback]);

  const onMouseDown = useCallback(
    (
      selectedColumnRef: React.RefObject<HTMLTableHeaderCellElement>,
      index: number
    ) => {
      const onMove = (clientXPos: number) => {
        const startOffset =
          selectedColumnRef.current?.getBoundingClientRect().left || 0;

        const selectedColumn = index;

        const column1 = columns[selectedColumn],
          column2 = columns[selectedColumn + 1];

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

        setColumns((prev) => {
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
          document.removeEventListener('mousemove', mouseEvents.moveHandler);
          document.removeEventListener('mouseup', mouseEvents.upHandler);
        },
      };

      document.addEventListener('mousemove', mouseEvents.moveHandler);
      document.addEventListener('mouseup', mouseEvents.upHandler);
    },
    [columns]
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

  return {
    columns,
    tableContainerRef,
    onMouseDown,
  };
};

export default useColumnResizing;
