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
import type { Column } from '@tanstack/react-table';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import type { TableData } from '..';

interface ColumnListItemProps {
  column: Column<TableData, unknown>;
  handleClose: () => void;
}

const ColumnListItem = ({ column, handleClose }: ColumnListItemProps) => {
  return (
    <li
      key={column.id}
      className={classNames({
        'pointer-events-none opacity-50': column.columnDef.header === 'Name',
      })}
    >
      <button
        className="w-full rounded text-xs px-1 py-[3px] my-px flex items-center hover:bg-royal-blue hover:text-white select-none touch-none cursor-default"
        onClick={(e) => {
          column.getToggleVisibilityHandler()(e);
          handleClose();
        }}
      >
        <span
          className={classNames(
            'mr-2 font-semibold',
            column.getIsVisible() ? 'opacity-100' : 'opacity-0'
          )}
        >
          ✓
        </span>
        <span>{column.columnDef.header as string}</span>
      </button>
    </li>
  );
};

export default ColumnListItem;
