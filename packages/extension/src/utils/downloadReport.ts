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
  getCurrentDateAndTime,
  type TabCookies,
  type TabFrames,
  isValidURL,
} from '@google-psat/common';
import { saveAs } from 'file-saver';
import { I18n } from '@google-psat/i18n';
import type { TableFilter } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { generateDashboardObject } from './generateReportObject';

/**
 * Utility function to download report.
 * @param url Top level URL.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param appliedFilters Applied filters.
 * @param isUsingCDP CDP status.
 */
export default async function downloadReport(
  url: string,
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  appliedFilters: TableFilter,
  isUsingCDP: boolean
) {
  const { html, fileName } = await generateDashboard(
    url,
    tabCookies,
    tabFrames,
    appliedFilters,
    isUsingCDP
  );

  saveAs(html, fileName);
}

export const generateDashboard = async (
  url: string,
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  appliedFilters: TableFilter,
  isUsingCDP: boolean
) => {
  const dashboardReport = await (await fetch('./dashboard.html')).text();
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(dashboardReport, 'text/html');

  // Injections
  const script = reportDom.createElement('script');

  const reportData = generateDashboardObject(tabCookies, tabFrames, url);

  const locale = I18n.getLocale();
  const translations = await I18n.fetchMessages(locale);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dateTime =
    getCurrentDateAndTime('DD MMMM, YYYY, hh:mm:ssam/pm') + ' ' + timeZone;
  const { version } = chrome?.runtime?.getManifest
    ? chrome.runtime.getManifest()
    : { version: '' };

  const code = `
  window.PSAT_EXTENSION = true;
	window.PSAT_USING_CDP = ${isUsingCDP};
  window.PSAT_DATA = ${JSON.stringify({
    json: reportData,
    type: 'url',
    selectedSite: isValidURL(url)
      ? new URL(url).hostname.replace('.', '-')
      : '',
    translations,
    appliedFilters,
    dateTime,
    psatVersion: version,
    hideDownloadButton: true,
  })}`;

  script.text = code;
  script.id = 'JSONDATASCRIPT';
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);
  const hostname = new URL(url).hostname;

  return {
    html,
    fileName: `${hostname.replace('.', '-')}-report-${getCurrentDateAndTime(
      'YYYY-MM-DD_HH-MM-SS'
    )}.html`,
  };
};
