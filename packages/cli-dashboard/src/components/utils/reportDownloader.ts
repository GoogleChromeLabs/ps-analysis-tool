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

export const genereateAndDownloadCSVReports = (
  JSONReport: CompleteJson[],
  selectedPageUrl?: string | null
) => {
  if (!JSONReport) {
    return;
  }

  let siteAnalysisData: CompleteJson = JSONReport[0];

  if (selectedPageUrl) {
    siteAnalysisData = JSONReport.find(
      ({ pageUrl }) => pageUrl === selectedPageUrl
    ) as CompleteJson;
  } else {
    siteAnalysisData = JSONReport[0];
  }

  const allCookiesCSV = generateAllCookiesCSV(siteAnalysisData);
  let technologyDataCSV = null;
  if (siteAnalysisData.technologyData.length > 0) {
    technologyDataCSV = generateTechnologyCSV(siteAnalysisData);
  }
  const affectedCookiesDataCSV = generateAffectedCookiesCSV(siteAnalysisData);
  const summaryDataCSV = generateSummaryDataCSV(siteAnalysisData);

  const zip = new JSZip();
  zip.file('cookies.csv', allCookiesCSV);
  if (technologyDataCSV) {
    zip.file('technologies.csv', technologyDataCSV);
  }
  zip.file('affected-cookies.csv', affectedCookiesDataCSV);
  zip.file('report.csv', summaryDataCSV);
  zip.file('report.json', JSON.stringify(JSONReport, null, 4));
  zip.generateAsync({ type: 'blob' }).then((content) => {
    // see FileSaver.js
    saveAs(content, 'report.zip');
  });
};
