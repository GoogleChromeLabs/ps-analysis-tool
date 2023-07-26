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

/**
 * Internal dependencies.
 */
import type { TData } from '..';
import BodyCell from './bodyCell';

interface BodyRowProps {
  row: Row<TData>;
  index: number;
  selectedKey: string | undefined;
  onRowClick: (key: TData) => void;
}

const BodyRow = ({ row, index, selectedKey, onRowClick }: BodyRowProps) => {
  return (
    <tr
      key={row.id}
      className={`${index % 2 ? 'bg-slate-100' : ''} ${
        row.original.parsedCookie.name === selectedKey ? 'bg-slate-300' : ''
      } hover:bg-slate-200 cursor-pointer`}
      onClick={() => {
        onRowClick(row.original);
      }}
      data-testid="body-row"
    >
      {row.getVisibleCells().map((cell) => (
        <BodyCell key={cell.id} cell={cell} />
      ))}
    </tr>
  );
};

export default BodyRow;
