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

const setDomainsInAllowList = async (
  pageUrl: string,
  isIncognito: boolean,
  domain: string,
  domainsInAllowList: Set<string>,
  setter: (list: Set<string>) => void
) => {
  if (!pageUrl && !domain) {
    return;
  }

  const primaryUrl = `https://${domain}/`;

  // Because we need to provide a pattern.
  const secondaryUrlObject = new URL(pageUrl);
  const secondaryUrl = `${secondaryUrlObject.protocol}//${secondaryUrlObject.hostname}/`;

  // @ts-ignore - The chrome-type definition is outdated, and the return type is a promise.
  const details = (await chrome.contentSettings.cookies.get({
    primaryUrl: primaryUrl,
    secondaryUrl: secondaryUrl,
    incognito: isIncognito,
  })) as chrome.contentSettings.CookieSetDetails;

  if (details?.setting) {
    if (details.setting === 'session_only' && !domainsInAllowList.has(domain)) {
      domainsInAllowList.add(domain);
      setter(domainsInAllowList);
    } else if (
      details.setting !== 'session_only' &&
      domainsInAllowList.has(domain)
    ) {
      domainsInAllowList.delete(domain);
      setter(domainsInAllowList);
    }
  }
};

export default setDomainsInAllowList;
