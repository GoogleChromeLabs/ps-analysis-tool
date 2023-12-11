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
import { type Storage, type TabData } from '../types';
import updateCookieBadgeText from './updateCookieBadgeText';

const updateStorage = async (
  tabId: string,
  updater: (prevState: TabData) => TabData
) => {
  //Find out storage quota used currently
  const currentBytesInUse = await chrome.storage.local.getBytesInUse();
  const currentStorageSnapshot: Storage = await chrome.storage.local.get();
  const encodedData = new TextEncoder().encode(
    JSON.stringify(currentStorageSnapshot[tabId])
  );
  const restBytesInUse = currentBytesInUse - encodedData.length;

  //Find out storage quota that will be used in the future
  const newStorageValue: Storage = {
    ...currentStorageSnapshot,
    [tabId]: updater(currentStorageSnapshot[tabId]),
  };

  let futureBytesInUse =
    new TextEncoder().encode(JSON.stringify(newStorageValue[tabId])).length +
    restBytesInUse;

  //Delete data for tabs until enough space is available with LRU strategy
  if (futureBytesInUse > chrome.storage.local.QUOTA_BYTES) {
    const lruStorage = Object.entries(newStorageValue).sort(([, a], [, b]) => {
      if (a.focusedAt && b.focusedAt) {
        return b.focusedAt - a.focusedAt;
      } else if (a.focusedAt) {
        return -1;
      } else if (b.focusedAt) {
        return 1;
      } else {
        return 0;
      }
    });

    while (
      futureBytesInUse > chrome.storage.local.QUOTA_BYTES &&
      lruStorage.length
    ) {
      const b = lruStorage.pop();
      if (b) {
        const [key, value] = b;
        delete newStorageValue[key];
        futureBytesInUse -= new TextEncoder().encode(
          JSON.stringify({ key: value })
        ).length;
      }
    }
  }
  await updateCookieBadgeText(newStorageValue, tabId);
  //Apply update to the chrome local store
  await chrome.storage.local.set(newStorageValue);
};

export default updateStorage;
