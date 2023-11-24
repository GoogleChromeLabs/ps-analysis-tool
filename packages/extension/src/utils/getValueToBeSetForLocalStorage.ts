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
 *
 * @param key {string} The key for which value is being set.
 * @param value {string | boolean} The value corresponding to the key.
 * @returns { string | boolean }.
 */
function getValueToBeSetForLocalStorage(
  key: string,
  value: string | boolean | number
): string | boolean | number {
  if (key.toLowerCase() === 'samesite') {
    switch (value as string) {
      case 'no_restriction':
      case 'none':
        return 'none';

      case 'lax':
        return 'lax';

      case 'unspecified':
      case '':
        return '';

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

export default getValueToBeSetForLocalStorage;
