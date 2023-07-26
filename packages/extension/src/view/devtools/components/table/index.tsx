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
import React, { useCallback, useState } from 'react';
import type { Table as ReactTable } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import type { CookieData } from '../../../../localStore';
import ColumnMenu from './columnMenu';

export type TData = CookieData;

interface TableProps {
  table: ReactTable<TData>;
  selectedKey: string | undefined;
  onRowClick: (row: TData) => void;
}

const Table = ({ table, selectedKey, onRowClick }: TableProps) => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

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
      />
      <table className="w-full">
        <TableHeader
          headerGroups={table.getHeaderGroups()}
          onRightClick={handleRightClick}
        />
        <TableBody
          rows={table.getRowModel().rows}
          selectedKey={selectedKey}
          onRowClick={onRowClick}
        />
      </table>
    </>
  );
};

export default Table;
