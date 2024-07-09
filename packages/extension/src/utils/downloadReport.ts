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
import type { LibraryData, TabCookies, TabFrames } from '@google-psat/common';
import { saveAs } from 'file-saver';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import {
  generateReportObject,
  generateDashboardObject,
} from './generateReportObject';

/**
 * Utility function to download report.
 * @param url Top level URL.
 * @param tabCookies Tab cookies.
 * @param tabFrames Tab frames.
 * @param libraryMatches Libary matches
 */
export default async function downloadReport(
  url: string,
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData
) {
  const { html, fileName } = await generateDashboard(
    url,
    tabCookies,
    tabFrames,
    libraryMatches
  );

  saveAs(html, fileName);
}

const generateDashboard = async (
  url: string,
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData
) => {
  const dashboardReport = await (await fetch('./dashboard.html')).text();
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(dashboardReport, 'text/html');

  // Injections
  const script = reportDom.createElement('script');

  const reportData = generateDashboardObject(
    tabCookies,
    tabFrames,
    libraryMatches,
    url
  );

  const locale = I18n.getLocale();
  const translations = await I18n.fetchMessages(locale);
  const htmlText = await (await fetch('../report/index.html')).text();

  const code = `
  window.PSAT_EXTENSION = true;
  window.PSAT_REPORT_HTML = '${btoa(unescape(encodeURIComponent(htmlText)))}';
  window.PSAT_DATA = ${JSON.stringify({
    json: reportData,
    selectedSite: url,
    translations,
  })}`;

  script.text = code;
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);
  const hostname = new URL(url).hostname;

  return { html, fileName: `${hostname.replace('.', '-')}-report.html` };
};

export const generateReportFile = async (
  url: string,
  tabCookies: TabCookies,
  tabFrames: TabFrames,
  libraryMatches: LibraryData
) => {
  const htmlText = await (await fetch('../report/index.html')).text();
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(htmlText, 'text/html');

  // Injections
  const script = reportDom.createElement('script');

  const reportData = await generateReportObject(
    tabCookies,
    tabFrames,
    libraryMatches,
    url
  );

  const code = `window.PSAT_DATA = ${JSON.stringify(reportData)}`;

  script.text = code;
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;
  const html = new Blob([injectedHtmlText]);
  const hostname = new URL(url).hostname;

  return [html, `${hostname.replace('.', '-')}-report.html`];
};
