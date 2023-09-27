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
import React, { useCallback, useEffect, useRef } from 'react';
import { PreferenceDataValues } from '@cookie-analysis-tool/common';
/**
 * Internal dependencies.
 */
import type { TableColumn, TableOutput } from '../useTable';
import HeaderResizer from './headerResizer';
import { ArrowDown } from '../../../icons';

interface HeaderCellProps {
  table: TableOutput;
  index: number;
  cell: TableColumn;
  setIsRowFocused: (state: boolean) => void;
  updatePreference: (
    key: string,
    callback: (prevStatePreference: {
      [key: string]: unknown;
    }) => PreferenceDataValues
  ) => void;
}

const HeaderCell = ({
  table,
  index,
  cell,
  setIsRowFocused,
  updatePreference,
}: HeaderCellProps) => {
  const resizeHandler = useCallback(() => {
    updatePreference(
      'columnSizing',
      (prevStatePreferences: { [key: string]: unknown }) => {
        const currentPreferences = prevStatePreferences || {};
        const currentSizes = {
          ...(currentPreferences['columnSizing']
            ? currentPreferences['columnSizing']
            : null),
          [cell.header]: cell.width,
        };
        return currentSizes;
      }
    );
  }, [cell.header, cell.width, updatePreference]);

  useEffect(() => {
    if (columnRef.current) {
      columnRef.current.addEventListener('mouseup', resizeHandler);
    }
    const tempRef = columnRef.current;
    return () => {
      tempRef?.addEventListener('mouseup', resizeHandler);
    };
  }, [resizeHandler]);

  const handleOnClick = useCallback(() => {
    updatePreference('columnSorting', () => [
      {
        id: cell.header,
        sortOrder: table.sortOrder,
      },
    ]);
    table.setSortKey(cell.accessorKey);
  }, [cell.accessorKey, cell.header, table, updatePreference]);

  const columnRef = useRef<HTMLTableHeaderCellElement>(null);

  return (
    <th
      ref={columnRef}
      style={{ maxWidth: cell.width }}
      onClick={handleOnClick}
      className="border-x border-american-silver dark:border-quartz relative hover:bg-gainsboro dark:hover:bg-outer-space select-none touch-none font-normal"
      data-testid="header-cell"
    >
      <div
        className="w-full h-full flex items-center justify-between text-cool-grey dark:text-bright-gray"
        onClick={() => setIsRowFocused(false)}
      >
        <p className="px-1 py-px truncate text-xs">{cell.header}</p>
        <p className="mr-2 scale-125">
          {table.sortKey === cell.accessorKey &&
            {
              asc: <ArrowDown className="transform rotate-180" />,
              desc: <ArrowDown />,
            }[table.sortOrder]}
        </p>
      </div>
      <HeaderResizer
        onMouseDown={() => {
          table.onMouseDown(columnRef, index);
        }}
      />
    </th>
  );
};

export default HeaderCell;
