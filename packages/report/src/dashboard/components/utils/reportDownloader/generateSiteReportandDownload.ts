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
import { getCurrentDateAndTime, type CompleteJson } from '@google-psat/common';
import { type TableFilter } from '@google-psat/design-system';
/**
 * Internal dependencies
 */
import { createZip, getFolderName } from './utils';

const generateSiteReportandDownload = async (
  JSONReport: CompleteJson[],
  appliedFilters: TableFilter,
  selectedPageUrl?: string | null
) => {
  if (!JSONReport.length) {
    return;
  }

  const zip = new JSZip();

  let siteAnalysisData: CompleteJson;

  if (selectedPageUrl) {
    siteAnalysisData = JSONReport.find(
      ({ pageUrl }) => pageUrl === selectedPageUrl
    ) as CompleteJson;
  } else {
    siteAnalysisData = JSONReport[0];
  }

  const hostName = new URL(siteAnalysisData.pageUrl).hostname;
  // @ts-ignore -- because this data will already be injected from the extension.
  const fileName = globalThis?.PSAT_EXTENSION
    ? `${hostName.replace('.', '-')}-report-${getCurrentDateAndTime(
        'YYYY-MM-DD_HH-MM-SS'
      )}`
    : `psat_cli_report_${getFolderName(
        JSONReport[0].pageUrl
      )}_${getCurrentDateAndTime('YYYY-MM-DD_HH-MM-SS')}`;

  const zipFolder: JSZip | null = zip.folder(fileName);

  if (!zipFolder) {
    return;
  }

  createZip(siteAnalysisData, appliedFilters, zipFolder);

  const content = await zip.generateAsync({ type: 'blob' });

  saveAs(content, fileName + '.zip');
};

export default generateSiteReportandDownload;
