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
 * This function takes different values from user and computes which
 * value needs to be set for samesite status.
 * @param key {string} The value to return for same site specified by use.
 * @param value {string | boolean | number} The value corresponding to the key.
 * @param needValueForLocalStorage {boolean} This is a flag to reuse the function for localstorage.
 * @returns {string | boolean | number} The value that needs to be set for sameSite in chrome.cookie.set.
 */
function getValueForLocalStorageAndCookieSet(
  key: string,
  value: string | boolean | number,
  needValueForLocalStorage: boolean
): string | boolean | number {
  if (key.toLowerCase() === 'samesite') {
    switch (value) {
      case 'no_restriction':
      case 'none':
        return needValueForLocalStorage ? 'none' : 'no_restriction';

      case 'lax':
        return 'lax';

      case 'unspecified':
      case '':
        return needValueForLocalStorage ? '' : 'unspecified';

      case 'strict':
        return 'strict';

      default:
        return '';
    }
  } else if (key === 'expirationDate') {
    switch (value) {
      case 0:
        return 'Session';
      default:
        return new Date(value).toJSON();
    }
  }
  return value;
}

export default getValueForLocalStorageAndCookieSet;
