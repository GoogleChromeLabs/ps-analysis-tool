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
import React, { useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  getSortedRowModel,
} from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import type { CookieData } from '../../../../../../../localStore';
import Table from '../../../../table';
import { useContentPanelStore } from '../../../../../stateProviders/contentPanelStore';

export interface CookieTableProps {
  cookies: CookieData[];
}

const CookieTable = ({ cookies: data }: CookieTableProps) => {
  const {
    selectedCookie,
    setSelectedCookie,
    tableColumnSize,
    setTableColumnSize,
    tableContainerRef,
  } = useContentPanelStore(({ state, actions }) => ({
    selectedCookie: state.selectedCookie,
    setSelectedCookie: actions.setSelectedCookie,
    tableColumnSize: state.tableColumnSize,
    setTableColumnSize: actions.setTableColumnSize,
    tableContainerRef: state.tableContainerRef,
  }));

  const columns = React.useMemo<ColumnDef<CookieData>[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info) => info.getValue(),
        enableHiding: false,
        size: tableColumnSize,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info) => info.getValue(),
        size: tableColumnSize,
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info) => info.getValue(),
        size: tableColumnSize,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info) => info.getValue(),
        size: tableColumnSize,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info) => (info.getValue() ? info.getValue() : 'Session'),
        size: tableColumnSize,
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info) => (info.getValue() ? '✓' : ''),
        size: tableColumnSize,
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info) => (
          <span className="capitalize">{info.getValue() as string}</span>
        ),
        size: tableColumnSize,
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info) => (info.getValue() ? '✓' : ''),
        size: tableColumnSize,
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info) => (info.getValue() ? info.getValue() : 'Uncategorised'),
        size: tableColumnSize,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info) => info.getValue(),
        size: tableColumnSize,
      },
      {
        header: 'GDPR Portal',
        accessorKey: 'analytics.gdprUrl',
        cell: (info) => (
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href={info.getValue() as string}
            rel="noreferrer"
          >
            <abbr title={info.getValue() as string}>
              {info.getValue() as string}
            </abbr>
          </a>
        ),
        size: tableColumnSize,
      },
    ],
    [tableColumnSize]
  );

  useEffect(() => {
    const handleResize = () => {
      if (tableContainerRef.current) {
        setTableColumnSize(
          tableContainerRef.current.offsetWidth / columns.length
        );
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [columns.length, setTableColumnSize, tableContainerRef]);

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div ref={tableContainerRef} className="w-full h-full overflow-auto">
      <Table
        table={table}
        selectedKey={selectedCookie?.parsedCookie.name}
        onRowClick={setSelectedCookie}
      />
    </div>
  );
};

export default CookieTable;
