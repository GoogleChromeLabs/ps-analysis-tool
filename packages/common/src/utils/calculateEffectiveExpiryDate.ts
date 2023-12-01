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
 * @param date {Date | number | string | undefined} The date that needs to be converted for expiration.
 * @returns {string} The date of expiry for cookie.
 */
function calculateEffectiveExpiryDate(
  date: Date | number | string | undefined
): string {
  if (!date) {
    return 'Session';
  }
  if (typeof date === 'number') {
    const totalDecimalPlaces = date.toString().split('.')[1]?.length || 0;
    const dateToBeConverted = totalDecimalPlaces >= 6 ? date * 1000 : date;
    return new Date(dateToBeConverted).toJSON();
  } else {
    return new Date(date).toJSON();
  }
}

export default calculateEffectiveExpiryDate;
