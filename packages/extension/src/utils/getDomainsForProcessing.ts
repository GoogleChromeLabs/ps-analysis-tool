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
 * This returns domain 2 domains one with a prefix of '.' and another without prefix of '.'.
 * Eg getDomainsForProcessing(google.com) will return .google.com and google.com.
 * @param {string | undefined} domain The domain that needs to be processed.
 * @returns {string[] | null} String array with primary domain as first element and secondaryDomain as second element.
 */
export default function getDomainsForProcessing(domain: string | undefined) {
  if (!domain) {
    return null;
  }
  const primaryDomain = domain.startsWith('.') ? domain : '.' + domain;

  const secondaryDomain = domain.startsWith('.') ? domain.slice(1) : domain;
  return [primaryDomain, secondaryDomain];
}
