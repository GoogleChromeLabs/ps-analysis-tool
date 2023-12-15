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
import { TablePersistentSettingsStoreContext } from '..';

const extractStorage = async (
  persistenceKey: string,
  isChromeExtension: boolean
): Promise<TablePersistentSettingsStoreContext['state']> => {
  const options = isChromeExtension
    ? extractChromeStorage(persistenceKey)
    : await extractLocalStorage(persistenceKey);

  return options;
};

const extractLocalStorage = (
  persistenceKey: string
): TablePersistentSettingsStoreContext['state'] => {
  const data = localStorage.getItem(persistenceKey);
  if (data) {
    return JSON.parse(data);
  }
  return {} as TablePersistentSettingsStoreContext['state'];
};

const extractChromeStorage = async (
  persistenceKey: string
): Promise<TablePersistentSettingsStoreContext['state']> => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();

  const data = await chrome.storage.local.get();
  const tableData = data?.[tabId];
  if (tableData) {
    const persistenceData = tableData?.[persistenceKey];
    if (persistenceData) {
      return persistenceData;
    }
  }
  return {} as TablePersistentSettingsStoreContext['state'];
};

export default extractStorage;
