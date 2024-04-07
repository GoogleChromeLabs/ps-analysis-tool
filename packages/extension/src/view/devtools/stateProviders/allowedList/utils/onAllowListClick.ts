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
 * Internal dependencies.
 */
import { ChromeStorage } from '../../../../../store';
import removeFromAllowList from './removeFromAllowList';

const onAllowListClick = async (
  domainOrParentDomain: string,
  pageUrl: string,
  isIncognito: boolean,
  isDomainInAllowList: boolean,
  domainsInAllowList: Set<string>,
  setDomainsInAllowList: (list: Set<string>) => void
) => {
  if (!pageUrl || !domainOrParentDomain) {
    return;
  }

  // Because we need to provide a pattern.
  const secondaryUrlObject = new URL(pageUrl);
  const secondaryPattern = `${secondaryUrlObject.protocol}//${secondaryUrlObject.hostname}/*`;

  const primaryPattern = `https://*${domainOrParentDomain}/*`;

  const scope = isIncognito ? 'incognito_session_only' : 'regular';
  const domainObject = {
    primaryDomain: domainOrParentDomain,
    primaryPattern,
    secondaryPattern,
    scope,
  };

  // Remove from allowed list.
  if (isDomainInAllowList) {
    await removeFromAllowList(domainObject);
    domainsInAllowList.delete(domainOrParentDomain);
    setDomainsInAllowList(new Set([...domainsInAllowList]));

    return;
  }

  // The chrome-type definition is outdated,
  // this returns a promise instead of a void.
  try {
    await chrome.contentSettings.cookies.set({
      primaryPattern,
      secondaryPattern,
      setting: 'session_only',
      scope,
    });

    domainsInAllowList.add(domainOrParentDomain);
    setDomainsInAllowList(new Set([...domainsInAllowList]));
    ChromeStorage.addDomainToAllowList(domainObject);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      error,
      `Primary pattern: ${primaryPattern}`,
      `Secondary pattern: ${secondaryPattern}`
    );
  }
};

export default onAllowListClick;
