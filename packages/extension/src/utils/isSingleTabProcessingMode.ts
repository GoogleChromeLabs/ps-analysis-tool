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
 * This determines the processing mode of the extension True if singleTabProcessingMode false if multiple tab being processed.
 * @returns boolean.
 */
export default async function isSingleTabProcessingMode() {
  const syncStorage = await chrome.storage.sync.get();
  return (
    syncStorage.allowedNumberOfTabs &&
    syncStorage.allowedNumberOfTabs !== 'unlimited'
  );
}
