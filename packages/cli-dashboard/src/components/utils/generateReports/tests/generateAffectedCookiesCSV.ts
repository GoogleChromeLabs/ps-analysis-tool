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

import generateAffectedCookiesCSV from '../generateAffectedCookiesCSV';
import { mockData1 } from './data.mock';

describe('generateAffectedCookiesCSV', () => {
  it('should create CSV string for affected cookies', () => {
    const CSVString = generateAffectedCookiesCSV(mockData1);

    expect(CSVString.split('\r\n').filter((str) => str).length).toBe(4);
  });
});
