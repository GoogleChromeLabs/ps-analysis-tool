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
import { getDomain } from 'tldts';

/**
 * Returns the domain of a cookie from the url.
 * @param url {string} the url the cookies is associated with.
 * @returns {string} domain of the cookie.
 */
export default function getDomainFromUrl(url: string) {
  let domain = getDomain(url);
  if (domain) {
    domain = domain.startsWith('.') ? domain : '.' + domain;
  }
  return domain || '';
}
