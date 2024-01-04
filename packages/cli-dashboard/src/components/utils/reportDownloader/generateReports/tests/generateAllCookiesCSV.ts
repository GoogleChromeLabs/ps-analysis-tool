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
 * Internal dependencies
 */
import generateAllCookiesCSV from '../generateAllCookiesCSV';
import { mockData1, mockData2 } from './data.mock';

describe('generateAllCookiesCSV', () => {
  it('should generate CSV with one more line than no of cookies', () => {
    const CSVString = generateAllCookiesCSV(mockData1);

    expect(CSVString.split('\r\n').filter((str) => str).length).toBe(4);
  });

  it('should generate cookies CSV with one entry for each cookies', () => {
    const CSVString = generateAllCookiesCSV(mockData2);

    expect(CSVString.split('\r\n').filter((str) => str).length).toBe(5);
  });
});
