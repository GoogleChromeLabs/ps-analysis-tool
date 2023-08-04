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
import React, { useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  getSortedRowModel,
} from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import Table from '../../../../table';
import { useContentPanelStore } from '../../../../../stateProviders/contentPanelStore';
import CheckIcon from '../../../../../../../../icons/check.svg';
import type { CookieTableData } from '../../../../../stateProviders/syncCookieStore';

export interface CookieTableProps {
  cookies: CookieTableData[];
  selectedFrame: string | null;
}

const tableColumns: ColumnDef<CookieTableData>[] = [
  {
    header: 'Name',
    accessorKey: 'parsedCookie.name',
    cell: (info) => info.getValue(),
    enableHiding: false,
  },
  {
    header: 'Value',
    accessorKey: 'parsedCookie.value',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Domain',
    accessorKey: 'parsedCookie.domain',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Path',
    accessorKey: 'parsedCookie.path',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Expires / Max-Age',
    accessorKey: 'parsedCookie.expires',
    cell: (info) => (info.getValue() ? info.getValue() : 'Session'),
  },
  {
    header: 'HttpOnly',
    accessorKey: 'parsedCookie.httponly',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {info.getValue() ? <CheckIcon className="scale-125" /> : ''}
      </p>
    ),
  },
  {
    header: 'SameSite',
    accessorKey: 'parsedCookie.samesite',
    cell: (info) => (
      <span className="capitalize">{info.getValue() as string}</span>
    ),
  },
  {
    header: 'Secure',
    accessorKey: 'parsedCookie.secure',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {info.getValue() ? <CheckIcon className="scale-125" /> : ''}
      </p>
    ),
  },
  {
    header: 'Category',
    accessorKey: 'analytics.category',
    cell: (info) => (info.getValue() ? info.getValue() : 'Uncategorised'),
  },
  {
    header: 'Third Party',
    accessorKey: 'isFirstParty',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {!info.getValue() ? <CheckIcon className="scale-125" /> : ''}
      </p>
    ),
  },
  {
    header: 'Platform',
    accessorKey: 'analytics.platform',
    cell: (info) => info.getValue(),
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
  },
  {
    header: 'IBC Compliant',
    accessorKey: 'isIbcCompliant',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {info.getValue() ? <CheckIcon className="scale-125" /> : ''}
      </p>
    ),
  },
  {
    header: 'Cookie Accepted',
    accessorKey: 'isCookieSet',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {info.getValue() ? <CheckIcon className="scale-125" /> : ''}
      </p>
    ),
  },
];

const CookieTable = ({ cookies: data, selectedFrame }: CookieTableProps) => {
  const {
    selectedCookie,
    setSelectedCookie,
    tableColumnSize,
    tableContainerRef,
  } = useContentPanelStore(({ state, actions }) => ({
    selectedCookie: state.selectedCookie,
    setSelectedCookie: actions.setSelectedCookie,
    tableColumnSize: state.tableColumnSize,
    tableContainerRef: state.tableContainerRef,
  }));

  useEffect(() => {
    setSelectedCookie(null);
  }, [selectedFrame, setSelectedCookie]);

  const columns = useMemo(
    () =>
      tableColumns.map((column) => ({
        ...column,
        size: tableColumnSize / tableColumns.length,
      })),
    [tableColumnSize]
  );

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      ref={tableContainerRef}
      className="w-full h-full overflow-auto text-outer-space"
    >
      <Table
        table={table}
        selectedKey={selectedCookie?.parsedCookie.name}
        onRowClick={setSelectedCookie}
      />
    </div>
  );
};

export default CookieTable;
