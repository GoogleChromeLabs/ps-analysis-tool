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
 * This function will return true if the current request can be processed or and false if it cannot be processed.
 * @param {string | null | undefined} tabUrl Current tab url.
 * @param {chrome.webRequest.HttpHeader[] | undefined} headers The tabId of the current request is associated to.
 * @returns {boolean}.
 */
export default function canProcessCookies(
  tabUrl: string | null | undefined,
  headers: chrome.webRequest.HttpHeader[] | undefined
) {
  if (!tabUrl || !headers || tabUrl === 'chrome://newtab/') {
    return false;
  }

  return true;
}
