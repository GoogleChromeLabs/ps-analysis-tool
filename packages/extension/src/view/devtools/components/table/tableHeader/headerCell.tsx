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
import { flexRender, type Header } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import type { TData } from '..';
import HeaderResizer from './headerResizer';

interface HeaderCellProps {
  header: Header<TData, unknown>;
}

const HeaderCell = ({ header }: HeaderCellProps) => {
  return (
    <th
      colSpan={header.colSpan}
      style={{ maxWidth: header.getSize() }}
      className="border-x border-american-silver relative hover:bg-gainsboro select-none touch-none cursor-pointer font-normal"
    >
      <div className="w-full h-full flex items-center justify-between">
        <p className="px-1 py-px truncate text-xs">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </p>
      </div>
      <HeaderResizer header={header} />
    </th>
  );
};

export default HeaderCell;
