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
 * Internal dependencies
 */
import { PersistentOptions, PersistentStorageData } from '.';
import { TableFilter } from '..';

const updateStorage = async (
  persistenceKey: string,
  isChromeExtension: boolean,
  options: PersistentOptions
) => {
  const columnVisibility = (options.columns || []).reduce((acc, { header }) => {
    acc[header] = true;

    return acc;
  }, {} as { [key: string]: boolean });

  options.visibleColumns?.forEach(({ header }) => {
    columnVisibility[header] = false;
  });

  const _columnsSizing = (options.visibleColumns || []).reduce(
    (acc, { accessorKey, width }) => {
      acc[accessorKey] = width || 0;

      return acc;
    },
    {} as { [key: string]: number }
  );

  const _selectedFilters = Object.entries(options.selectedFilters || {}).reduce(
    (acc, [filterKey, { filterValues }]) => {
      acc[filterKey] = { ...filterValues };

      return acc;
    },
    {} as { [key: string]: TableFilter[keyof TableFilter]['filterValues'] }
  );

  const _searchValue = options.searchValue || '';

  const storageData: PersistentStorageData = {
    columnsVisibility: columnVisibility,
    columnsSizing: _columnsSizing,
    sortBy: options.sortBy || '',
    sortOrder: options.sortOrder,
    selectedFilters: _selectedFilters,
    searchValue: _searchValue,
  };

  if (isChromeExtension) {
    await updateChromeStorage(persistenceKey, storageData);
  } else {
    updateLocalStorage(persistenceKey, storageData);
  }
};

const updateLocalStorage = (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  localStorage.setItem(persistenceKey, JSON.stringify(storageData));
};

const updateChromeStorage = async (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();

  const data = await chrome.storage.local.get(tabId);
  const tabData = data[tabId];

  tabData[persistenceKey] = storageData;

  await chrome.storage.local.set({
    [tabId]: tabData,
  });
};

export default updateStorage;
