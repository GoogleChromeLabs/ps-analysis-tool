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
  CookieStore,
  type AllowedDomainObject,
} from '@ps-analysis-tool/extension/src/localStore';

/**
 * Internal dependencies.
 */
import removeFromAllowList from './removeFromAllowList';

const handleAllowListClick = async (
  domainOrParentDomain: string,
  pageUrl: string,
  isIncognito: boolean,
  isDomainInAllowList: boolean,
  domainsInAllowList: Set<string>,
  setDomainsInAllowList: (domainList: Set<string>) => void
) => {
  if (pageUrl === '' || domainOrParentDomain === '') {
    return;
  }

  // Because we need to provide a pattern.
  const secondaryPattern = pageUrl.endsWith('/')
    ? pageUrl + '*'
    : pageUrl + '/*';

  let primaryPattern = domainOrParentDomain;

  primaryPattern =
    'https://' +
    (primaryPattern.startsWith('.') ? '*' : '') +
    primaryPattern +
    '/*';

  const scope = isIncognito ? 'incognito_session_only' : 'regular';
  const domainObject: AllowedDomainObject = {
    primaryDomain: domainOrParentDomain, // For finding parent domain.
    primaryPattern,
    secondaryPattern,
    scope,
  };

  // Remove from allowed list.
  if (isDomainInAllowList) {
    await removeFromAllowList(domainObject);
    domainsInAllowList.delete(domainOrParentDomain);
    setDomainsInAllowList(domainsInAllowList);

    return;
  }

  // Add to allow list.
  const allowedDomainObjects = await CookieStore.getDomainsInAllowList();

  await Promise.all(
    allowedDomainObjects.map(async (domainObjectItem) => {
      // Check if more specific patterns was added to allow-list,
      // and remove it as the general pattern will be applied. (look for child domain)
      if (
        domainObjectItem.primaryDomain.endsWith(domainOrParentDomain) ||
        `.${domainObjectItem.primaryDomain}` === domainOrParentDomain
      ) {
        domainsInAllowList.delete(domainObjectItem.primaryDomain);

        await removeFromAllowList(domainObjectItem);
      }
    })
  );

  chrome.contentSettings.cookies
    .set({
      primaryPattern,
      secondaryPattern,
      setting: 'session_only',
      scope,
    })
    // @ts-ignore - The chrome-type definition is outdated,
    // this returns a promise instead of a void.
    .then(() => {
      domainsInAllowList.add(domainOrParentDomain);
      setDomainsInAllowList(domainsInAllowList);
      CookieStore.addDomainToAllowList(domainObject);
    })
    .catch((error: Error) => {
      console.log(
        error.message,
        `Primary pattern: ${primaryPattern}`,
        `Secondary pattern: ${secondaryPattern}`
      );
    });
};

export default handleAllowListClick;
