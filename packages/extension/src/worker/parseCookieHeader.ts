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
import cookie from 'simple-cookie';

/**
 * Internal dependencies.
 */
import type { Header } from './types';

/**
 * Parse cookies header.
 * @param {string} url URL.
 * @param {string} top Top level url.
 * @param {object} header Header
 * @returns {object | null} Parsed cookie object.
 */
const parseCookieHeader = (
  url: string,
  top: string | undefined,
  header: Header
) => {
  if (!header.value || !['set-cookie'].includes(header.name.toLowerCase())) {
    return null;
  }

  const c = cookie.parse(header.value);

  const origin = url ? new URL(url).origin : '';
  const toplevel = top ? new URL(top).origin : '';
  return { parsedData: c, origin, toplevel };
};

export default parseCookieHeader;
