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

/**
 * Internal dependencies
 */
import type { CompleteJson } from '../../types';
import {
  generateAllCookiesCSV,
  generateAffectedCookiesCSV,
  generateSummaryDataCSV,
  generateTechnologyCSV,
} from './generateReports';

export const genereateAndDownloadCSVReports = async (
  JSONReport: CompleteJson[],
  selectedPageUrl?: string | null,
  processAllPages?: boolean
) => {
  if (!JSONReport.length) {
    return;
  }

  let siteAnalysisData: CompleteJson[];

  if (selectedPageUrl) {
    siteAnalysisData = [
      JSONReport.find(({ pageUrl }) => pageUrl === selectedPageUrl),
    ] as CompleteJson[];
  } else if (processAllPages) {
    siteAnalysisData = JSONReport;
  } else {
    siteAnalysisData = [JSONReport[0]];
  }

  const zip = new JSZip();

  siteAnalysisData.forEach((data) => {
    const allCookiesCSV = generateAllCookiesCSV(data);
    let technologyDataCSV = null;
    if (data.technologyData.length > 0) {
      technologyDataCSV = generateTechnologyCSV(data);
    }
    const affectedCookiesDataCSV = generateAffectedCookiesCSV(data);
    const summaryDataCSV = generateSummaryDataCSV(data);

    let folderName = data.pageUrl
      .replace(/^https?:\/\//, '')
      .replace(/\/+/g, '-');
    zip.folder(folderName);
    folderName = folderName + '/';

    zip.file(folderName + 'cookies.csv', allCookiesCSV);
    if (technologyDataCSV) {
      zip.file(folderName + 'technologies.csv', technologyDataCSV);
    }
    zip.file(folderName + 'affected-cookies.csv', affectedCookiesDataCSV);
    zip.file(folderName + 'report.csv', summaryDataCSV);
    zip.file(folderName + 'report.json', JSON.stringify(JSONReport, null, 4));
  });

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'report.zip');
};
