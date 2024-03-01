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
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
} from 'react';
import { CookieTableData, getCookieKey } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { Table, TableColumn, TableData, TableFilter, TableRow } from '../table';
import { TableProvider } from '../table/useTable/provider';
import { conditionalTableRowClassesHandler, exportCookies } from './utils';

interface CookieTableProps {
  queryIsBlockedToHighlight?: boolean;
  data: TableData[];
  tableColumns: TableColumn[];
  tableFilters?: TableFilter;
  tableSearchKeys?: string[];
  tablePersistentSettingsKey?: string;
  selectedFrame: string | null;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
  extraInterfaceToTopBar?: () => React.JSX.Element;
  onRowContextMenu?: (
    e: React.MouseEvent<HTMLDivElement>,
    row: TableRow
  ) => void;
  hideExport?: boolean;
}

const CookieTable = forwardRef<
  {
    removeSelectedRow: () => void;
  },
  CookieTableProps
>(function CookieTable(
  {
    queryIsBlockedToHighlight = true,
    tableColumns,
    tableFilters,
    tableSearchKeys,
    tablePersistentSettingsKey,
    data: cookies,
    selectedFrame,
    selectedFrameCookie,
    setSelectedFrameCookie,
    extraInterfaceToTopBar,
    onRowContextMenu,
    hideExport,
  }: CookieTableProps,
  ref
) {
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

  const onRowContextMenuHandler = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, row: TableRow) => {
      onRowContextMenu?.(e, row);
      onRowClick(row?.originalData);
    },
    [onRowClick, onRowContextMenu]
  );

  const getRowObjectKey = useCallback(
    (row: TableRow) =>
      getCookieKey(
        (row?.originalData as CookieTableData).parsedCookie
      ) as string,
    []
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        removeSelectedRow: () => {
          onRowClick(null);
        },
      };
    },
    [onRowClick]
  );

  const selectedKey = useMemo(() => {
    const key = Object.values(selectedFrameCookie ?? {})[0];

    return key === null ? null : getCookieKey(key?.parsedCookie);
  }, [selectedFrameCookie]);

  const _conditionalTableRowClassesHandler = useCallback(
    (row: TableRow, isRowFocused: boolean, rowIndex: number) => {
      return conditionalTableRowClassesHandler(
        row,
        isRowFocused,
        rowIndex,
        selectedKey,
        queryIsBlockedToHighlight
      );
    },
    [selectedKey, queryIsBlockedToHighlight]
  );

  const hasVerticalBar = useCallback((row: TableRow) => {
    const isDomainInAllowList = (row.originalData as CookieTableData)
      ?.isDomainInAllowList;
    return Boolean(isDomainInAllowList);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', () => forceUpdate());
    return () => {
      window.removeEventListener('resize', () => forceUpdate());
    };
  }, []);

  // TODO: Move TableProvider and logic to one level up in extension and cli-dashboard, for allowing modularity.
  return (
    <div className="flex-1 w-full h-full overflow-x-auto text-outer-space-crayola border-x border-american-silver dark:border-quartz">
      <TableProvider
        data={cookies}
        tableColumns={tableColumns}
        tableFilterData={tableFilters}
        tableSearchKeys={tableSearchKeys}
        tablePersistentSettingsKey={tablePersistentSettingsKey}
        onRowClick={onRowClick}
        onRowContextMenu={onRowContextMenuHandler}
        getRowObjectKey={getRowObjectKey}
        conditionalTableRowClassesHandler={_conditionalTableRowClassesHandler}
        exportTableData={!hideExport ? exportCookies : undefined}
        hasVerticalBar={hasVerticalBar}
      >
        <Table
          selectedKey={selectedKey}
          extraInterfaceToTopBar={extraInterfaceToTopBar}
        />
      </TableProvider>
    </div>
  );
});

export default CookieTable;
