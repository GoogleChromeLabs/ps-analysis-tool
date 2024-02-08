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

import { CookieTableData, getCookieKey } from '@ps-analysis-tool/common';
import classnames from 'classnames';

import { TableRow } from '../../table';

// eslint-disable-next-line complexity
const conditionalTableRowClassesHandler = (
  row: TableRow,
  isRowFocused: boolean,
  rowIndex: number,
  selectedKey: string | null,
  useIsBlockedToHighlight: boolean
) => {
  const rowKey = getCookieKey(
    (row?.originalData as CookieTableData).parsedCookie
  ) as string;
  const isBlocked = useIsBlockedToHighlight
    ? (row.originalData as CookieTableData)?.isBlocked
    : (row.originalData as CookieTableData)?.blockingStatus?.inboundBlock;
  const isHighlighted = row.originalData?.highlighted;
  const isDomainInAllowList = (row.originalData as CookieTableData)
    ?.isDomainInAllowList;

  const tableRowClassName = classnames(
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
};

export default conditionalTableRowClassesHandler;
