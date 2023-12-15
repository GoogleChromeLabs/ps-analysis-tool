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
import React, { useEffect } from 'react';

/**
 * Internal dependencies.
 */
import ColumnListItem from './columnListItem';
import type { TableOutput } from '../../useTable';

interface ColumnListProps {
  table: TableOutput;
  toggleVisibility: (key: string) => void;
  handleClose: () => void;
}

const ColumnList = ({
  table,
  toggleVisibility,
  handleClose,
}: ColumnListProps) => {
  useEffect(() => {
    return () => {
      const visibleColumns: Record<string, boolean> = {};

      table.hideableColumns.forEach((column) => {
        visibleColumns[column.header] = table.isColumnHidden(
          column.accessorKey
        );
      });
    };
  }, [table, table.hideableColumns]);

  return (
    <ul className="text-basic mt-1.5">
      {table.hideableColumns.map((column, key) => (
        <ColumnListItem
          key={key}
          column={column}
          isColumnHidden={table.isColumnHidden(column.accessorKey)}
          toggleVisibility={toggleVisibility}
          handleClose={handleClose}
        />
      ))}
    </ul>
  );
};

export default ColumnList;
