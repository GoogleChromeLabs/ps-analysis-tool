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
import React, { useMemo } from 'react';

/**
 * Internal dependencies.
 */
import type { CookieTableData, SortingState } from '@ps-analysis-tool/common';
import {
  type InfoType,
  type TableColumn,
  CookieTable,
} from '@ps-analysis-tool/design-system';
import { usePreferenceStore } from '../../../../stateProviders/preferenceStore';

export interface CookieTableContainerProps {
  cookies: CookieTableData[];
  selectedFrame: string | null;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
}

const CookieTableContainer = ({
  cookies,
  selectedFrame,
  selectedFrameCookie,
  setSelectedFrameCookie,
}: CookieTableContainerProps) => {
  const { updatePreference, columnSorting, columnSizing, selectedColumns } =
    usePreferenceStore(({ actions, state }) => ({
      updatePreference: actions.updatePreference,
      columnSorting: state?.columnSorting as SortingState[],
      columnSizing: state?.columnSizing as Record<string, number>,
      selectedColumns: state?.selectedColumns as Record<string, boolean>,
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

  return (
    <CookieTable
      tableColumns={tableColumns}
      data={cookies}
      selectedFrame={selectedFrame}
      selectedFrameCookie={selectedFrameCookie}
      setSelectedFrameCookie={setSelectedFrameCookie}
      columnSorting={columnSorting}
      columnSizing={columnSizing}
      selectedColumns={selectedColumns}
      updatePreference={updatePreference}
    />
  );
};

export default CookieTableContainer;
