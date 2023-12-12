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
import { type PreferenceDataValues, noop } from '@ps-analysis-tool/common';
/**
 * Internal dependencies.
 */
import HeaderRow from './headerRow';
import type { TableOutput } from '../../useTable';

interface TableHeaderProps {
  table: TableOutput;
  setColumnPosition: (position: { x: number; y: number }) => void;
  onRightClick: (
    event: React.MouseEvent<HTMLTableSectionElement, MouseEvent>
  ) => void;
  setIsRowFocused: (state: boolean) => void;
  updatePreference: (
    key: string,
    updater: (prevStatePreference: {
      [key: string]: unknown;
    }) => PreferenceDataValues
  ) => void;
}

const TableHeader = ({
  table,
  setColumnPosition,
  onRightClick,
  setIsRowFocused,
  updatePreference = noop,
}: TableHeaderProps) => {
  const handleRightClick = useCallback(
    (e: React.MouseEvent<HTMLTableSectionElement>) => {
      const x = e.clientX,
        y = e.clientY;

      setColumnPosition({ x, y });
      onRightClick(e);
    },
    [onRightClick, setColumnPosition]
  );

  return (
    <div onContextMenu={handleRightClick} className="sticky top-0 z-10">
      <HeaderRow
        updatePreference={updatePreference}
        table={table}
        setIsRowFocused={setIsRowFocused}
      />
    </div>
  );
};

export default TableHeader;
