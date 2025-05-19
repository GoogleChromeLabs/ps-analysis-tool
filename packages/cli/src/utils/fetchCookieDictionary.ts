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
 * External dependencies.
 */
import fs from 'fs';
import path from 'path';
import { type CookieDatabase } from '@google-psat/common';

/**
 * Internal dependencies.
 */

/**
 * Fetch dictionary from local data folder.
 * @returns {Promise<CookieDatabase>} Open Cookie Data base
 */
export function fetchDictionary(): Promise<CookieDatabase> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve(__dirname, './assets/data/open-cookie-database.json'),
      {
        encoding: 'utf8',
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      }
    );
  });
}
