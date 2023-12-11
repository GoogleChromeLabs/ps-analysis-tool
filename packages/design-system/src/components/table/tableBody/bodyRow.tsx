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
import classNames from 'classnames';
import { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import BodyCell from './bodyCell';
import type { TableColumn, TableRow } from '../useTable';

interface BodyRowProps {
  row: TableRow;
  columns: TableColumn[];
  index: number;
  isRowFocused: boolean;
  selectedKey: string | undefined | null;
  getRowObjectKey: (row: TableRow) => string;
  onRowClick: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
}

const BodyRow = ({
  row,
  columns,
  index,
  selectedKey,
  getRowObjectKey,
  isRowFocused,
  onRowClick,
  onKeyDown,
}: BodyRowProps) => {
  const cookieKey = getRowObjectKey(row);
  const isHighlighted = (row.originalData as CookieTableData)?.highlighted;
  const tableRowClassName = classNames(
    'outline-0 flex divide-x divide-american-silver dark:divide-quartz',
    cookieKey !== selectedKey &&
      (index % 2
        ? isHighlighted
          ? 'bg-dirty-pink'
          : 'bg-anti-flash-white dark:bg-charleston-green'
        : isHighlighted
        ? 'bg-dirty-pink text-dirty-red dark:text-dirty-red text-dirty-red'
        : 'bg-white dark:bg-raisin-black'),
    cookieKey === selectedKey &&
      (isRowFocused
        ? isHighlighted
          ? 'bg-dirty-red'
          : 'bg-gainsboro dark:bg-outer-space'
        : isHighlighted
        ? 'bg-dirty-pink text-dirty-red'
        : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver')
  );

  return (
    <div
      id={index.toString()}
      className={tableRowClassName}
      onClick={onRowClick}
      onKeyDown={(e) => onKeyDown(e, index)}
      data-testid="body-row"
    >
      {columns.map(({ accessorKey, width }, idx) => (
        <BodyCell
          key={idx}
          cell={row[accessorKey]?.value || ''}
          width={width || 0}
          isHighlighted={isHighlighted}
          isRowFocused={cookieKey === selectedKey}
        />
      ))}
    </div>
  );
};

export default BodyRow;
