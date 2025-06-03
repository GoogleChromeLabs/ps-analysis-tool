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
import getDotPrefixedDomain from './getDotPrefixedDomain';

const isCookieDomainInAllowList = (
  domain: string,
  domainsInAllowList: Set<string>
) => {
  const dotPrefixedDomain = getDotPrefixedDomain(domain);

  let isDomainInAllowList = domainsInAllowList.has(dotPrefixedDomain);

  if (!isDomainInAllowList) {
    isDomainInAllowList = [...domainsInAllowList].some((storedDomain) => {
      // For example xyz.bbc.com and .bbc.com
      return (
        dotPrefixedDomain.endsWith(storedDomain) &&
        dotPrefixedDomain !== storedDomain
      );
    });
  }

  return isDomainInAllowList;
};

export default isCookieDomainInAllowList;
