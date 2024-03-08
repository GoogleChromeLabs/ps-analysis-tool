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
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  prepareFrameStatsComponent,
} from '@ps-analysis-tool/design-system';
import type { DataMapping } from '@ps-analysis-tool/design-system/src/components/cookiesLanding/landingHeader';
import { saveAs } from 'file-saver';

/**
 *
 * @param tabCookies
 * @param tabFrames
 * @param description
 */
export default async function downloadReport(tabCookies: any, tabFrames: any) {
  const htmlText = await (await fetch('../report/index.html')).text();
  const parser = new DOMParser();
  const reportDom = parser.parseFromString(htmlText, 'text/html');

  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const frameStateCreator = prepareFrameStatsComponent(tabFrames, tabCookies);
  const cookieClassificationDataMapping: DataMapping[] = [
    {
      title: 'Total cookies',
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
    },
    {
      title: '1st party cookies',
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: '3rd party cookies',
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
    },
  ];
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];

  //injections
  const script = reportDom.createElement('script');
  const code = `window.PSAT_DATA = ${JSON.stringify({
    cookieClassificationDataMapping,
    tabCookies,
    cookiesStatsComponents,
    tabFrames,
    showInfoIcon: true,
    showHorizontalMatrix: false,
    blockedCookieDataMapping,
    showBlockedInfoIcon: true,
    frameStateCreator,
  })}`;
  script.text = code;
  reportDom.head.appendChild(script);

  const injectedHtmlText = `<head>${reportDom.head.innerHTML}<head><body>${reportDom.body.innerHTML}</body>`;

  const html = new Blob([injectedHtmlText]);
  saveAs(html, 'report.html');
}
