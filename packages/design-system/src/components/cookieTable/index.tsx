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

/**
 * Internal dependencies.
 */
import { Table, TableColumn, TableData, TableRow, useTable } from '../table';
import { CookieTableData, getCookieKey } from '@cookie-analysis-tool/common';

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
}

const CookieTable = ({
  tableColumns,
  data: cookies,
  selectedFrame,
  selectedFrameCookie,
  setSelectedFrameCookie,
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
  }, [
    selectedFrameCookie,
    selectedFrame,
    setSelectedFrameCookie,
    cookies.length,
  ]);

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
  });

  return (
    <div className="w-full h-full overflow-auto text-outer-space-crayola border-x border-american-silver dark:border-quartz">
      <Table
        table={table}
        selectedKey={
          selectedKey === null ? null : getCookieKey(selectedKey?.parsedCookie)
        }
        onRowClick={onRowClick}
        getRowObjectKey={(row: TableRow) =>
          getCookieKey(Object.values(row)?.[0]?.originalData.parsedCookie)
        }
      />
    </div>
  );
};

export default CookieTable;
