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
import { type Cookie as ParsedCookie } from 'simple-cookie';
import { getDomain } from 'tldts';

/**
 * Internal dependencies.
 */
import { getCurrentTabId } from '../utils/getCurrentTabId';
import { findPreviousCookieDataObject } from './findPreviousCookieDataObject';
import { getCookieKey } from '@ps-analysis-tool/common';

/**
 * Create cookie object from cookieStore API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param parsedCookie Parsed cookie object from request/response.
 * @param url URL of the cookie from the request/response.
 * @returns {Promise<{ParsedCookie}>} Cookie object.
 */
export async function createCookieObject(
  parsedCookie: ParsedCookie,
  url: string
) {
  const chromeStoreCookie = await chrome.cookies.get({
    name: parsedCookie.name,
    url,
  });

  const prevParsedCookie = (
    await findPreviousCookieDataObject(
      (await getCurrentTabId()) || '0',
      getCookieKey(parsedCookie)
    )
  )?.parsedCookie;

  const name = parsedCookie.name;
  const value = parsedCookie.value;
  const domain = parseAttributeValues(
    'domain',
    parsedCookie.domain,
    chromeStoreCookie?.domain,
    prevParsedCookie?.domain,
    url
  );
  const path = parseAttributeValues(
    'path',
    parsedCookie.path,
    chromeStoreCookie?.path,
    prevParsedCookie?.path
  );

  const secure = parseAttributeValues(
    'secure',
    parsedCookie.secure,
    chromeStoreCookie?.secure,
    prevParsedCookie?.secure
  );

  const httponly = parseAttributeValues(
    'httponly',
    parsedCookie.httponly,
    chromeStoreCookie?.httpOnly,
    prevParsedCookie?.httponly
  );

  const samesite = parseAttributeValues(
    'samesite',
    parsedCookie.samesite,
    chromeStoreCookie?.sameSite,
    prevParsedCookie?.samesite
  );

  const expires = parseAttributeValues(
    'expires',
    parsedCookie.expires,
    (chromeStoreCookie?.expirationDate || 0) * 1000,
    prevParsedCookie?.expires
  );

  return {
    name,
    value,
    domain,
    path,
    secure,
    httponly,
    samesite,
    expires,
  } as ParsedCookie;
}

/**
 * Parse cookie attribute values from cookieStore API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param type Cookie attribute type.
 * @param parsedCookieValue Cookie attribute value from the parsed cookie object.
 * @param chromeStoreCookieValue Cookie attribute value from the cookieStore API cookie object.
 * @param prevParsedCookieValue Cookie attribute value from the previously saved parsed cookie object.
 * @param url URL of the cookie from the request/response. (Only required for domain attribute)
 * @returns {string | boolean | number} Cookie attribute value.
 */
function parseAttributeValues(
  type: string,
  parsedCookieValue: string | boolean | number | Date | undefined,
  chromeStoreCookieValue: string | boolean | number | Date | undefined,
  prevParsedCookieValue: string | boolean | number | Date | undefined,
  url?: string | undefined
) {
  let value =
    parsedCookieValue || chromeStoreCookieValue || prevParsedCookieValue;

  if (type === 'domain') {
    if (url) {
      value = value || '.' + getDomain(url);
    } else {
      value = value || '';
    }
  }

  if (type === 'path') {
    value = value || '/';
  }

  if (type === 'secure') {
    value = value || false;
  }

  if (type === 'httponly') {
    value = value || false;
  }

  if (type === 'samesite') {
    if (value === 'no_restriction') {
      value = 'none';
    } else if (value === 'unspecified') {
      value = '';
    }
    value = ((value || '') as string).toLowerCase();
  }

  if (type === 'expires' && value !== 0) {
    value = new Date(value as string).toJSON() || 0;
  }

  return value;
}
