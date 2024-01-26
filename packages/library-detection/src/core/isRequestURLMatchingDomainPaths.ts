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
/* webpack bundling means the gapi.auth2 modules used by Google Sign-in
 * is available in /js/<various-filenames>.js files.
 * Only those filenames directly mentioned in the developer documentation
 * are considered to be positive matches.
 */
/**
 * External dependencies.
 */
import { type DomainPaths } from '../types';

/**
 * Checks if the provided request URL matches the provided domain paths.
 * @param requestUrl - The URL to check.
 * @param domainPaths - The domain paths to check against.
 * @returns True if the request URL matches the provided domain paths, false otherwise.
 */
const isRequestURLMatchingDomainPaths = (
  requestUrl: string,
  domainPaths: DomainPaths
) => {
  let url: URL;

  try {
    url = new URL(requestUrl);
  } catch (error) {
    return false;
  }

  const matchedDomain = Object.keys(domainPaths).find((domain) => {
    const matchedHost = url.host === domain;
    const matchedPath = domainPaths[domain].includes(url.pathname);

    return matchedHost && matchedPath;
  });

  return matchedDomain ? true : false;
};

export default isRequestURLMatchingDomainPaths;
