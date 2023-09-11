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
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  getSortedRowModel,
} from '@tanstack/react-table';
import { useDebouncedCallback } from 'use-debounce';

/**
 * Internal dependencies.
 */
import Table from '../../../../../design-system/components/table';
import { useContentPanelStore } from '../../../../stateProviders/contentPanelStore';
import type { CookieTableData } from '../../../../cookies.types';

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
        {info.getValue() ? <span className="font-serif">✓</span> : ''}
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
        {info.getValue() ? <span className="font-serif">✓</span> : ''}
      </p>
    ),
  },
  {
    header: 'Category',
    accessorKey: 'analytics.category',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Scope',
    accessorKey: 'isFirstParty',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {!info.getValue() ? 'Third Party' : 'First Party'}
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
    header: 'Cookie Accepted',
    accessorKey: 'isCookieSet',
    cell: (info) => (
      <p className="flex justify-center items-center">
        {info.getValue() ? <span className="font-serif">✓</span> : ''}
      </p>
    ),
  },
];

const CookieTable = ({ cookies, selectedFrame }: CookieTableProps) => {
  const {
    selectedFrameCookie,
    setSelectedFrameCookie,
    tableColumnSize,
    tableContainerRef,
  } = useContentPanelStore(({ state, actions }) => ({
    selectedFrameCookie: state.selectedFrameCookie || {},
    setSelectedFrameCookie: actions.setSelectedFrameCookie,
    tableColumnSize: state.tableColumnSize,
    tableContainerRef: state.tableContainerRef,
  }));

  const [data, setData] = useState<CookieTableData[]>(cookies);
  const [isMouseInsideHeader, setIsMouseInsideHeader] =
    useState<boolean>(false);
  const [enableSorting, setEnableSorting] = useState<boolean>(false);
  const setDebouncedEnableSorting = useDebouncedCallback((value) => {
    setEnableSorting(value);
  }, 10);

  useEffect(() => {
    if (isMouseInsideHeader) {
      setDebouncedEnableSorting(true);
    } else {
      setData(cookies);
      setDebouncedEnableSorting(false);
    }
  }, [cookies, isMouseInsideHeader, setDebouncedEnableSorting]);

  useEffect(() => {
    if (selectedFrame && selectedFrameCookie) {
      if (
        selectedFrameCookie[selectedFrame] === undefined ||
        (selectedFrameCookie[selectedFrame] !== null && data.length === 0)
      ) {
        setSelectedFrameCookie(null);
      }
    }
  }, [selectedFrameCookie, selectedFrame, setSelectedFrameCookie, data.length]);

  const columns: ColumnDef<CookieTableData>[] = useMemo(
    () =>
      tableColumns.map((column) => ({
        ...column,
        sortingFn: 'basic',
        size: tableColumnSize / tableColumns.length,
      })),
    [tableColumnSize]
  );

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    enableSorting,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const onRowClick = useCallback(
    (cookieData: CookieTableData | null) => {
      setSelectedFrameCookie({
        [selectedFrame as string]: cookieData,
      });
    },
    [selectedFrame, setSelectedFrameCookie]
  );

  const selectedKey = Object.values(selectedFrameCookie ?? {})[0];

  return (
    <div
      ref={tableContainerRef}
      className="w-full h-full overflow-auto text-outer-space-crayola"
    >
      <Table
        table={table}
        selectedKey={
          selectedKey === null
            ? null
            : selectedKey?.parsedCookie?.name +
              selectedKey?.parsedCookie?.domain +
              selectedKey?.parsedCookie?.path
        }
        onRowClick={onRowClick}
        onMouseEnter={() => setIsMouseInsideHeader(true)}
        onMouseLeave={() => setIsMouseInsideHeader(false)}
      />
    </div>
  );
};

export default memo(CookieTable);
