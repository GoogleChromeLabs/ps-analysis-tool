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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import BodyRow from './bodyRow';
import type { TableData } from '..';

interface TableBodyProps {
  rows: Row<TableData>[];
  selectedKey: string | undefined | null;
  onRowClick: (key: TableData | null) => void;
  emptyRowCellCount: number;
}

const TableBody = ({
  rows,
  selectedKey,
  onRowClick,
  emptyRowCellCount,
}: TableBodyProps) => {
  const tableBodyRef = useRef(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>, row: Row<TableData>) => {
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

      if (!rowElement) {
        return;
      }

      rowElement.tabIndex = -1;
      rowElement.focus();
      newRowId = rowElement.id;

      if (!newRowId) {
        onRowClick(null);
        return;
      }

      const newRow = rows.find((_row) => _row.id === newRowId);
      if (newRow) {
        onRowClick(newRow.original);
      }
    },
    [onRowClick, rows]
  );

  const handleEmptyRowKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableRowElement>) => {
      event.preventDefault();
      event.stopPropagation();

      if (event.key === 'ArrowDown' || !rows.length) {
        return;
      }

      const newRow = rows[rows.length - 1];
      // @ts-ignore - the `children` property will be available on the `current` property.
      const rowElement = tableBodyRef.current?.children.namedItem(newRow.id);
      if (!rowElement) {
        return;
      }

      rowElement.tabIndex = -1;
      rowElement.focus();
      onRowClick(newRow.original);
    },
    [onRowClick, rows]
  );

  return (
    <tbody ref={tableBodyRef} className="h-full">
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
      <tr
        className={classNames(
          'h-5 outline-0',
          {
            'bg-gainsboro': selectedKey === null,
          },
          {
            'bg-anti-flash-white': rows.length % 2,
          }
        )}
        tabIndex={0}
        onClick={() => {
          onRowClick(null);
        }}
        onKeyDown={handleEmptyRowKeyDown}
      >
        {[...Array(emptyRowCellCount)].map((_, index) => (
          <td
            key={index}
            className={`border border-y-0 border-american-silver px-1 py-px ${
              index === 0 ? 'pl-5' : ''
            }`}
          />
        ))}
      </tr>
      <tr className="h-full outline-0">
        {[...Array(emptyRowCellCount)].map((_, index) => (
          <td
            key={index}
            className={`h-full border border-y-0 border-american-silver px-1 py-px ${
              index === 0 ? 'pl-5' : ''
            }`}
          />
        ))}
      </tr>
    </tbody>
  );
};

export default TableBody;
