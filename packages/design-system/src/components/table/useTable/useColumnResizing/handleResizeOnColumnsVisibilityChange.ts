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
 * Internal dependencies
 */
import { TableColumn } from '../types';
import { resizeColumns } from './resizeColumns';

const getInitialColumnSize = (
  widthWeightagePercentage: number,
  tableWidth: number,
  columnsCount: number
) => {
  if (widthWeightagePercentage) {
    return (widthWeightagePercentage / 100) * tableWidth;
  }

  return tableWidth / columnsCount;
};

export const handleResizeOnColumnsVisibilityChange = (
  prevColumnsState: TableColumn[],
  newTableColumnsToRender: TableColumn[],
  columnsSizing: { [key: string]: number },
  tableWidth: number,
  isToggleAll: boolean
) => {
  // new columns are added and it's not the first render
  if (
    prevColumnsState.length < newTableColumnsToRender.length &&
    prevColumnsState.length
  ) {
    const incomingColumnsWidth = newTableColumnsToRender
      .filter(
        (column) =>
          !prevColumnsState.find(
            (prevColumn) => prevColumn.accessorKey === column.accessorKey
          )
      )
      .reduce((acc, column) => {
        if (!columnsSizing[column.accessorKey]) {
          const percentage = isToggleAll
            ? column.widthWeightagePercentage || 0
            : 0;
          columnsSizing[column.accessorKey] = getInitialColumnSize(
            percentage,
            tableWidth,
            newTableColumnsToRender.length
          );
        }

        acc += columnsSizing[column.accessorKey];

        return acc;
      }, 0);

    const resizedPrev = resizeColumns(
      prevColumnsState,
      tableWidth - incomingColumnsWidth
    );

    resizedPrev.forEach((column) => {
      columnsSizing[column.accessorKey] = column.width || 0;
    });
  }

  const newColumns = newTableColumnsToRender.map((column) => {
    if (!columnsSizing[column.accessorKey]) {
      columnsSizing[column.accessorKey] = getInitialColumnSize(
        column.widthWeightagePercentage || 0,
        tableWidth,
        newTableColumnsToRender.length
      );
    }

    return {
      ...column,
      width: columnsSizing?.[column.accessorKey],
    };
  });

  // columns are removed or it's the first render
  if (
    prevColumnsState.length > newTableColumnsToRender.length ||
    !prevColumnsState.length
  ) {
    return resizeColumns(newColumns, tableWidth);
  }

  return newColumns;
};
