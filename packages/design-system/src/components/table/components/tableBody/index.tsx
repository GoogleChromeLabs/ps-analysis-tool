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
import React, { memo, useCallback, useRef } from 'react';

/**
 * Internal dependencies.
 */
import BodyRow from './bodyRow';
import { useTable } from '../../useTable';

interface TableBodyProps {
  isRowFocused: boolean;
  setIsRowFocused: (state: boolean) => void;
  selectedKey: string | undefined | null;
  rowHeightClass?: string;
}

const TableBody = ({
  isRowFocused,
  setIsRowFocused,
  selectedKey,
  rowHeightClass,
}: TableBodyProps) => {
  const {
    rows,
    columns,
    onRowClick,
    onRowContextMenu,
    getRowObjectKey,
    conditionalTableRowClassesHandler,
    hasVerticalBar,
    getVerticalBarColorHash,
  } = useTable(({ state, actions }) => ({
    rows: state.rows,
    columns: state.columns,
    onRowClick: actions.onRowClick,
    onRowContextMenu: actions.onRowContextMenu,
    getRowObjectKey: actions.getRowObjectKey,
    conditionalTableRowClassesHandler:
      actions.conditionalTableRowClassesHandler,
    hasVerticalBar: actions.hasVerticalBar,
    getVerticalBarColorHash: actions.getVerticalBarColorHash,
  }));

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

        if (rows.length === index + 1) {
          return;
        }
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

      const newRow = rows.find((_, idx) => idx.toString() === newRowId);

      if (newRow) {
        onRowClick(newRow?.originalData);
      }
    },
    [onRowClick, rows]
  );

  return (
    <tbody
      ref={tableBodyRef}
      className="h-full overflow-x-hidden overflow-y-auto"
    >
      {rows.map((row, index) => (
        <BodyRow
          key={index}
          index={index}
          row={row}
          columns={columns}
          selectedKey={selectedKey}
          isRowFocused={isRowFocused}
          getExtraClasses={() => {
            return (
              conditionalTableRowClassesHandler?.(row, isRowFocused, index) ??
              ''
            );
          }}
          hasVerticalBar={hasVerticalBar?.(row) ?? false}
          verticalBarColorHash={getVerticalBarColorHash?.(row) ?? ''}
          getRowObjectKey={getRowObjectKey}
          onRowClick={() => {
            onRowClick(row?.originalData);
            setIsRowFocused(true);
          }}
          onKeyDown={handleKeyDown}
          onRowContextMenu={onRowContextMenu}
          rowHeightClass={rowHeightClass}
        />
      ))}
      <tr
        className="grow outline-0 divide-x divide-american-silver dark:divide-quartz"
        onClick={() => {
          setIsRowFocused(false);
        }}
      >
        {columns.map((_, index) => (
          <td key={index} className="px-1 py-px outline-0 h-full relative">
            <div
              className="absolute right-[-2px] cursor-ew-resize h-full w-2 z-50 top-0"
              data-column-resize-handle={columns[index].accessorKey}
            />
          </td>
        ))}
      </tr>
    </tbody>
  );
};

export default memo(TableBody);
