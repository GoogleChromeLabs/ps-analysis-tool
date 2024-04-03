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
import { CompleteJson } from '@ps-analysis-tool/common';
import { ensureFile, writeFile } from 'fs-extra';
/**
 * Internal dependencies.
 */
import generateCSVFiles from './generateCSVfiles';
import path from 'path';

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

const saveCSVReports = async (outDir: string, result: CompleteJson[]) => {
  if (result.length > 1) {
    // Sitemap report
    await Promise.all(
      result.map(async (siteReport) => {
        const {
          allCookiesCSV,
          technologyDataCSV,
          cookiesWithIssuesDataCSV,
          summaryDataCSV,
        } = generateCSVFiles(siteReport);

        const fileDir = path.join(outDir, getFolderName(siteReport.pageUrl));

        await ensureFile(path.join(fileDir, 'cookies.csv'));
        await writeFile(path.join(fileDir, 'cookies.csv'), allCookiesCSV);

        if (technologyDataCSV) {
          await ensureFile(path.join(fileDir, 'technologies.csv'));
          await writeFile(
            path.join(fileDir, 'technologies.csv'),
            technologyDataCSV
          );
        }

        await ensureFile(path.join(fileDir, 'cookies-with-issues.csv'));
        await writeFile(
          path.join(fileDir, 'cookies-with-issues.csv'),
          cookiesWithIssuesDataCSV
        );

        await ensureFile(path.join(fileDir, 'report.csv'));
        await writeFile(path.join(fileDir, 'report.csv'), summaryDataCSV);
      })
    );
  } else {
    //site report
    const {
      allCookiesCSV,
      technologyDataCSV,
      cookiesWithIssuesDataCSV,
      summaryDataCSV,
    } = generateCSVFiles(result[0]);
    await ensureFile(path.join(outDir, 'cookies.csv'));
    await writeFile(path.join(outDir, 'cookies.csv'), allCookiesCSV);

    if (technologyDataCSV) {
      await ensureFile(path.join(outDir, 'technologies.csv'));
      await writeFile(path.join(outDir, 'technologies.csv'), technologyDataCSV);
    }

    await ensureFile(path.join(outDir, 'cookies-with-issues.csv'));
    await writeFile(
      path.join(outDir, 'cookies-with-issues.csv'),
      cookiesWithIssuesDataCSV
    );

    await ensureFile(path.join(outDir, 'report.csv'));
    await writeFile(path.join(outDir, 'report.csv'), summaryDataCSV);
  }
};

export default saveCSVReports;
