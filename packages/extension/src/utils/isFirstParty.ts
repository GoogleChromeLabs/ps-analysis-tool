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
 * Identifies if a cookie is first party by comparing top and cookie URL.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {string} tabURL Cookie URL (URL of the server which is setting/updating cookies).
 * @param {string} cookieURL Top level url ( URL in tab's address bar ).
 * @returns {boolean | null} true for 1p; false for 3p; null for if bad URLs are passed.
 */
const isFirstParty = (tabURL: string, cookieURL: string): boolean | null => {
  try {
    const cookieOrigin = new URL(cookieURL).origin;
    const tabOrigin = new URL(tabURL).origin;

    return cookieOrigin === tabOrigin;
  } catch (error) {
    return null;
  }
};

export default isFirstParty;
