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
import { findPrevCookieDataObject } from './findPrevCookieDataObject';
import { getCookie } from '../utils/getCookie';

/**
 * Create cookie object from cookieStore API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param cookie Cookie object.
 * @param url URL of the cookie from the request/response.
 * @returns {Promise<{ParsedCookie}>} Cookie object.
 */
export async function createCookieObject(cookie: ParsedCookie, url: string) {
  const cookieObj = await getCookie(cookie.name, url);

  const prevCookieObj = (
    await findPrevCookieDataObject(
      (await getCurrentTabId()) || ('0' as string),
      cookie.name
    )
  )?.parsedCookie;

  const name = cookie.name;
  const value = cookie.value;
  const domain = parseAttributeValues(
    'domain',
    cookie.domain,
    cookieObj?.domain,
    prevCookieObj?.domain,
    url
  );
  const path = parseAttributeValues(
    'path',
    cookie.path,
    cookieObj?.path,
    prevCookieObj?.path
  );

  const secure = parseAttributeValues(
    'secure',
    cookie.secure,
    cookieObj?.secure,
    prevCookieObj?.secure
  );

  const httponly = parseAttributeValues(
    'httponly',
    cookie.httponly,
    cookieObj?.httpOnly,
    prevCookieObj?.httponly
  );

  const samesite = parseAttributeValues(
    'samesite',
    cookie.samesite,
    cookieObj?.sameSite,
    prevCookieObj?.samesite
  );

  const expires = parseAttributeValues(
    'expires',
    cookie.expires,
    cookieObj?.expirationDate,
    prevCookieObj?.expires
  );

  const parsedCookie = {
    name,
    value,
    domain,
    path,
    secure,
    httponly,
    samesite,
    expires,
  } as ParsedCookie;

  return parsedCookie;
}

/**
 * Parse cookie attribute values from cookieStore API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param type Cookie attribute type.
 * @param parseCookieValue Cookie attribute value from the parsed cookie object.
 * @param chromeStoreCookieValue Cookie attribute value from the cookieStore API cookie object.
 * @param prevParsedCookieValue Cookie attribute value from the previously saved parsed cookie object.
 * @param url URL of the cookie from the request/response. (Only required for domain attribute)
 * @returns {string | boolean | number} Cookie attribute value.
 */
function parseAttributeValues(
  type: string,
  parseCookieValue: string | boolean | number | Date | undefined,
  chromeStoreCookieValue: string | boolean | number | Date | undefined,
  prevParsedCookieValue: string | boolean | number | Date | undefined,
  url?: string | undefined
) {
  let value =
    parseCookieValue || chromeStoreCookieValue || prevParsedCookieValue;

  if (type === 'domain' && url) {
    value = value || '.' + getDomain(url);
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
    value =
      value === 'no_restriction'
        ? 'none'
        : value === 'unspecified'
        ? ''
        : value;
  }

  if (type === 'expires') {
    value = new Date(value as string).getTime() / 1000 || 0;
  }

  return value;
}
