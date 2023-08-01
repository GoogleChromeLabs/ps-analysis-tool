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
import type { HeaderGroup } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import HeaderRow from './headerRow';
import type { TData } from '..';

interface TableHeaderProps {
  headerGroups: HeaderGroup<TData>[];
  onRightClick: (
    event: React.MouseEvent<HTMLTableSectionElement, MouseEvent>
  ) => void;
}

const TableHeader = ({ headerGroups, onRightClick }: TableHeaderProps) => {
  return (
    <thead onContextMenu={onRightClick} className="sticky top-0 z-10">
      {headerGroups.map((headerGroup) => (
        <HeaderRow key={headerGroup.id} headerGroup={headerGroup} />
      ))}
    </thead>
  );
};

export default TableHeader;
