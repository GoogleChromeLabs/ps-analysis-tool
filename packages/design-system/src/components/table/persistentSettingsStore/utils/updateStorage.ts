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
import { PersistentStorageData } from '../../useTable';
import {
  TABLE_PERSISTENT_SETTINGS_STORE_KEY,
  TablePersistentSettingsStoreContext,
} from '..';
import { mergeDeep } from '@ps-analysis-tool/common';

const updateStorage = async (
  persistenceKey: string,
  isChromeExtension: boolean,
  options: PersistentStorageData
) => {
  if (isChromeExtension) {
    const result = await updateChromeStorage(persistenceKey, options);

    return result;
  }

  return updateSessionStorage(persistenceKey, options);
};

const updateSessionStorage = (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  const data = sessionStorage.getItem(TABLE_PERSISTENT_SETTINGS_STORE_KEY);

  if (data) {
    const allData = JSON.parse(
      data
    ) as TablePersistentSettingsStoreContext['state'];
    const requiredData = allData[persistenceKey];
    const newData = {} as TablePersistentSettingsStoreContext['state'];

    if (!requiredData) {
      newData[persistenceKey] = storageData;
    } else {
      newData[persistenceKey] = {
        ...requiredData,
        ...storageData,
      };
    }

    const updatedData = {
      ...allData,
      ...newData,
    } as TablePersistentSettingsStoreContext['state'];

    sessionStorage.setItem(
      TABLE_PERSISTENT_SETTINGS_STORE_KEY,
      JSON.stringify(updatedData)
    );

    return updatedData;
  }

  sessionStorage.setItem(
    TABLE_PERSISTENT_SETTINGS_STORE_KEY,
    JSON.stringify({
      [persistenceKey]: storageData,
    } as TablePersistentSettingsStoreContext['state'])
  );

  return {
    [persistenceKey]: storageData,
  } as TablePersistentSettingsStoreContext['state'];
};

const updateChromeStorage = async (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  if (!chrome?.runtime) {
    return {};
  }
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();

  const data = await chrome.storage.session.get();

  let tableData: TablePersistentSettingsStoreContext['state'] =
    data?.[tabId + TABLE_PERSISTENT_SETTINGS_STORE_KEY];
  let requiredData = tableData?.[persistenceKey];

  if (requiredData) {
    requiredData = mergeDeep(requiredData, storageData);
  } else {
    requiredData = storageData;
  }

  if (!tableData) {
    data[tabId + TABLE_PERSISTENT_SETTINGS_STORE_KEY] = {};
    tableData = data[tabId + TABLE_PERSISTENT_SETTINGS_STORE_KEY];
  }

  if (tableData && !tableData[persistenceKey]) {
    tableData[persistenceKey] = {};
  }
  if (tableData && tableData[persistenceKey]) {
    tableData[persistenceKey] = requiredData;
  }

  await chrome.storage.session.set(data);

  return tableData;
};

export default updateStorage;
