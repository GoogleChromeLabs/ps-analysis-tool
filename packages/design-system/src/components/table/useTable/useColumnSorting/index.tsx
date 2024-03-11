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
import { useState, useCallback, useMemo, useEffect } from 'react';
import { getValueByKey } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import type { TableData } from '../types';
import { useTablePersistentSettingsStore } from '../../persistentSettingsStore';

export type DefaultOptions = {
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
};

export type ColumnSortingOutput = {
  sortedData: TableData[];
  setSortKey: (key: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
};

const useColumnSorting = (
  data: TableData[],
  tablePersistentSettingsKey?: string
): ColumnSortingOutput => {
  const [sortKey, _setSortKey] = useState<string>('');
  const [ascending, setAscending] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const setSortOrder = useCallback((sortOrder: 'asc' | 'desc') => {
    setAscending(sortOrder === 'asc');
  }, []);

  const setSortKey = useCallback(
    (newSortKey: string) => {
      if (newSortKey === sortKey) {
        setAscending(!ascending);
      } else {
        _setSortKey(newSortKey);
        setAscending(true);
      }
    },
    [ascending, sortKey]
  );

  const sortedData = useMemo(() => {
    if (isDataLoading) {
      return [];
    }

    const _sortedData = [...data].sort((a, b) => {
      const candidateA = getValueByKey(sortKey, a);
      const candidateB = getValueByKey(sortKey, b);

      return (
        (candidateA === candidateB ? 0 : candidateA > candidateB ? 1 : -1) *
        (ascending ? 1 : -1)
      );
    });

    return _sortedData;
  }, [ascending, data, isDataLoading, sortKey]);

  const { getPreferences, setPreferences } = useTablePersistentSettingsStore(
    ({ actions }) => ({
      getPreferences: actions.getPreferences,
      setPreferences: actions.setPreferences,
    })
  );

  useEffect(() => {
    if (tablePersistentSettingsKey) {
      const sortByData = getPreferences(tablePersistentSettingsKey, 'sortBy');
      const sortOrderData = getPreferences(
        tablePersistentSettingsKey,
        'sortOrder'
      );

      if (sortByData) {
        _setSortKey(sortByData as string);
      }
      if (sortOrderData) {
        setAscending(sortOrderData === 'asc');
      }
    }

    setIsDataLoading(false);

    return () => {
      _setSortKey('');
      setAscending(true);
    };
  }, [getPreferences, tablePersistentSettingsKey]);

  useEffect(() => {
    if (tablePersistentSettingsKey && sortKey) {
      setPreferences(
        {
          sortBy: sortKey,
          sortOrder: ascending ? 'asc' : 'desc',
        },
        tablePersistentSettingsKey
      );
    }
  }, [sortKey, ascending, tablePersistentSettingsKey, setPreferences]);

  return {
    sortedData,
    setSortKey,
    setSortOrder,
    sortKey,
    sortOrder: ascending ? 'asc' : 'desc',
  };
};

export default useColumnSorting;
