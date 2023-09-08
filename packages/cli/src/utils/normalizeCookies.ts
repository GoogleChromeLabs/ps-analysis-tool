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
import { Protocol } from 'puppeteer';

/**
 * Internal dependencies.
 */
import getOpenCookiesDetails from './getOpenCookieDetails';
import isFirstParty from './isFirstParty';
import { CookieLogDetails } from '../types';

const normalizeCookie = (
  theCookie: Protocol.Network.Cookie,
  tabUrl: string
): CookieLogDetails | null => {
  const cookieName: any = 'name' in theCookie ? theCookie.name : '';

  if (!cookieName) {
    return null;
  }

  const openCookiesData: { [key: string]: any } = getOpenCookiesDetails();
  let cookieDetail: { [key: string]: any } =
    cookieName in openCookiesData ? openCookiesData[cookieName] : null;

  if (!cookieDetail) {
    cookieDetail = {
      platform: 'Unknown Platform',
      category: 'Unknown Category',
      description: '-',
    };
  }

  return {
    name: theCookie.name,
    value: theCookie.value,
    domain: theCookie.domain,
    path: theCookie.path,
    expires: theCookie.expires,
    httpOnly: theCookie.httpOnly,
    secure: theCookie.secure,
    sameSite: theCookie.sameSite || 'Lax',
    platform: cookieDetail.platform,
    category: cookieDetail.category,
    description: cookieDetail.description,
    isFirstParty: isFirstParty(theCookie.domain, tabUrl) ? 'Yes' : 'No',
    pageUrl: tabUrl,
  };
};

export default normalizeCookie;
