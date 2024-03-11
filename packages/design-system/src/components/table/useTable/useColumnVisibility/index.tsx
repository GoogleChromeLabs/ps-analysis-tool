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
import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */
import type { TableColumn } from '../types';
import { useTablePersistentSettingsStore } from '../../persistentSettingsStore';

export type ColumnVisibilityOutput = {
  visibleColumns: TableColumn[];
  hideColumn: (key: string) => void;
  toggleVisibility: () => void;
  areAllColumnsVisible: boolean;
  showColumn: (key: string) => void;
  isColumnHidden: (key: string) => boolean;
};

const useColumnVisibility = (
  columns: TableColumn[],
  tablePersistentSettingsKey?: string
): ColumnVisibilityOutput => {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());
  const [isDataLoading, setIsDataLoading] = useState(true);

  const hideColumn = useCallback((key: string) => {
    setHiddenKeys((prev) => new Set(prev.add(key)));
  }, []);

  const toggleVisibility = useCallback(() => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      if (
        next.size ===
        columns.filter(({ enableHiding }) => enableHiding !== false).length
      ) {
        next.clear();
      } else {
        columns
          .filter(({ enableHiding }) => enableHiding !== false)
          .forEach(({ accessorKey }) => {
            next.add(accessorKey);
          });
      }
      return next;
    });
  }, [columns]);

  const areAllColumnsVisible = useMemo(() => {
    return (
      hiddenKeys.size ===
      columns.filter(({ enableHiding }) => enableHiding !== false).length
    );
  }, [columns, hiddenKeys.size]);

  const showColumn = useCallback((key: string) => {
    setHiddenKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const isColumnHidden = useCallback(
    (key: string) => {
      return hiddenKeys.has(key);
    },
    [hiddenKeys]
  );

  const [visibleColumns, setVisibleColumns] = useState<TableColumn[]>([]);

  useEffect(() => {
    if (isDataLoading) {
      setVisibleColumns([]);
      return;
    }

    setVisibleColumns(
      columns.filter(({ accessorKey }) => !hiddenKeys.has(accessorKey))
    );
  }, [columns, hiddenKeys, isDataLoading]);

  const { getPreferences, setPreferences } = useTablePersistentSettingsStore(
    ({ actions }) => ({
      getPreferences: actions.getPreferences,
      setPreferences: actions.setPreferences,
    })
  );

  useEffect(() => {
    if (tablePersistentSettingsKey) {
      setHiddenKeys(new Set());

      const data = getPreferences(
        tablePersistentSettingsKey,
        'columnsVisibility'
      );

      if (data) {
        const _hiddenKeys = Object.entries(data)
          .filter(([, hidden]) => hidden)
          .map(([key]) => key);

        setHiddenKeys(new Set(_hiddenKeys));
      }
    }

    setIsDataLoading(false);
  }, [getPreferences, tablePersistentSettingsKey]);

  useEffect(() => {
    if (isDataLoading || visibleColumns.length === 0 || columns.length === 0) {
      return;
    }

    const _columnsVisibility = (columns || []).reduce(
      (acc, { accessorKey }) => {
        acc[accessorKey] = true;

        return acc;
      },
      {} as { [key: string]: boolean }
    );

    visibleColumns?.forEach(({ accessorKey }) => {
      _columnsVisibility[accessorKey] = false;
    });

    if (tablePersistentSettingsKey) {
      setPreferences(
        {
          columnsVisibility: _columnsVisibility,
        },
        tablePersistentSettingsKey
      );
    }
  }, [
    columns,
    isDataLoading,
    setPreferences,
    tablePersistentSettingsKey,
    visibleColumns,
  ]);

  return {
    visibleColumns,
    hideColumn,
    toggleVisibility,
    areAllColumnsVisible,
    showColumn,
    isColumnHidden,
  };
};

export default useColumnVisibility;
