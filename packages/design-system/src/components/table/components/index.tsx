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
import React, { memo, useCallback, useEffect, useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import ColumnMenu from './columnMenu';
import { useTable } from '../useTable';
import TableTopBar from './tableTopBar';
import TableChipsBar from './filtersSidebar/chips';
import TableFiltersSidebar from './filtersSidebar';
import classNames from 'classnames';
interface TableProps {
  selectedKey: string | undefined | null;
  isFiltersSidebarOpen?: boolean;
  hideFiltering?: boolean;
  extraInterfaceToTopBar?: () => React.JSX.Element;
  minWidth?: string;
  hideSearch?: boolean;
  hideTableTopBar?: boolean;
  rowHeightClass?: string;
  shouldScroll?: boolean;
  showOverflow?: boolean;
}

const Table = ({
  selectedKey,
  isFiltersSidebarOpen = false,
  hideFiltering = false,
  extraInterfaceToTopBar,
  minWidth,
  hideSearch,
  hideTableTopBar,
  rowHeightClass,
  shouldScroll = false,
  showOverflow = true,
}: TableProps) => {
  const {
    filters,
    isSelectAllFilterSelected,
    toggleFilterSelection,
    toggleSelectAllFilter,
    selectedFilters,
    resetFilters,
    rows,
    searchValue,
    setSearchValue,
    exportTableData,
    count,
    tableContainerRef,
    loadMoreData,
    hasMoreData,
    tableRef,
  } = useTable(({ state, actions }) => ({
    filters: state.filters,
    isSelectAllFilterSelected: actions.isSelectAllFilterSelected,
    toggleFilterSelection: actions.toggleFilterSelection,
    toggleSelectAllFilter: actions.toggleSelectAllFilter,
    selectedFilters: state.selectedFilters,
    resetFilters: actions.resetFilters,
    rows: state.rows,
    searchValue: state.searchValue,
    setSearchValue: actions.setSearchValue,
    exportTableData: actions.exportTableData,
    count: state.count,
    tableContainerRef: state.tableContainerRef,
    loadMoreData: actions.loadMoreData,
    hasMoreData: state.hasMoreData,
    tableRef: state.tableRef,
  }));

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] =
    useState(isFiltersSidebarOpen);
  const [columnPosition, setColumnPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isRowFocused, setIsRowFocused] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef?.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setIsRowFocused(false);
      }
    };
    globalThis?.document?.addEventListener('click', handleClickOutside, true);

    return () => {
      globalThis?.document?.removeEventListener(
        'click',
        handleClickOutside,
        true
      );
    };
  }, [tableRef]);

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

  const scrollListener = useCallback(
    (event: React.UIEvent<HTMLTableElement>) => {
      const target = event.target as HTMLTableElement;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      if (Math.ceil(scrollTop + clientHeight) >= scrollHeight && hasMoreData) {
        loadMoreData();
      }
    },
    [hasMoreData, loadMoreData]
  );

  return (
    <div className="w-full h-full flex flex-col text-raisin-black dark:text-bright-gray overflow-hidden">
      {!hideTableTopBar && (
        <>
          <TableTopBar
            showFilterSidebar={showFilterSidebar}
            hideFiltering={hideFiltering}
            setShowFilterSidebar={setShowFilterSidebar}
            extraInterface={extraInterfaceToTopBar}
            hideSearch={hideSearch}
            rows={rows}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            exportTableData={exportTableData}
            count={count}
          />
          <div className="flex items-center justify-between gap-1 py-0.5 bg-anti-flash-white dark:bg-raisin-black">
            {!hideFiltering && (
              <TableChipsBar
                selectedFilters={selectedFilters}
                resetFilters={resetFilters}
                toggleFilterSelection={toggleFilterSelection}
              />
            )}
          </div>
        </>
      )}
      <div className="w-full flex-1 h-full flex divide-x divide-american-silver dark:divide-quartz border-t border-gray-300 dark:border-quartz overflow-auto">
        {showFilterSidebar && (
          <Resizable
            minWidth="100px"
            maxWidth="50%"
            enable={{
              right: true,
            }}
            className="overflow-auto h-full"
          >
            <TableFiltersSidebar
              filters={filters}
              isSelectAllFilterSelected={isSelectAllFilterSelected}
              toggleFilterSelection={toggleFilterSelection}
              toggleSelectAllFilter={toggleSelectAllFilter}
            />
          </Resizable>
        )}
        <div
          ref={tableContainerRef}
          className={classNames('relative h-full w-full flex-1', {
            'overflow-auto': showOverflow,
          })}
          onScroll={scrollListener}
        >
          <ColumnMenu
            open={showColumnsMenu}
            onClose={setShowColumnsMenu}
            position={columnPosition}
          />
          <table
            className="h-full w-full table-fixed border-separate border-spacing-0 relative border-r border-american-silver dark:border-quartz overflow-clip"
            style={{
              minWidth: minWidth ?? 'auto',
            }}
            ref={tableRef}
          >
            <TableHeader
              setColumnPosition={setColumnPosition}
              onRightClick={handleRightClick}
              setIsRowFocused={setIsRowFocused}
            />
            <TableBody
              isRowFocused={isRowFocused}
              setIsRowFocused={setIsRowFocused}
              selectedKey={selectedKey}
              rowHeightClass={rowHeightClass}
              shouldScroll={shouldScroll}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export default memo(Table);
