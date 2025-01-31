/*
 * Copyright 2024 Google LLC
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

export type SessionData = Record<string, unknown> | undefined;

/**
 * Updates session storage for the current tab with the given items.
 * The items are stored under a key format: `{tabId}-{name}-{key}`.
 * @param {SessionData} items - The session data to be stored.
 * @param {string} name - A namespace to distinguish different storage sets (e.g., "persistentSetting").
 * @returns {Promise<SessionData>} - The updated session data.
 */
export const updateSessionStorage = async (
  items: SessionData,
  name: string
): Promise<SessionData> => {
  const tabId = chrome.devtools.inspectedWindow.tabId;

  if (!tabId) {
    return {};
  }

  const data = (await chrome.storage.session.get()) || {};

  let updatedData: SessionData = undefined;

  if (items) {
    // Merge new items with tab-specific keys
    updatedData = {
      ...data,
      ...Object.fromEntries(
        Object.entries(items).map(([key, value]) => [
          `${tabId}-${name}-${key}`,
          value,
        ])
      ),
    };

    await chrome.storage.session.set(updatedData);
  }

  return updatedData || data;
};

/**
 * Retrieves session storage for the current tab, grouping stored data by tab ID.
 * The function filters data based on the provided name (namespace).
 * @param {string} name - A namespace to filter session storage keys (e.g., "persistentSetting").
 * @returns {Promise<Record<string, any>>} - The session data grouped under the current tab ID.
 */
export const getSessionStorage = async (
  name: string
): Promise<Record<string, any>> => {
  const data = (await chrome.storage.session.get()) || {};

  const groupedData: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    const match = key.match(new RegExp(`^(\\d+)-${name}-(.+)$`)); // Extract tab ID dynamically

    if (match) {
      const tabId = match[1]; // Get tab ID
      const originalKey = match[2]; // Extract the actual key

      if (!groupedData[tabId]) {
        groupedData[tabId] = {};
      }
      groupedData[tabId][originalKey] = value;
    } else {
      // Global data (not associated with any tab)
      groupedData[key] = value;
    }
  });

  const tabId = chrome.devtools.inspectedWindow.tabId;

  return groupedData[tabId];
};
