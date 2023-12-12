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
 * Converts a string value to a valid CSV record.
 * @see https://datatracker.ietf.org/doc/html/rfc4180
 * @param {string} record - a string value that need to be converted into a CSV record.
 * @returns {URL | null} - The parsed URL object or null if the URL is invalid.
 */
const sanitizeCsvRecord = (record: string | null | undefined): string => {
  if (!record) {
    return '';
  }
  let recordCopy = record;
  recordCopy = recordCopy.replaceAll('"', '""');
  return recordCopy.includes(',') ? '"' + recordCopy + '"' : recordCopy;
};

export default sanitizeCsvRecord;
