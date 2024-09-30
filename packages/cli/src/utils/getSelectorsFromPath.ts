/*
 * Copyright 2024 Google LLC
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
 * External dependencies
 */
import { Selectors } from '@google-psat/common';
import { readFileSync } from 'fs';

/**
 * This function will read and return the object which will be used to accept the GDPR banner in sitemap analysis.
 * @param {string} path the path to the json file which contain the json data.
 * @returns {Selectors} the object which will be used to accept the GDPR banner in sit
 */
function getSelectorsFromPath(path: string): Selectors {
  const fileContentString = readFileSync(path, 'utf-8');
  const fileJSONObject = JSON.parse(fileContentString);
  return {
    cssSelectors: fileJSONObject?.cssSelectors,
    textSelectors: fileJSONObject?.textSelectors,
    xPath: fileJSONObject?.xPath,
  };
}

export default getSelectorsFromPath;
