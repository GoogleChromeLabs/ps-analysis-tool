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
// @todo Create and use from a common package.
/**
 * External dependencies.
 */
import { getDomain } from 'tldts';

/**
 * Internal dependencies.
 */
import parseUrl from './parseUrl';

/**
 * Identifies if a cookie's domain is first party by comparing it with the domain of the given URL.
 * @param {string | undefined} cookieDomain - The URL of the server that is setting/updating the cookie.
 * @param {string} tabUrl - The top-level URL (URL in the tab's address bar).
 * @returns {boolean | null} - true if the cookie is first party, false if it's third party, or null if a bad tab URL was passed.
 */
const isFirstParty = (
  cookieDomain: string | undefined,
  tabUrl: string
): boolean | null => {
  if (!parseUrl(tabUrl)) {
    return null;
  }

  return !cookieDomain || getDomain(tabUrl) === getDomain(cookieDomain);
};

export default isFirstParty;
