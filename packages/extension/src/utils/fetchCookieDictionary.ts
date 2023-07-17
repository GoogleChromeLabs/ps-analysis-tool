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

export type CookieAnalytics = {
  platform: string;
  category: string;
  name: string;
  domain: string;
  description: string;
  retention: string;
  dataController: string;
  gdprUrl: string;
  wildcard: string;
};

export type CookieDatabase = {
  [category: string]: Array<CookieAnalytics>;
};

/**
 * Fetch dictionary from local data folder.
 * @returns {Promise<CookieDatabase>} Open Cookie Data base
 */
export async function fetchDictionary(): Promise<CookieDatabase> {
  const url = chrome.runtime.getURL(
    'third_party/data/open-cookie-database.json'
  );

  const data = await (await fetch(url)).json();

  return data;
}
