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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import BodyRow from './bodyRow';
import type { TableData, TableOutput, TableRow } from '../../useTable';

interface TableBodyProps {
  table: TableOutput;
  getRowObjectKey: (row: TableRow) => string;
  isRowFocused: boolean;
  setIsRowFocused: (state: boolean) => void;
  selectedKey: string | undefined | null;
  onRowClick: (key: TableData | null) => void;
}

const TableBody = ({
  table,
  getRowObjectKey,
  isRowFocused,
  setIsRowFocused,
  selectedKey,
  onRowClick,
}: TableBodyProps) => {
  const tableBodyRef = useRef(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      event.preventDefault();
      //@ts-ignore - the `children` property will be available on the `current` property.
      const currentRow = tableBodyRef.current?.children.namedItem(index);
      let newRowId: string | undefined;
      let rowElement: HTMLTableRowElement | null = null;

      if (event.key === 'ArrowUp') {
        rowElement = currentRow?.previousElementSibling;
        newRowId = rowElement?.id;
      } else if (event.key === 'ArrowDown') {
        rowElement = currentRow?.nextElementSibling;
        newRowId = rowElement?.id;
      }

      if (!rowElement) {
        return;
      }

      rowElement.tabIndex = -1;
      rowElement.focus();

      if (!newRowId) {
        onRowClick(null);
        return;
      }

      const newRow = table.rows.find((_, idx) => idx.toString() === newRowId);

      if (newRow) {
        onRowClick(newRow?.originalData);
      }
    },
    [onRowClick, table.rows]
  );

  const handleEmptyRowKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const rowsLength = table.rows.length;

      if (event.key === 'ArrowDown' || !rowsLength) {
        return;
      }

      const newRow = table.rows[rowsLength - 1];
      // @ts-ignore - the `children` property will be available on the `current` property.
      const rowElement = tableBodyRef.current?.children.namedItem(
        rowsLength - 1
      );

      if (!rowElement) {
        return;
      }

      rowElement.tabIndex = -1;
      rowElement.focus();
      onRowClick(newRow?.originalData);
    },
    [onRowClick, table.rows]
  );

  const tableRowClassName = classNames(
    'h-5 outline-0 flex divide-x divide-american-silver dark:divide-quartz',
    selectedKey === null &&
      (isRowFocused
        ? 'bg-gainsboro dark:bg-outer-space'
        : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'),
    selectedKey !== null &&
      (table.rows.length % 2
        ? 'bg-anti-flash-white dark:bg-charleston-green'
        : 'bg-white dark:bg-raisin-black')
  );

  return (
    <div ref={tableBodyRef} className="h-full flex flex-col">
      {table.rows.map((row, index) => (
        <BodyRow
          key={index}
          index={index}
          row={row}
          columns={table.columns}
          selectedKey={selectedKey}
          getRowObjectKey={getRowObjectKey}
          isRowFocused={isRowFocused}
          onRowClick={() => {
            onRowClick(row?.originalData);
            setIsRowFocused(true);
          }}
          onKeyDown={handleKeyDown}
        />
      ))}
      <div
        className={tableRowClassName}
        data-testid="empty-row"
        tabIndex={0}
        onClick={() => {
          onRowClick(null);
          setIsRowFocused(true);
        }}
        onKeyDown={handleEmptyRowKeyDown}
      >
        {table.columns.map(({ width }, index) => (
          <div
            key={index}
            className="px-1 py-px outline-0 flex-1"
            style={{
              maxWidth: width,
            }}
          />
        ))}
      </div>
      <div
        className="grow outline-0 flex divide-x divide-american-silver dark:divide-quartz"
        onClick={() => {
          setIsRowFocused(false);
        }}
      >
        {table.columns.map(({ width }, index) => (
          <div
            key={index}
            className="px-1 py-px outline-0 h-full flex-1"
            style={{
              maxWidth: width,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TableBody;
