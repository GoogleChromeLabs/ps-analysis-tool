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
import React, { useCallback } from 'react';
/**
 * Internal dependencies.
 */
import { useTable, type TableColumn } from '../../useTable';
import { ArrowDown } from '../../../../icons';
import classNames from 'classnames';
import { columnResizeHandleClassName } from '../../useTable/useColumnResizing';
interface HeaderCellProps {
  cell: TableColumn;
  setIsRowFocused: (state: boolean) => void;
}

const HeaderCell = ({ cell, setIsRowFocused }: HeaderCellProps) => {
  const { sortKey, sortOrder, setSortKey, isResizing } = useTable(
    ({ state, actions }) => ({
      sortKey: state.sortKey,
      sortOrder: state.sortOrder,
      setSortKey: actions.setSortKey,
      isResizing: state.isResizing,
    })
  );

  const handleOnClick = useCallback(() => {
    setSortKey(cell.accessorKey);
  }, [cell.accessorKey, setSortKey]);

  return (
    <>
      <th
        onClick={isResizing ? undefined : handleOnClick}
        className={classNames(
          'max-w-80 select-none touch-none font-normal truncate sticky top-0 z-[100]',
          'bg-anti-flash-white dark:bg-charleston-green border-b border-l border-american-silver dark:border-quartz divide-x divide-american-silver dark:divide-quartz',
          {
            'hover:bg-gainsboro dark:hover:bg-outer-space': !isResizing,
          }
        )}
        data-testid="header-cell"
      >
        <div
          className="w-full h-full relative flex items-center justify-between text-cool-grey dark:text-bright-gray max-w"
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
          <div
            className={classNames(
              columnResizeHandleClassName,
              'absolute right-[-2px] cursor-ew-resize h-full w-2'
            )}
          />
        </div>
      </th>
    </>
  );
};

export default HeaderCell;
