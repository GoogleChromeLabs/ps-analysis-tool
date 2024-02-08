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
import type { InfoType, TableRow } from '../../useTable';
import { Warning } from '../../../../icons';

interface BodyCellProps {
  cell: React.JSX.Element | InfoType;
  width: number;
  isHighlighted?: boolean;
  isRowFocused: boolean;
  row: TableRow;
  hasIcon?: boolean;
  showWarningIcon?: boolean | null;
  onRowClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const BodyCell = ({
  cell,
  width,
  isRowFocused,
  hasIcon = false,
  showWarningIcon = false,
  isHighlighted = false,
}: BodyCellProps) => {
  return (
    <div
      tabIndex={0}
      style={{ minWidth: width }}
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
      className={`flex box-border outline-0 px-1 py-px truncate h-5 text-xs ${
        isHighlighted
          ? `${
              isRowFocused ? 'text-white' : 'dark:text-dirty-red text-dirty-red'
            }`
          : 'dark:text-bright-gray'
      } cursor-default flex-1`}
    >
      {hasIcon && (
        <div className="w-4 min-w-[1rem] h-3 mr-1 mt-[-2px]">
          {Boolean(showWarningIcon) && (
            <Warning className="text-warning-orange w-4" />
          )}
        </div>
      )}
      {cell}
    </div>
  );
};

export default BodyCell;
