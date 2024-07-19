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
 * Formats a given Date object into a specific string format.
 * The format is: DD Month, YYYY, HH:MM:SSam/pm
 * @param format {string} Format in which date is required.
 * @returns {string} The formatted date string.
 */
function getCurrentDateAndTime(
  format: 'YYYY-MM-DD_HH-MM-SS' | 'DD MMMM, YYYY, hh:mm:ssam/pm'
): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const monthLong = date.toLocaleString('en-US', { month: 'long' });
  const monthShort = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours24 = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  let hours12 = date.getHours();
  const ampm = hours12 >= 12 ? 'pm' : 'am';

  hours12 = hours12 % 12;
  hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
  const hoursPadded12 = String(hours12).padStart(2, '0');

  if (format === 'YYYY-MM-DD_HH-MM-SS') {
    return `${year}-${monthShort}-${day}_${hours24}-${minutes}-${seconds}`;
  } else if (format === 'DD MMMM, YYYY, hh:mm:ssam/pm') {
    return `${day} ${monthLong}, ${year}, ${hoursPadded12}:${minutes}:${seconds}${ampm}`;
  } else {
    throw new Error('Invalid format');
  }
}

export default getCurrentDateAndTime;
