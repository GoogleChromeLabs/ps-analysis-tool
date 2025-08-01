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
import React, { useEffect } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
import BodyCell from './bodyCell';
import type { TableColumn, TableRow } from '../../useTable';

interface BodyRowProps {
  row: TableRow;
  columns: TableColumn[];
  index: number;
  selectedKey: string | undefined | null;
  isRowFocused: boolean;
  getExtraClasses: () => string;
  hasVerticalBar: boolean;
  verticalBarColorHash: string;
  getRowObjectKey: (row: TableRow) => string;
  onRowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLTableRowElement>,
    index: number
  ) => void;
  onRowContextMenu: (
    e: React.MouseEvent<HTMLDivElement>,
    row: TableRow
  ) => void;
  rowHeightClass?: string;
  shouldScroll?: boolean;
}

const BodyRow = ({
  row,
  columns,
  index,
  selectedKey,
  isRowFocused,
  getExtraClasses,
  hasVerticalBar,
  verticalBarColorHash,
  getRowObjectKey,
  onRowClick,
  onKeyDown,
  onRowContextMenu,
  rowHeightClass,
  shouldScroll = false,
}: BodyRowProps) => {
  const rowKey = getRowObjectKey(row);
  const isHighlighted = row.originalData?.highlighted;
  const classes = classnames(
    rowKey !== selectedKey &&
      (index % 2
        ? isHighlighted
          ? 'bg-dirty-pink'
          : 'bg-anti-flash-white dark:bg-charleston-green'
        : isHighlighted
        ? 'bg-dirty-pink text-dirty-red dark:text-dirty-red text-dirty-red'
        : 'bg-white dark:bg-raisin-black'),
    rowKey === selectedKey &&
      (isRowFocused
        ? isHighlighted
          ? 'bg-dirty-red'
          : 'bg-lavender-sky text-black dark:bg-midnight-slate dark:text-chinese-silver'
        : isHighlighted
        ? 'bg-dirty-pink text-dirty-red'
        : 'bg-silver-mist text-black dark:bg-dark-graphite dark:text-chinese-silver')
  );
  const extraClasses = getExtraClasses();

  useEffect(() => {
    if (isHighlighted) {
      const element = document.getElementById(index.toString());
      element?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [index, isHighlighted]);

  useEffect(() => {
    if (shouldScroll) {
      const element = document.getElementById(index.toString());
      element?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'center',
        inline: 'start',
      });
    }
  }, [index, shouldScroll]);

  return (
    <tr
      id={index.toString()}
      className={classnames(
        'outline-0 divide-x divide-american-silver dark:divide-quartz relative',
        {
          [classes]: extraClasses.length === 0,
        },
        {
          [extraClasses]: extraClasses.length > 0,
        }
      )}
      onClick={onRowClick}
      onKeyDown={(e) => onKeyDown(e, index)}
      onContextMenu={(e) => onRowContextMenu(e, row)}
      data-testid="body-row"
    >
      {columns.map(
        (
          {
            accessorKey,
            enableBodyCellPrefixIcon,
            showBodyCellPrefixIcon,
            bodyCellPrefixIcon,
          },
          idx
        ) => (
          <BodyCell
            key={idx}
            onRowClick={onRowClick}
            cell={row[accessorKey]?.value}
            row={row}
            hasIcon={enableBodyCellPrefixIcon}
            showIcon={
              showBodyCellPrefixIcon ? showBodyCellPrefixIcon(row) : false
            }
            icon={bodyCellPrefixIcon ?? undefined}
            rowHeightClass={rowHeightClass}
            accessorKey={accessorKey}
            hasVerticalBar={idx === 0 && hasVerticalBar}
            verticalBarColorHash={verticalBarColorHash}
          />
        )
      )}
    </tr>
  );
};

export default BodyRow;
