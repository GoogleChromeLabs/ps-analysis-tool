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
import type { HeaderGroup } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import HeaderRow from './headerRow';
import type { TableData } from '..';

interface TableHeaderProps {
  headerGroups: HeaderGroup<TableData>[];
  setColumnPosition: (position: { x: number; y: number }) => void;
  onRightClick: (
    event: React.MouseEvent<HTMLTableSectionElement, MouseEvent>
  ) => void;
  setIsRowFocused: (state: boolean) => void;
}

const TableHeader = ({
  headerGroups,
  setColumnPosition,
  onRightClick,
  setIsRowFocused,
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
    <thead onContextMenu={handleRightClick} className="sticky top-0 z-10">
      {headerGroups.map((headerGroup) => (
        <HeaderRow
          key={headerGroup.id}
          headerGroup={headerGroup}
          setIsRowFocused={setIsRowFocused}
        />
      ))}
    </thead>
  );
};

export default TableHeader;
