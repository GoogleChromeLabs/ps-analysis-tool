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
 * Internal dependencies.
 */
import { useCallback, useEffect, useMemo } from 'react';
import { useTablePersistentSettingsStore } from '../../persistentSettingsStore';
import { PersistentStorageData, TableFilter } from '..';

const useFiltersPersistence = (
  filters: TableFilter | undefined,
  setOptions: React.Dispatch<
    React.SetStateAction<{
      [filterKey: string]: TableFilter[keyof TableFilter]['filterValues'];
    }>
  >,
  specificTablePersistentSettingsKey?: string,
  genericTablePersistentSettingsKey?: string
) => {
  const { getPreferences, setPreferences } = useTablePersistentSettingsStore(
    ({ actions }) => ({
      getPreferences: actions.getPreferences,
      setPreferences: actions.setPreferences,
    })
  );

  const computeAndUpdateOptions = useCallback(
    (options: PersistentStorageData['selectedFilters']) => {
      setOptions((prevOptions) => ({
        ...prevOptions,
        ...(options || {}),
      }));
    },
    [setOptions]
  );

  useEffect(() => {
    if (specificTablePersistentSettingsKey) {
      const data = getPreferences(
        specificTablePersistentSettingsKey,
        'selectedFilters'
      );

      if (data) {
        computeAndUpdateOptions(
          data as PersistentStorageData['selectedFilters']
        );
      }
    }

    if (genericTablePersistentSettingsKey) {
      const data = getPreferences(
        genericTablePersistentSettingsKey,
        'selectedFilters'
      );

      if (data) {
        computeAndUpdateOptions(
          data as PersistentStorageData['selectedFilters']
        );
      }
    }

    return () => {
      setOptions({});
    };
  }, [
    computeAndUpdateOptions,
    genericTablePersistentSettingsKey,
    getPreferences,
    setOptions,
    specificTablePersistentSettingsKey,
  ]);

  const saveFilters = useCallback(
    (
      selectedFilters: PersistentStorageData['selectedFilters'],
      persistenceKey?: string
    ) => {
      if (persistenceKey) {
        setPreferences(
          {
            selectedFilters,
          },
          persistenceKey
        );
      }
    },
    [setPreferences]
  );

  const [specificSelectedFilters, genericSelectedFilters] = useMemo(() => {
    interface SelectedFilters {
      specificSelectedFilters: string;
      genericSelectedFilters: string;
    }

    const accumulator: Record<
      keyof SelectedFilters,
      Record<string, TableFilter[keyof TableFilter]['filterValues']>
    > = {
      specificSelectedFilters: {},
      genericSelectedFilters: {},
    };

    Object.entries(filters || {}).forEach(([filterKey, filter]) => {
      if (filter.useGenericPersistenceKey) {
        accumulator.genericSelectedFilters[filterKey] = {
          ...filter.filterValues,
        };
      } else {
        accumulator.specificSelectedFilters[filterKey] = {
          ...filter.filterValues,
        };
      }
    });

    return [
      accumulator.specificSelectedFilters,
      accumulator.genericSelectedFilters,
    ];
  }, [filters]);

  useEffect(() => {
    saveFilters(specificSelectedFilters, specificTablePersistentSettingsKey);
  }, [
    saveFilters,
    specificSelectedFilters,
    specificTablePersistentSettingsKey,
  ]);

  useEffect(() => {
    saveFilters(genericSelectedFilters, genericTablePersistentSettingsKey);
  }, [saveFilters, genericSelectedFilters, genericTablePersistentSettingsKey]);
};

export default useFiltersPersistence;
