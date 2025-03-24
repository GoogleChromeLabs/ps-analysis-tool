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
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  type CompleteJson,
  generateRootSummaryDataCSV,
  getCurrentDateAndTime,
  generateErrorLogFile,
} from '@google-psat/common';
import { type TableFilter } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import { createZip, getFolderName, generateSitemapHTMLFile } from './utils';

const generateSiteMapReportandDownload = async (
  JSONReport: CompleteJson[],
  appliedFilters: TableFilter,
  path: string
) => {
  if (!JSONReport.length) {
    return;
  }

  const zip = new JSZip();

  JSONReport.forEach((data) => {
    const zipFolder: JSZip | null = zip.folder(
      `psat_cli_report_${getFolderName(data.pageUrl)}_${getCurrentDateAndTime(
        'YYYY-MM-DD_HH-MM-SS'
      )}`
    );

    if (!zipFolder) {
      return;
    }

    createZip(data, appliedFilters, zipFolder);
  });

  const report = generateSitemapHTMLFile(JSONReport, appliedFilters);
  const rootSummaryData = generateRootSummaryDataCSV(JSONReport);

  zip.file('report.html', report);

  const errorLogs = generateErrorLogFile(JSONReport);

  zip.file('error_logs.txt', errorLogs);
  zip.file('report.csv', rootSummaryData);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(
    content,
    `psat_cli_report_${getFolderName(path)}_${getCurrentDateAndTime(
      'YYYY-MM-DD_HH-MM-SS'
    )}.zip`
  );
};

export default generateSiteMapReportandDownload;
