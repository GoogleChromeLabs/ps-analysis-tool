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
import React, { useCallback, useRef } from 'react';
import type { Row } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import BodyRow from './bodyRow';
import type { TData } from '..';

interface TableBodyProps {
  rows: Row<TData>[];
  selectedKey: string | undefined;
  onRowClick: (key: TData) => void;
}

const TableBody = ({ rows, selectedKey, onRowClick }: TableBodyProps) => {
  const tableBodyRef = useRef(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TData>) => {
      event.preventDefault();
      event.stopPropagation();
      // @ts-ignore - the `children` property will be available on the `current` property.
      const currentRow = tableBodyRef.current?.children.namedItem(row.id);

      let newRowId: string | null = null;
      let rowElement: HTMLTableRowElement | null = null;
      if (event.key === 'ArrowUp') {
        rowElement = currentRow?.previousElementSibling;
      } else if (event.key === 'ArrowDown') {
        rowElement = currentRow?.nextElementSibling;
      }

      if (rowElement) {
        rowElement.tabIndex = -1;
        rowElement.focus();
        newRowId = rowElement.id;
      }

      if (newRowId) {
        const newRow = rows.find((_row) => _row.id === newRowId);
        if (newRow) {
          onRowClick(newRow.original);
        }
      }
    },
    [onRowClick, rows]
  );

  return (
    <tbody ref={tableBodyRef}>
      {rows.map((row, index) => (
        <BodyRow
          key={row.id}
          index={index}
          row={row}
          selectedKey={selectedKey}
          onRowClick={onRowClick}
          onKeyDown={handleKeyDown}
        />
      ))}
    </tbody>
  );
};

export default TableBody;
