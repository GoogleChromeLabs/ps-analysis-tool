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
import { PersistentStorageData } from '..';

const updateStorage = async (
  persistenceKey: string,
  isChromeExtension: boolean,
  options: PersistentStorageData
) => {
  if (isChromeExtension) {
    await updateChromeStorage(persistenceKey, options);
  } else {
    updateLocalStorage(persistenceKey, options);
  }
};

const updateLocalStorage = (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  const data = localStorage.getItem(persistenceKey);

  if (data) {
    const parsedData = JSON.parse(data);
    localStorage.setItem(
      persistenceKey,
      JSON.stringify({
        ...parsedData,
        ...storageData,
      })
    );
    return;
  }

  localStorage.setItem(persistenceKey, JSON.stringify(storageData));
};

const updateChromeStorage = async (
  persistenceKey: string,
  storageData: PersistentStorageData
) => {
  const tabId = chrome.devtools.inspectedWindow.tabId.toString();

  const data = await chrome.storage.local.get(tabId);
  const tabData = data[tabId];

  tabData[persistenceKey] = {
    ...tabData[persistenceKey],
    ...storageData,
  };

  await chrome.storage.local.set({
    [tabId]: tabData,
  });
};

export default updateStorage;
