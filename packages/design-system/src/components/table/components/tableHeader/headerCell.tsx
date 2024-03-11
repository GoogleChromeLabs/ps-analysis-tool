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
/**
 * Internal dependencies.
 */
import HeaderResizer from './headerResizer';
import { useTable, type TableColumn } from '../../useTable';
import { ArrowDown } from '../../../../icons';

interface HeaderCellProps {
  index: number;
  cell: TableColumn;
  setIsRowFocused: (state: boolean) => void;
}

const HeaderCell = ({ index, cell, setIsRowFocused }: HeaderCellProps) => {
  const { sortKey, sortOrder, isResizing, setSortKey, onMouseDown } = useTable(
    ({ state, actions }) => ({
      sortKey: state.sortKey,
      sortOrder: state.sortOrder,
      isResizing: state.isResizing,
      setSortKey: actions.setSortKey,
      onMouseDown: actions.onMouseDown,
    })
  );

  const handleOnClick = useCallback(() => {
    setSortKey(cell.accessorKey);
  }, [cell.accessorKey, setSortKey]);

  const columnRef = useRef<HTMLTableHeaderCellElement>(null);

  return (
    <div
      ref={columnRef}
      style={{ minWidth: cell.width }}
      onClick={isResizing ? undefined : handleOnClick}
      className={`relative select-none touch-none font-normal truncate flex-1 ${
        !isResizing && 'hover:bg-gainsboro dark:hover:bg-outer-space'
      }`}
      data-testid="header-cell"
    >
      <div
        className="w-full h-full flex items-center justify-between text-cool-grey dark:text-bright-gray"
        onClick={() => setIsRowFocused(false)}
        title={cell.header}
      >
        <p className="px-1 py-px truncate text-xs">{cell.header}</p>
        <p className="mr-2 scale-125">
          {sortKey === cell.accessorKey &&
            {
              asc: <ArrowDown className="transform rotate-180" />,
              desc: <ArrowDown />,
            }[sortOrder]}
        </p>
      </div>
      <HeaderResizer
        onMouseDown={() => {
          onMouseDown(columnRef, index);
        }}
      />
    </div>
  );
};

export default HeaderCell;
