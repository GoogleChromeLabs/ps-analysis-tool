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

import {
  BLOCK_STATUS,
  type CookieTableData,
  getCookieKey,
} from '@google-psat/common';
import classnames from 'classnames';

import { TableRow } from '../../table';

// eslint-disable-next-line complexity
const conditionalTableRowClassesHandler = (
  row: TableRow,
  isRowFocused: boolean,
  rowIndex: number,
  selectedKey: string | null,
  queryIsBlockedToHighlight: boolean
) => {
  const rowKey = getCookieKey(
    (row?.originalData as CookieTableData).parsedCookie
  ) as string;
  const isBlocked = queryIsBlockedToHighlight
    ? (row.originalData as CookieTableData)?.isBlocked
    : (row.originalData as CookieTableData)?.blockingStatus?.inboundBlock !==
        BLOCK_STATUS.NOT_BLOCKED ||
      (row.originalData as CookieTableData)?.blockingStatus?.outboundBlock !==
        BLOCK_STATUS.NOT_BLOCKED;
  const isDomainInAllowList = (row.originalData as CookieTableData)
    ?.isDomainInAllowList;

  const tableRowClassName = classnames(
    isBlocked &&
      (rowKey !== selectedKey
        ? rowIndex % 2
          ? 'dark:bg-flagged-row-even-dark bg-flagged-row-even-light'
          : 'dark:bg-flagged-row-odd-dark bg-flagged-row-odd-light'
        : isRowFocused
        ? 'bg-selection-yellow-dark dark:bg-selection-yellow-light'
        : 'bg-silver-mist text-black dark:bg-dark-graphite dark:text-chinese-silver'),
    isDomainInAllowList &&
      !isBlocked &&
      (rowKey !== selectedKey
        ? rowIndex % 2
          ? 'dark:bg-jungle-green-dark bg-leaf-green-dark'
          : 'dark:bg-jungle-green-light bg-leaf-green-light'
        : isRowFocused
        ? 'bg-selection-green-dark dark:bg-selection-green-light'
        : 'bg-lavender-sky text-black dark:bg-midnight-slate dark:text-chinese-silver')
  );

  return tableRowClassName;
};

export default conditionalTableRowClassesHandler;
