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
import React, { useCallback } from 'react';
import { flexRender, type Header } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import type { TableData } from '..';
import HeaderResizer from './headerResizer';
import { ArrowDown } from '../../../../../icons';
import {
  usePreferenceStore,
  type PreferenceStore,
} from '../../../../devtools/stateProviders/preferenceStore';

interface HeaderCellProps {
  header: Header<TableData, unknown>;
  setIsRowFocused: (state: boolean) => void;
}

const HeaderCell = ({ header, setIsRowFocused }: HeaderCellProps) => {
  const { updatePreference } = usePreferenceStore(({ actions }) => ({
    updatePreference: actions.updatePreference,
  }));
  const handleOnClick = useCallback(() => {
    updatePreference('columnSorting', () => [
      {
        id: header.id,
        desc: header.column.getNextSortingOrder() === 'desc' ? true : false,
      },
    ]);
    header.column.toggleSorting();

    updatePreference(
      'columnSizing',
      (prevStatePreferences: PreferenceStore['state']) => {
        const currentPreferences = prevStatePreferences || {};
        const currentSizes = {
          ...(currentPreferences['columnSizing']
            ? currentPreferences['columnSizing']
            : null),
          [header.id]: header.column.getSize(),
        };
        return currentSizes;
      }
    );
  }, [header.column, header.id, updatePreference]);
  return (
    <th
      colSpan={header.colSpan}
      style={{ maxWidth: header.getSize() }}
      onClick={handleOnClick}
      className="border-x border-american-silver dark:border-quartz relative hover:bg-gainsboro dark:hover:bg-outer-space select-none touch-none font-normal"
      data-testid="header-cell"
    >
      <div
        className="w-full h-full flex items-center justify-between text-cool-grey dark:text-bright-gray"
        onClick={() => setIsRowFocused(false)}
      >
        <p className="px-1 py-px truncate text-xs">
          {header.isPlaceholder
            ? null
            : flexRender(header.column.columnDef.header, header.getContext())}
        </p>
        <p className="mr-2 scale-125">
          {{
            asc: <ArrowDown className="transform rotate-180" />,
            desc: <ArrowDown />,
          }[header.column.getIsSorted() as string] ?? null}
        </p>
      </div>
      <HeaderResizer header={header} />
    </th>
  );
};

export default HeaderCell;
