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
import { saveAs } from 'file-saver';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { Table, TableColumn, TableData, TableFilter, TableRow } from '../table';
import { TableProvider } from '../table/useTable';
import { generateCookieTableCSV } from '../table/utils';

interface CookieTableProps {
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
  extraInterfaceToTopBar?: React.ReactNode;
  onRowContextMenu?: (
    e: React.MouseEvent<HTMLDivElement>,
    row: TableRow
  ) => void;
}

const CookieTable = forwardRef<
  {
    removeSelectedRow: () => void;
  },
  CookieTableProps
>(function CookieTable(
  {
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

  const exportCookies = useCallback((rows: TableRow[]) => {
    const _cookies = rows.map(({ originalData }) => originalData);
    if (_cookies.length > 0 && 'parsedCookie' in _cookies[0]) {
      const csvTextBlob = generateCookieTableCSV(_cookies as CookieTableData[]);
      saveAs(csvTextBlob, 'Cookies Report.csv');
    }
  }, []);

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

  const conditionalTableRowClasses = useCallback(
    // eslint-disable-next-line complexity
    (row: TableRow, isRowFocused: boolean, rowIndex: number) => {
      const rowKey = getRowObjectKey(row);
      const isBlocked =
        (row.originalData as CookieTableData)?.isBlocked ||
        (((row.originalData as CookieTableData)?.isBlocked ?? false) &&
          (row.originalData as CookieTableData)?.blockedReasons &&
          (row.originalData as CookieTableData)?.blockedReasons?.length);
      const isHighlighted = row.originalData?.highlighted;
      const isDomainInAllowList = (row.originalData as CookieTableData)
        ?.isDomainInAllowList;

      const tableRowClassName = classNames(
        isBlocked &&
          (rowKey !== selectedKey
            ? rowIndex % 2
              ? 'dark:bg-flagged-row-even-dark bg-flagged-row-even-light'
              : 'dark:bg-flagged-row-odd-dark bg-flagged-row-odd-light'
            : isRowFocused
            ? 'bg-gainsboro dark:bg-outer-space'
            : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'),
        isDomainInAllowList &&
          !isBlocked &&
          (rowKey !== selectedKey
            ? rowIndex % 2
              ? 'dark:bg-jungle-green-dark bg-leaf-green-dark'
              : 'dark:bg-jungle-green-light bg-leaf-green-light'
            : isRowFocused
            ? 'bg-gainsboro dark:bg-outer-space'
            : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'),
        rowKey !== selectedKey &&
          !isBlocked &&
          !isDomainInAllowList &&
          (rowIndex % 2
            ? isHighlighted
              ? 'bg-dirty-pink'
              : 'bg-anti-flash-white dark:bg-charleston-green'
            : isHighlighted
            ? 'bg-dirty-pink text-dirty-red dark:text-dirty-red text-dirty-red'
            : 'bg-white dark:bg-raisin-black'),
        rowKey === selectedKey &&
          !isBlocked &&
          !isDomainInAllowList &&
          (isRowFocused
            ? isHighlighted
              ? 'bg-dirty-red'
              : 'bg-gainsboro dark:bg-outer-space'
            : isHighlighted
            ? 'bg-dirty-pink text-dirty-red'
            : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver')
      );

      return tableRowClassName;
    },
    [getRowObjectKey, selectedKey]
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
        conditionalTableRowClasses={conditionalTableRowClasses}
        exportTableData={exportCookies}
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
