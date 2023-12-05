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
import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import {
  CookieTableData,
  PreferenceDataValues,
  SortingState,
  getCookieKey,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { Table, TableColumn, TableData, TableRow, useTable } from '../table';
import { noop } from '../../utils';

interface CookieTableProps {
  tableColumns: TableColumn[];
  data: TableData[];
  selectedFrame: string | null;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
  updatePreference?: (
    key: string,
    updater: (prevStatePreference: {
      [key: string]: unknown;
    }) => PreferenceDataValues
  ) => void;
  columnSorting?: SortingState[];
  columnSizing?: Record<string, number>;
  selectedColumns?: Record<string, boolean>;
}

const CookieTable = ({
  tableColumns,
  data: cookies,
  selectedFrame,
  selectedFrameCookie,
  setSelectedFrameCookie,
  updatePreference = noop,
  columnSorting,
  columnSizing,
  selectedColumns,
}: CookieTableProps) => {
  useEffect(() => {
    if (selectedFrame && selectedFrameCookie) {
      if (
        selectedFrameCookie[selectedFrame] === undefined ||
        (selectedFrameCookie[selectedFrame] !== null && cookies.length === 0)
      ) {
        setSelectedFrameCookie(null);
      }
    }
  }, [selectedFrameCookie, selectedFrame, setSelectedFrameCookie, cookies]);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const onRowClick = useCallback(
    (cookieData: TableData | null) => {
      setSelectedFrameCookie({
        [selectedFrame as string]: cookieData as CookieTableData | null,
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
          : undefined,
      columnSorting:
        columnSorting && columnSorting.length > 0
          ? columnSorting[0]
          : undefined,
      selectedColumns:
        selectedColumns && Object.keys(selectedColumns).length > 0
          ? selectedColumns
          : undefined,
    },
  });

  useEffect(() => {
    window.addEventListener('resize', () => forceUpdate());
    return () => {
      window.removeEventListener('resize', () => forceUpdate());
    };
  }, []);

  return (
    <div className="flex-1 w-full h-full overflow-x-auto text-outer-space-crayola border-x border-american-silver dark:border-quartz">
      <Table
        updatePreference={updatePreference}
        table={table}
        selectedKey={
          selectedKey === null ? null : getCookieKey(selectedKey?.parsedCookie)
        }
        getRowObjectKey={(row: TableRow) =>
          getCookieKey(
            (row?.originalData as CookieTableData).parsedCookie
          ) as string
        }
        onRowClick={onRowClick}
      />
    </div>
  );
};

export default CookieTable;
