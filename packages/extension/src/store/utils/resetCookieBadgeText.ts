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
 * Resets the extension badge text.
 * @param {number} tabId Tab id where the badge text has to be reset.
 */
export default function resetCookieBadgeText(tabId: number) {
  if (!tabId) {
    return;
  }
  chrome.action.setBadgeText({
    tabId: tabId,
    text: '',
  });
}
