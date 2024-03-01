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
 * External dependencies
 */
import { CookieTableData } from '@ps-analysis-tool/common';
import { saveAs } from 'file-saver';

/**
 * Internal dependencies
 */
import { TableRow } from '../../table';
import { generateCookieTableCSV } from '../../table/utils';

const exportCookies = (rows: TableRow[]) => {
  const _cookies = rows.map(({ originalData }) => originalData);
  if (_cookies.length > 0 && 'parsedCookie' in _cookies[0]) {
    const csvTextBlob = generateCookieTableCSV(_cookies as CookieTableData[]);
    saveAs(csvTextBlob, 'Cookies Report.csv');
  }
};

export default exportCookies;
