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
import { type Row } from '@tanstack/react-table';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import type { TableData } from '..';
import BodyCell from './bodyCell';

interface BodyRowProps {
  row: Row<TableData>;
  index: number;
  isRowFocused: boolean;
  selectedKey: string | undefined | null;
  onRowClick: () => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    row: Row<TableData>
  ) => void;
}

const BodyRow = ({
  row,
  index,
  selectedKey,
  isRowFocused,
  onRowClick,
  onKeyDown,
}: BodyRowProps) => {
  const tableRowClassName = classNames(
    'outline-0',
    row.original.parsedCookie.name !== selectedKey &&
      (index % 2
        ? 'bg-anti-flash-white dark:bg-charleston-green'
        : 'bg-white dark:bg-raisin-black'),
    row.original.parsedCookie.name === selectedKey &&
      (isRowFocused
        ? 'bg-gainsboro dark:bg-outer-space'
        : 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver')
  );

  return (
    <tr
      id={row.id}
      className={tableRowClassName}
      onClick={onRowClick}
      onKeyDown={(e) => onKeyDown(e, row)}
      data-testid="body-row"
    >
      {row.getVisibleCells().map((cell) => (
        <BodyCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};

export default BodyRow;
