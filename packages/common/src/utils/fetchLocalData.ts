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
const fetchLocalData = async (path: string) => {
  try {
    const url = chrome.runtime.getURL(path);
    const response = await fetch(url);

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`Failed to fetch local data from path: ${path}. Error:`, error);

    return [];
  }
};

export default fetchLocalData;
