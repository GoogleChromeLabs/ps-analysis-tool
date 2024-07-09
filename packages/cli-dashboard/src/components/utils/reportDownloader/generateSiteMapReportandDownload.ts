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
  getCookieKey,
  getValueByKey,
  type CompleteJson,
  type CookieTableData,
  type TabCookies,
} from '@google-psat/common';
import type { TableFilter } from '@google-psat/design-system';

/**
 * Internal dependencies
 */
import { createZip, getFolderName, generateSitemapHTMLFile } from './utils';
import extractCookies from '../extractCookies';
import reshapeCookies from '../reshapeCookies';

const generateSiteMapReportandDownload = async (
  JSONReport: CompleteJson[],
  filteredData: TabCookies,
  appliedFilters: TableFilter,
  path: string,
  reportHTML: string
) => {
  if (!JSONReport.length) {
    return;
  }

  const today = new Date();

  const day = String(today.getDate()).padStart(2, '0'); // Get the day and ensure it has leading zero if needed
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Get the month and ensure it has leading zero if needed
  const year = today.getFullYear();

  const zip = new JSZip();

  JSONReport.forEach((data) => {
    const zipFolder: JSZip | null = zip.folder(
      `psat_cli_report_${getFolderName(data.pageUrl)}_${day + month + year}`
    );

    if (!zipFolder) {
      return;
    }

    let siteFilteredData: TabCookies = reshapeCookies(
      extractCookies(data.cookieData, data.pageUrl, true)
    );

    if (Object.keys(appliedFilters).length) {
      siteFilteredData = Object.values(siteFilteredData)
        .filter((row) => {
          return Object.entries(appliedFilters).every(([filterKey, filter]) => {
            const filterValues = filter.filterValues || {};

            if (Object.keys(filterValues).length === 0) {
              return true;
            }

            const value = getValueByKey(filterKey, row);

            if (filter.comparator !== undefined) {
              return Object.keys(filterValues).some((filterValue) =>
                filter.comparator?.(value, filterValue)
              );
            } else if (filterValues[value]) {
              return filterValues[value].selected;
            }

            return false;
          });
        })
        .reduce<TabCookies>((acc, cookie) => {
          const cookieKey = getCookieKey(
            (cookie as CookieTableData).parsedCookie
          );

          if (!cookieKey) {
            return acc;
          }

          acc[cookieKey] = cookie as CookieTableData;

          return acc;
        }, {});
    }

    createZip(
      data,
      siteFilteredData,
      appliedFilters,
      zipFolder,
      data.pageUrl,
      reportHTML
    );
  });

  const report = generateSitemapHTMLFile(
    filteredData,
    appliedFilters,
    path,
    reportHTML
  );

  zip.file('report.html', report);

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(
    content,
    `psat_cli_report_${getFolderName(path)}_${day + month + year}.zip`
  );
};

export default generateSiteMapReportandDownload;
