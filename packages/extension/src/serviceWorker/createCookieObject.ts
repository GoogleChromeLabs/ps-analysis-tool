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
  calculateEffectiveExpiryDate,
  type CookieData,
  getDomainFromUrl,
} from '@ps-analysis-tool/common';
import type { Protocol } from 'devtools-protocol';
import isValidURL from './isValidURL';

/**
 * Create cookie object from ChromeStorage API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param parsedCookie Parsed cookie object from request/response.
 * @param url URL of the cookie from the request/response.
 * @param {Protocol.Network.Cookie[]} cdpCookiesList List cookies from the request.
 * @param {CookieData['headerType']} type specifies whether to derive the domain if domain is not in set-cookie.
 * @returns {Promise<Protocol.Network.Cookie[]>} Cookie object.
 */
export function createCookieObject(
  parsedCookie: CookieData['parsedCookie'],
  url: string,
  cdpCookiesList: Protocol.Network.Cookie[],
  type: CookieData['headerType']
) {
  const { name, value } = parsedCookie;

  const cdpCookie = cdpCookiesList?.find((cookie: Protocol.Network.Cookie) => {
    return cookie.name === name;
  });

  let domainToSend = parsedCookie.domain;

  if (!domainToSend && type === 'response' && isValidURL(url)) {
    domainToSend = new URL(url).hostname;
  }

  const domain = parseAttributeValues(
    'domain',
    domainToSend,
    cdpCookie?.domain,
    url
  );

  const path = parseAttributeValues('path', parsedCookie.path, cdpCookie?.path);

  const secure = parseAttributeValues(
    'secure',
    parsedCookie.secure,
    cdpCookie?.secure
  );

  const httponly = parseAttributeValues(
    'httponly',
    parsedCookie.httponly,
    cdpCookie?.httpOnly
  );

  const samesite = parseAttributeValues(
    'samesite',
    parsedCookie.samesite,
    cdpCookie?.sameSite
  );

  const expires = parseAttributeValues(
    'expires',
    parsedCookie.expires,
    (cdpCookie?.expires || 0) * 1000
  );

  const partitionKey = parseAttributeValues(
    'partitionKey',
    parsedCookie?.partitionKey,
    cdpCookie?.partitionKey
  );

  const size = parseAttributeValues(
    'size',
    parsedCookie?.size,
    cdpCookie?.size,
    '',
    name + value
  );

  const priority = parseAttributeValues(
    'priority',
    parsedCookie?.priority,
    cdpCookie?.priority
  );

  return {
    name: (name as string)?.trim(),
    value,
    domain: (domain as string)?.trim(),
    path: (path as string)?.trim(),
    secure,
    httponly,
    samesite,
    expires,
    partitionKey,
    size,
    priority,
  } as CookieData['parsedCookie'];
}

/**
 * Parse cookie attribute values from Chrome debugger API cookie object, previously saved parsed cookie object if any, and recently captured request/response cookie header.
 * @param type Cookie attribute type.
 * @param parsedCookieValue Cookie attribute value from the parsed cookie object.
 * @param cdpCookieValue Cookie attribute value from the ChromeStorage API cookie object.
 * @param url URL of the cookie from the request/response. (Only required for domain attribute)
 * @param cookieValue cookie value to calculate the size of cookie.
 * @returns {string | boolean | number} Cookie attribute value.
 */
// eslint-disable-next-line complexity
function parseAttributeValues(
  type: string,
  parsedCookieValue: string | boolean | number | Date | undefined,
  cdpCookieValue: string | boolean | number | Date | undefined,
  url?: string | undefined,
  cookieValue?: string | undefined
) {
  let value = parsedCookieValue || cdpCookieValue;

  switch (type) {
    case 'domain':
      if (url) {
        value = value || getDomainFromUrl(url);
      } else {
        value = value || '';
      }
      break;
    case 'path':
      value = value || '/';
      break;
    case 'secure':
      value = value || false;
      break;
    case 'httponly':
      value = value || false;
      break;
    case 'samesite':
      if (value === 'no_restriction') {
        value = 'none';
      } else if (value === 'unspecified') {
        value = '';
      }
      value = ((value || '') as string).toLowerCase();
      break;
    case 'size':
      if (!value) {
        const encoder = new TextEncoder();
        value = encoder.encode(cookieValue).length;
      }
      break;
    case 'expires':
      if (value !== 0) {
        value = calculateEffectiveExpiryDate(value as string) || 0;
      }
      break;
    case 'priority':
      value = value || 'Medium';
      break;
    case 'partitionKey':
      value = value || '';
      break;
    default:
      return value;
  }
  return value;
}
