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
import type { Table as ReactTable } from '@tanstack/react-table';
import { type Cookie as ParsedCookie } from 'simple-cookie';

/**
 * Internal dependencies.
 */
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import ColumnMenu from './columnMenu';

export type CookieAnalytics = {
  platform: string;
  category: string;
  name: string;
  domain: string;
  description: string;
  retention: string;
  dataController: string;
  gdprUrl: string;
  wildcard: string;
};

export type TableData = {
  parsedCookie: ParsedCookie;
  analytics: CookieAnalytics | null;
  url: string;
  headerType: 'response' | 'request';
  isFirstParty: boolean | null;
  frameIdList: number[];
  isCookieSet: boolean;
};

interface TableProps {
  table: ReactTable<TableData>;
  selectedKey: string | undefined | null;
  onRowClick: (row: TableData | null) => void;
  onMouseEnter: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: (event: React.MouseEvent<HTMLElement>) => void;
}

const Table = ({
  table,
  selectedKey,
  onRowClick,
  onMouseEnter,
  onMouseLeave,
}: TableProps) => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
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
    <>
      <ColumnMenu
        open={showColumnsMenu}
        onClose={setShowColumnsMenu}
        table={table}
        columns={table.getAllLeafColumns()}
        position={columnPosition}
      />
      <table className="w-full h-full" ref={tableRef}>
        <TableHeader
          headerGroups={table.getHeaderGroups()}
          setColumnPosition={setColumnPosition}
          onRightClick={handleRightClick}
          setIsRowFocused={setIsRowFocused}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
        <TableBody
          rows={table.getRowModel().rows}
          isRowFocused={isRowFocused}
          setIsRowFocused={setIsRowFocused}
          selectedKey={selectedKey}
          onRowClick={onRowClick}
          emptyRowCellCount={table.getHeaderGroups()[0].headers.length}
        />
      </table>
    </>
  );
};

export default Table;
