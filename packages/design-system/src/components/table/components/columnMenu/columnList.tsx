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
import { useTable } from '../../useTable';

interface ColumnListProps {
  toggleVisibility: (key: string) => void;
  handleClose: () => void;
}

const ColumnList = ({ toggleVisibility, handleClose }: ColumnListProps) => {
  const { hideableColumns, isColumnHidden } = useTable(
    ({ state, actions }) => ({
      hideableColumns: state.hideableColumns,
      isColumnHidden: actions.isColumnHidden,
    })
  );

  useEffect(() => {
    return () => {
      const visibleColumns: Record<string, boolean> = {};

      hideableColumns.forEach((column) => {
        visibleColumns[column.header] = isColumnHidden(column.accessorKey);
      });
    };
  }, [hideableColumns, isColumnHidden]);

  return (
    <ul className="text-basic mt-1.5">
      {hideableColumns.map((column, key) => (
        <ColumnListItem
          key={key}
          column={column}
          isColumnHidden={isColumnHidden(column.accessorKey)}
          toggleVisibility={toggleVisibility}
          handleClose={handleClose}
        />
      ))}
    </ul>
  );
};

export default ColumnList;
