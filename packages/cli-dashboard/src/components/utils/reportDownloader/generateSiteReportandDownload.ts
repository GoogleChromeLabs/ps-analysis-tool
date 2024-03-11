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
import type { CompleteJson } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { createZip, getFolderName } from './utils';

const generateSiteReportandDownload = async (
  JSONReport: CompleteJson[],
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

  const zipFolder: JSZip | null = zip.folder(
    getFolderName(siteAnalysisData.pageUrl)
  );

  if (!zipFolder) {
    return;
  }

  createZip(siteAnalysisData, zipFolder);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'report.zip');
};

export default generateSiteReportandDownload;
