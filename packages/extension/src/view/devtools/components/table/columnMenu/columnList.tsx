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
import type { Column } from '@tanstack/react-table';

/**
 * Internal dependencies.
 */
import ColumnListItem from './columnListItem';
import type { TableData } from '..';
import { usePreferenceStore } from '../../../stateProviders/preferenceStore';

interface ColumnListProps {
  columns: Column<TableData, unknown>[];
  handleClose: () => void;
}

const ColumnList = ({ columns, handleClose }: ColumnListProps) => {
  const { updatePreference } = usePreferenceStore(({ actions }) => ({
    updatePreference: actions?.updatePreference,
  }));

  useEffect(() => {
    return () => {
      const visibleColumns: Record<string, boolean> = {};
      columns.forEach((column) => {
        visibleColumns[column.id] = column.getIsVisible();
      });
      updatePreference('selectedColumns', () => visibleColumns);
    };
  }, [columns, updatePreference]);

  return (
    <ul className="text-basic mt-1.5">
      {columns.map((column) => (
        <ColumnListItem
          key={column.id}
          column={column}
          handleClose={handleClose}
        />
      ))}
    </ul>
  );
};

export default ColumnList;
