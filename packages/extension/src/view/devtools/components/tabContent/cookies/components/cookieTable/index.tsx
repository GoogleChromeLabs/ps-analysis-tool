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
import React from 'react';
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

export interface CookieTableProps {
  cookies: CookieData[];
  selectedKey: string | undefined;
  onRowClick: (key: CookieData) => void;
}

const CookieTable = ({
  cookies: data,
  selectedKey,
  onRowClick,
}: CookieTableProps) => {
  const columns = React.useMemo<ColumnDef<CookieData>[]>(
    () => [
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
        header: 'Retention Period / Expires',
        accessorKey: 'analytics.retention',
        cell: (info) => info.getValue(),
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info) => (info.getValue() ? '✓' : ''),
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
        cell: (info) => (info.getValue() ? '✓' : ''),
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info) => (info.getValue() ? info.getValue() : 'Uncategorised'),
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
            {info.getValue() as string}
          </a>
        ),
      },
    ],
    []
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
    <Table table={table} selectedKey={selectedKey} onRowClick={onRowClick} />
  );
};

export default CookieTable;
