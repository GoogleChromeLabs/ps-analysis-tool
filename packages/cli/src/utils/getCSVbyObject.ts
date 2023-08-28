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
const getCSVbyObject = (data: Array<object>): string => {
  if (!data.length) {
    return '';
  }

  const keys = Object.keys(data[0]);
  const allData = [keys, ...data];

  const csvRows: Array<string> = [];

  allData.forEach((rowData) => {
    const row = Object.values(rowData);

    csvRows.push(
      row
        .map(String)
        .map((v) => v.replace('"', '""')) // escape double colons
        .map((v) => `"${v}"`) // quote it
        .join(',') // comma-separated
    );
  });

  return csvRows.join('\r\n'); // rows starting on new lines
};

export default getCSVbyObject;
