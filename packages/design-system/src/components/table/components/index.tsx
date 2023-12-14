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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Resizable } from 're-resizable';
import { PreferenceDataValues } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import ColumnMenu from './columnMenu';
import { TableData, TableOutput, TableRow } from '../useTable';
import { noop } from '../../../utils';
import TableTopBar from './tableTopBar';
import ChipsBar from './filtersSidebar/chips';
import FiltersSidebar from './filtersSidebar';

interface TableProps {
  table: TableOutput;
  selectedKey: string | undefined | null;
  getRowObjectKey: (row: TableRow) => string;
  onRowClick: (row: TableData | null) => void;
  updatePreference?: (
    key: string,
    updater: (prevStatePreference: {
      [key: string]: unknown;
    }) => PreferenceDataValues
  ) => void;
  showTopBar?: boolean;
  disableFiltering?: boolean;
}

const Table = ({
  table,
  selectedKey,
  getRowObjectKey,
  onRowClick,
  updatePreference = noop,
  showTopBar = false,
  disableFiltering = false,
}: TableProps) => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isRowFocused, setIsRowFocused] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setIsRowFocused(true);
      }
    };
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (selectedKey === undefined) {
      setIsRowFocused(false);
    } else {
      setIsRowFocused(true);
    }
  }, [selectedKey]);

  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      document.body.style.overflow = showColumnsMenu ? 'auto' : 'hidden';
      setShowColumnsMenu(!showColumnsMenu);
    },
    [showColumnsMenu]
  );

  return (
    <div className="w-full h-full flex flex-col">
      {showTopBar && (
        <TableTopBar
          searchValue={table.searchValue}
          setSearchValue={table.setSearchValue}
          showFilterSidebar={showFilterSidebar}
          disableFiltering={disableFiltering}
          setShowFilterSidebar={setShowFilterSidebar}
          cookiesCount={table.rows.length}
        />
      )}
      <ChipsBar
        selectedFilters={table.selectedFilters}
        toggleFilterSelection={table.toggleFilterSelection}
        resetFilters={table.resetFilters}
      />
      <div className="w-full flex-1 overflow-hidden h-full flex divide-x divide-american-silver dark:divide-quartz">
        {showFilterSidebar && (
          <Resizable
            minWidth="100px"
            maxWidth="50%"
            enable={{
              right: true,
            }}
          >
            <FiltersSidebar
              filters={table.filters}
              toggleFilterSelection={table.toggleFilterSelection}
            />
          </Resizable>
        )}
        <div
          ref={table.tableContainerRef}
          className="relative h-full w-full overflow-auto"
        >
          <ColumnMenu
            updatePreference={updatePreference}
            table={table}
            open={showColumnsMenu}
            onClose={setShowColumnsMenu}
            position={columnPosition}
          />
          <div
            className="h-full w-full overflow-auto min-w-[70rem]"
            ref={tableRef}
          >
            <TableHeader
              updatePreference={updatePreference}
              table={table}
              setColumnPosition={setColumnPosition}
              onRightClick={handleRightClick}
              setIsRowFocused={setIsRowFocused}
            />
            <TableBody
              table={table}
              getRowObjectKey={getRowObjectKey}
              isRowFocused={isRowFocused}
              setIsRowFocused={setIsRowFocused}
              selectedKey={selectedKey}
              onRowClick={onRowClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
