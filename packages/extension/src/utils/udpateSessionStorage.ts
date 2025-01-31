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

const updateSessionStorage = async (
  items: SessionData
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
        Object.entries(items).map(([key, value]) => [`${tabId}-${key}`, value])
      ),
    };

    await chrome.storage.session.set(updatedData);
  }

  return updatedData || data;
};

export default updateSessionStorage;
