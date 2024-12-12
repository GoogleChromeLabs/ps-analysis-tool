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
import {
  generateErrorLogFile,
  generateRootSummaryDataCSV,
  type CompleteJson,
} from '@google-psat/common';
import { ensureFile, writeFile } from 'fs-extra';
import path, { basename } from 'path';

/**
 * Internal dependencies.
 */
import generateCSVFiles from './generateCSVfiles';
import saveResultsAsHTML from './saveResultAsHTML';

const getFolderName = (pageUrl: string) => {
  let folderName = pageUrl
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+/g, '-');

  if (folderName.endsWith('-')) {
    const lastDashIndex = folderName.lastIndexOf('-');
    folderName = folderName.substring(0, lastDashIndex);
  }

  return folderName;
};

const saveReports = async (
  outDir: string,
  result: CompleteJson[],
  sitemapUrl: string
) => {
  if (result.length > 1) {
    await saveResultsAsHTML(
      outDir,
      result,
      true,
      sitemapUrl ? new URL(sitemapUrl).hostname : basename(outDir),
      'report.html',
      sitemapUrl
    );

    const errorLogs = generateErrorLogFile(result);

    await ensureFile(path.join(outDir, 'error_logs.txt'));
    await writeFile(path.join(outDir, 'error_logs.txt'), errorLogs);

    const rootSummaryData = generateRootSummaryDataCSV(result);
    await ensureFile(path.join(outDir, 'report.csv'));
    await writeFile(path.join(outDir, 'report.csv'), rootSummaryData);

    const errorLogs = generateErrorLogFile(result);

    await ensureFile(path.join(outDir, 'error_logs.txt'));
    await writeFile(path.join(outDir, 'error_logs.txt'), errorLogs);
    // Sitemap report
    await Promise.all(
      result.map(async (siteReport) => {
        const { allCookiesCSV, cookiesWithIssuesDataCSV, summaryDataCSV } =
          generateCSVFiles(siteReport);

        const fileDir = path.join(outDir, getFolderName(siteReport.pageUrl));

        await ensureFile(path.join(fileDir, 'cookies.csv'));
        await writeFile(path.join(fileDir, 'cookies.csv'), allCookiesCSV);

        await ensureFile(path.join(fileDir, 'report.html'));
        await saveResultsAsHTML(
          fileDir,
          [siteReport],
          false,
          new URL(siteReport.pageUrl).hostname,
          'report.html',
          sitemapUrl
        );

        await ensureFile(path.join(fileDir, 'cookie-issues.csv'));
        await writeFile(
          path.join(fileDir, 'cookies-issues.csv'),
          cookiesWithIssuesDataCSV
        );

        await ensureFile(path.join(fileDir, 'report.csv'));
        await writeFile(path.join(fileDir, 'report.csv'), summaryDataCSV);
      })
    );
  } else {
    //site report
    const { allCookiesCSV, cookiesWithIssuesDataCSV, summaryDataCSV } =
      generateCSVFiles(result[0]);
    await ensureFile(path.join(outDir, 'cookies.csv'));
    await writeFile(path.join(outDir, 'cookies.csv'), allCookiesCSV);

    await ensureFile(path.join(outDir, 'report.html'));
    await saveResultsAsHTML(
      outDir,
      [result[0]],
      false,
      new URL(result[0].pageUrl).hostname,
      'report.html'
    );

    await ensureFile(path.join(outDir, 'cookie-issues.csv'));
    await writeFile(
      path.join(outDir, 'cookie-issues.csv'),
      cookiesWithIssuesDataCSV
    );

    await ensureFile(path.join(outDir, 'report.csv'));
    await writeFile(path.join(outDir, 'report.csv'), summaryDataCSV);
  }
};

export default saveReports;
