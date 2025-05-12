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

/**
 * Internal dependencies.
 */
import type { TableRow } from '../../useTable';

interface BodyCellProps {
  cell?: () => React.JSX.Element;
  row: TableRow;
  hasIcon?: boolean;
  showIcon?: boolean | null;
  icon?: {
    Element: (props: any) => React.JSX.Element;
  };
  onRowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  rowHeightClass?: string;
  accessorKey?: string;
}

const BodyCell = ({
  cell,
  row,
  hasIcon = false,
  showIcon = false,
  icon,
  rowHeightClass,
  accessorKey,
}: BodyCellProps) => {
  const IconElement = icon?.Element;
  const cellValue = cell?.() ?? '';

  return (
    <td
      tabIndex={0}
      onDoubleClick={(e) => {
        const target = e.target as HTMLElement;
        const range = new Range();
        range.selectNodeContents(target);
        document.getSelection()?.removeAllRanges();
        document.getSelection()?.addRange(range);
      }}
      onKeyDown={(e) => {
        if (['Meta', 'Control', 'c'].includes(e.key)) {
          e.stopPropagation();
        }
      }}
      className={`max-w-40 relative box-border outline-0 px-1 py-px text-xs cursor-default flex-1 min-h-fit ${
        rowHeightClass ?? 'min-h-5'
      }`}
    >
      <div
        className="block absolute right-[-2px] cursor-ew-resize h-full w-2 z-50 top-0"
        data-column-resize-handle={accessorKey}
      />
      <div className="flex items-center">
        {hasIcon && (
          <div className="h-full grid place-items-center min-w-[15px] pr-1">
            {Boolean(showIcon) && IconElement && (
              <IconElement
                {...{
                  originalData: row.originalData,
                }}
              />
            )}
          </div>
        )}
        <div
          className="truncate min-h-fit w-full"
          title={typeof cellValue === 'string' ? cellValue : ''}
        >
          {cellValue}
        </div>
      </div>
    </td>
  );
};

export default BodyCell;
