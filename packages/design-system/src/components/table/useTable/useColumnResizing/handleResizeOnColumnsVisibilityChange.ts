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
import { TableColumn } from '..';
import { resizeColumns } from './resizeColumns';

export const handleResizeOnColumnsVisibilityChange = (
  prevColumnsState: TableColumn[],
  newTableColumnsToRender: TableColumn[],
  columnsSizing: { [key: string]: number },
  tableWidth: number
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
          if (column.widthWeightagePercentage) {
            columnsSizing[column.accessorKey] =
              (column.widthWeightagePercentage / 100) * tableWidth;
          } else {
            columnsSizing[column.accessorKey] =
              tableWidth / newTableColumnsToRender.length;
          }
        }

        acc += columnsSizing[column.accessorKey] || 40;

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

  const newColumns = newTableColumnsToRender.map((column) => ({
    ...column,
    width: columnsSizing?.[column.accessorKey] || 40,
  }));

  // columns are removed or it's the first render
  if (
    prevColumnsState.length > newTableColumnsToRender.length ||
    !prevColumnsState.length
  ) {
    return resizeColumns(newColumns, tableWidth);
  }

  return newColumns;
};
