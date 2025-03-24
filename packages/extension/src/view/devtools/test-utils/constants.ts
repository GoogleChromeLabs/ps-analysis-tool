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

export const selectors = {
  siteBoundariesSelector: 'button[title="Site Boundaries"]',
  cookieDropDownSelector: 'button[title="Cookies"]',
  chromeExtensionUrl: 'chrome://extensions/',
  extensionPageErrorButton: 'cr-button#errors-button',
  devtoolIframeSelector: 'iframe.extension',
  privacySandBoxEmbedIframeSelector:
    'div[data-testid="privacy-sandbox-content"]',
  analyzeThisButtonSelector: 'button[data-test-id="button"]',
  cookieTabAccordion: 'div[data-testid="cookies-accordion-opener"]',
  siteBoundriesTabAccordion:
    'div[data-testid="siteBoundaries-accordion-opener"]',
  tableRowsSelector: 'div[data-testid="body-row"]',
  firstRowSelector: 'div[tabindex="0"]',
  searchFieldCookietab: 'input[type="text"][placeholder="Search"]',
  TotalCookieTextCookietab:
    'p.text-xs.text-center.font-semibold.leading-relaxed.dark\\:text-bright-gray',
  totalCookieCount: 'p[class*="absolute top-1/2 left-1/2"]',
  sortSVG: 'svg.transform.rotate-180',
  firstRowXpath: '//div[@id="0"]/div[@tabindex="0"]',
  descriptionBoxSelector: 'p.text-outer-space-crayola.dark\\:text-bright-gray',
  siteBoundariesIframeSelector:
    'iframe[src="https://privacysandbox.info/en/privacy-sandbox/strengthen-privacy-boundaries"]',
  privateAdvertisingIframeSelector:
    'iframe[src="https://privacysandbox.info/en/privacy-sandbox/measure-digital-ads"]',
  trackingProtectionIframeSelector:
    'iframe[src="https://privacysandbox.info/en/privacy-sandbox/prevent-covert-tracking"]',
  searchTextboxSelector: 'input[placeholder="Search"]',
  clearSearchButtonXPathSelector:
    '//*[@id="root"]/div/div/main/div/div/div/div[1]/button[2]',
  rwsContactField:
    'input[type="text"][placeholder="Email address or group alias if available"]',
  rwsPrimaryDomainField:
    'input[type="text"][placeholder="https://primary.com"]',
};

export const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';

export const DEFAULT_VIEWPORT = {
  width: 1440,
  height: 790,
  deviceScaleFactor: 1,
};
