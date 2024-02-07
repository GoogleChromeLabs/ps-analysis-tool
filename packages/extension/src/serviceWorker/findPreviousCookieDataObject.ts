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
import type { CookieData } from '../store';

/**
 * Find previous cookie object from local storage for given tabId and cookieName.
 * @param tabId Tab id for which cookie object is to be found.
 * @param cookieName Cookie name.
 * @returns {Promise<CookieData | null>} Cookie object.
 */
export async function findPreviousCookieDataObject(
  tabId: string,
  cookieName: string
) {
  try {
    return (await chrome.storage.local.get())?.[tabId]?.cookies?.[
      cookieName
    ] as CookieData | null;
  } catch (error) {
    return null;
  }
}
