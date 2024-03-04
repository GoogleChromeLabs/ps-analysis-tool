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

export const resizeColumns = (
  columnsToResize: TableColumn[],
  tableWidth: number
) => {
  const totalWidth = columnsToResize.reduce(
    (acc, column) => acc + (column.width || 0),
    0
  );

  const diff = tableWidth - totalWidth;

  // If the table is wider than the columns, we need to add the difference to the columns
  if (diff > 0) {
    const perColumnDiff = diff / columnsToResize.length;
    columnsToResize.forEach((column) => {
      if (!column.width) {
        column.width = 0;
      }

      column.width += perColumnDiff;
    });
  }
  // If the table is narrower than the columns, we need to remove the difference from the columns
  else if (diff < 0) {
    const sortedColumns = [...columnsToResize].sort(
      ({ width: width1 }, { width: width2 }) => (width2 || 0) - (width1 || 0)
    );

    let columnsWithLowWidth = 0;

    sortedColumns.forEach((column) => {
      if (!column.width) {
        column.width = 40;
      }

      const perColumnDiffPercentage = (column.width / totalWidth) * 100;
      const diffCanApply =
        (perColumnDiffPercentage / 100) * (-diff + columnsWithLowWidth * 40);

      if (column.width - diffCanApply >= 40) {
        column.width -= diffCanApply;
      } else {
        columnsWithLowWidth++;
        column.width = 40;
      }
    });
  }

  return columnsToResize;
};
