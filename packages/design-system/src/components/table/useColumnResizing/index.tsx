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
  useEffect(() => {
    if (options) {
      const tableWidth =
        tableContainerRef.current?.getBoundingClientRect().width || 0;
      let newColumns = tableColumns.map((column) => {
        return {
          ...column,
          width: options[column.accessorKey],
        };
      });
      if (Object.keys(options).length === tableColumns.length) {
        newColumns = tableColumns.map((column) => {
          return {
            ...column,
            width: options[column.accessorKey],
          };
        });
      } else {
        newColumns = tableColumns.map((column) => {
          return {
            ...column,
            width: tableWidth / tableColumns.length,
          };
        });
      }
      setColumns(newColumns);
    }
  }, [options, tableColumns]);

  useEffect(() => {
    if (!options) {
      const tableWidth =
        tableContainerRef.current?.getBoundingClientRect().width || 0;
      const newColumns = tableColumns.map((column) => {
        return {
          ...column,
          width: tableWidth / tableColumns.length,
        };
      });
      setColumns(newColumns);
    }
  }, [options, tableColumns]);

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

        let newColumn1Width = 20,
          newColumn2Width = 20;

        if (widthChange > 0) {
          newColumn2Width = Math.max(20, column2Width - widthChange);
          newColumn1Width =
            newColumn2Width === 20
              ? column1Width + column2Width - 20
              : column1Width + widthChange;
        } else {
          newColumn1Width = Math.max(20, column1Width + widthChange);
          newColumn2Width =
            newColumn1Width === 20
              ? column1Width + column2Width - 20
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

  return {
    columns,
    tableContainerRef,
    onMouseDown,
  };
};

export default useColumnResizing;
