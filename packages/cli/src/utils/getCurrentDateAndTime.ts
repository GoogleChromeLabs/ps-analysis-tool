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
 * The format is: DD Month, YYYY, HH:MMam/pm
 * @param {Date} date - The date object to format.
 * @returns {string} The formatted date string.
 */
function getCurrentDataAndTime(): string {
  const date = new Date();

  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  let hours = date.getHours();

  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return `${day} ${month}, ${year}, ${hours}:${minutes}${ampm} (${timezone})`;
}

export default getCurrentDataAndTime;
