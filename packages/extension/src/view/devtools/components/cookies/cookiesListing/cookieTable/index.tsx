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
import React, { useCallback, useEffect, useMemo } from 'react';
import type {
  CookieTableData,
  SortingState,
} from '@cookie-analysis-tool/common';
import {
  useTable,
  Table,
  type InfoType,
  type TableColumn,
  type TableRow,
} from '@cookie-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useContentPanelStore } from '../../../../stateProviders/contentPanelStore';
import { getCookieKey } from '../../../../../../utils/getCookieKey';
import { usePreferenceStore } from '../../../../stateProviders/preferenceStore';

export interface CookieTableProps {
  cookies: CookieTableData[];
  selectedFrame: string | null;
}

const CookieTable = ({ cookies, selectedFrame }: CookieTableProps) => {
  const { selectedFrameCookie, setSelectedFrameCookie } = useContentPanelStore(
    ({ state, actions }) => ({
      selectedFrameCookie: state.selectedFrameCookie || {},
      setSelectedFrameCookie: actions.setSelectedFrameCookie,
    })
  );

  useEffect(() => {
    if (selectedFrame && selectedFrameCookie) {
      if (
        selectedFrameCookie[selectedFrame] === undefined ||
        (selectedFrameCookie[selectedFrame] !== null && cookies.length === 0)
      ) {
        setSelectedFrameCookie(null);
      }
    }
  }, [
    selectedFrameCookie,
    selectedFrame,
    setSelectedFrameCookie,
    cookies.length,
  ]);
  const { updatePreference, columnSorting, columnSizing, selectedColumns } =
    usePreferenceStore(({ actions, state }) => ({
      updatePreference: actions.updatePreference,
      columnSorting: state.columnSorting as SortingState[],
      columnSizing: state.columnSizing as Record<string, number>,
      selectedColumns: state.selectedColumns as Record<string, boolean>,
    }));
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Name',
        accessorKey: 'parsedCookie.name',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: 'Value',
        accessorKey: 'parsedCookie.value',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Domain',
        accessorKey: 'parsedCookie.domain',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Path',
        accessorKey: 'parsedCookie.path',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Expires / Max-Age',
        accessorKey: 'parsedCookie.expires',
        cell: (info: InfoType) => (info ? info : 'Session'),
      },
      {
        header: 'HttpOnly',
        accessorKey: 'parsedCookie.httponly',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'SameSite',
        accessorKey: 'parsedCookie.samesite',
        cell: (info: InfoType) => <span className="capitalize">{info}</span>,
      },
      {
        header: 'Secure',
        accessorKey: 'parsedCookie.secure',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'Category',
        accessorKey: 'analytics.category',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Platform',
        accessorKey: 'analytics.platform',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Scope',
        accessorKey: 'isFirstParty',
        cell: (info: InfoType) => (
          <p className="truncate w-full">
            {!info ? 'Third Party' : 'First Party'}
          </p>
        ),
      },
      {
        header: 'Cookie Accepted',
        accessorKey: 'isCookieSet',
        cell: (info: InfoType) => (
          <p className="flex justify-center items-center">
            {info ? <span className="font-serif">✓</span> : ''}
          </p>
        ),
      },
      {
        header: 'GDPR Portal',
        accessorKey: 'analytics.gdprUrl',
        cell: (info: InfoType) => (
          <a
            className="text-blue-500 hover:underline"
            target="_blank"
            href={info as string}
            rel="noreferrer"
          >
            <abbr title={info as string}>{info}</abbr>
          </a>
        ),
      },
    ],
    []
  );

  // const table = useReactTable({
  //   data: columnSorting && columnSorting?.length > 0 ? cookies : data,
  //   columns,
  //   enableColumnResizing: true,
  //   enableSorting:
  //     columnSorting && columnSorting?.length > 0 ? true : enableSorting,
  //   columnResizeMode: 'onChange',
  //   getCoreRowModel: getCoreRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  //   initialState: {
  //     sorting: columnSorting && columnSorting?.length > 0 ? columnSorting : [],
  //     columnVisibility:
  //       selectedColumns && Object.keys(selectedColumns).length > 0
  //         ? selectedColumns
  //         : {},
  //     columnSizing:
  //       columnSizing && Object.keys(columnSizing).length > 0
  //         ? columnSizing
  //         : {},
  //   },
  // });
  const onRowClick = useCallback(
    (cookieData: CookieTableData | null) => {
      setSelectedFrameCookie({
        [selectedFrame as string]: cookieData,
      });
    },
    [selectedFrame, setSelectedFrameCookie]
  );

  const selectedKey = useMemo(
    () => Object.values(selectedFrameCookie ?? {})[0],
    [selectedFrameCookie]
  );

  const table = useTable({
    tableColumns,
    data: cookies,
    options: {
      columnSizing:
        columnSizing && Object.keys(columnSizing).length > 0
          ? columnSizing
          : {},
      columnSorting:
        columnSorting && columnSorting.length > 0 ? columnSorting[0] : {},
      selectedColumns:
        selectedColumns && Object.keys(selectedColumns).length > 0
          ? selectedColumns
          : {},
    },
  });

  return (
    <div className="w-full h-full overflow-auto text-outer-space-crayola">
      <Table
        updatePreference={updatePreference}
        table={table}
        selectedKey={
          selectedKey === null ? null : getCookieKey(selectedKey?.parsedCookie)
        }
        getRowObjectKey={(row: TableRow) =>
          getCookieKey(Object.values(row)?.[0]?.originalData.parsedCookie)
        }
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default CookieTable;
