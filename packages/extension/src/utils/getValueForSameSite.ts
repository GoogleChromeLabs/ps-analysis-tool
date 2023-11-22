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
 * @returns {string} The value that needs to be set for sameSite in chrome.cookie.set.
 */
function getValueForSameSite(key: string): string {
  switch (key) {
    case 'no_restriction':
    case 'none':
      return 'no_restriction';

    case 'lax':
      return 'lax';

    case 'unspecified':
    case '':
      return 'unspecified';

    case 'strict':
      return 'strict';
    default:
      return '';
  }
}

export default getValueForSameSite;
