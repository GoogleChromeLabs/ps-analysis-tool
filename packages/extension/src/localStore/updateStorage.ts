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
import { emptyTabData } from './consts';

const updateStorage: <A>(
  key: number,
  def: A,
  step: (val: A) => A
) => Promise<void> = async (key, def, step) => {
  // bytesInUse is an approximation of the size of the storage.
  const bytesInUse = await chrome.storage.local.getBytesInUse();

  // storage is the entire chrome.storage object.
  const storage = await chrome.storage.local.get();

  // potentialBytesInUse is an approximation of the size of the storage after the update.
  let potentialBytesInUse =
    bytesInUse - new TextEncoder().encode(storage[key]).length;

  if (!storage[key]) {
    storage[key] = def;
  }
  storage[key] = step(storage[key]);

  // We add the size of the new value to the potentialBytesInUse.
  potentialBytesInUse += new TextEncoder().encode(storage[key]).length;

  /**
   * If we are over the quota, we remove the least recently used tab.
   * LRU is defined as the tab that was focused at the longest time ago based on focusedAt timestamp.
   */
  if (potentialBytesInUse > chrome.storage.local.QUOTA_BYTES) {
    const lruStorage = Object.entries(storage).sort(([, a], [, b]) => {
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

    // We remove the least recently used tab until we are under the quota or there are no more tabs.
    while (
      potentialBytesInUse > chrome.storage.local.QUOTA_BYTES &&
      lruStorage.length
    ) {
      const b = lruStorage.pop();
      if (b) {
        const [tabId, value] = b;
        storage[tabId] = emptyTabData;
        potentialBytesInUse -= new TextEncoder().encode(value).length;
      }
    }
  }

  await chrome.storage.local.set(storage);
};

export default updateStorage;
