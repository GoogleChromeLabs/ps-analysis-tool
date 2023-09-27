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

import {
  CookieLogDetails,
  Cookie,
  Cookies,
  CookieLogDetailList,
  CookiesObjects,
} from '../../types';
import getOpenCookiesDetails from '../getOpenCookieDetails';
import { isFirstParty } from '@cookie-analysis-tool/common';
import Utility from '../utility';

export default class CookiesManagement {
  /**
   * Get unique cookies from list of cookies.
   * @param cookies List of cookies.
   * @returns List of unique cookies.
   */
  public static getUnique(
    cookies: Array<CookieLogDetails>
  ): Array<CookieLogDetails> {
    // @ts-ignore
    return Object.values(CookiesManagement.getUniqueObject(cookies));
  }

  public static getCookieKey(cookie: { [key: string]: any }): string {
    const regex = /^([.]*)/ms;
    const domain = cookie.domain.replace(regex, '');

    return `${domain}:${cookie.name}:${cookie.path}`;
  }

  public static getUniqueObject(
    cookies: Cookies | Array<CookieLogDetails>
  ): CookiesObjects {
    const uniqueCookies: CookiesObjects = {};

    cookies.forEach((cookie: Cookie | CookieLogDetails) => {
      const key: string = CookiesManagement.getCookieKey(cookie);
      // @ts-ignore
      uniqueCookies[key] = cookie;
    });

    // @ts-ignore
    return <CookiesObjects>Utility.sortObjectByKey(uniqueCookies);
  }

  public static getDiff(cookiesA: Cookies, cookiesB: Cookies) {
    const uniqueCookiesA = this.getUniqueObject(cookiesA);
    const uniqueCookiesB = this.getUniqueObject(cookiesB);

    const cookiesKeysA = Object.keys(uniqueCookiesA);
    const cookiesKeysB = Object.keys(uniqueCookiesB);

    const intersectedKeys = cookiesKeysA.filter((keyA) => {
      return cookiesKeysB.includes(keyA);
    });

    const onlyAvailableInAKeys = cookiesKeysA.filter((key) => {
      return -1 === intersectedKeys.indexOf(key);
    });

    const onlyAvailableInBKeys = cookiesKeysB.filter((key) => {
      return -1 === intersectedKeys.indexOf(key);
    });

    const onlyAvailableInA: Cookies = [];
    const onlyAvailableInB: Cookies = [];

    for (const key of onlyAvailableInAKeys) {
      const cookie = uniqueCookiesA[key as keyof object];
      onlyAvailableInA.push(cookie);
    }

    for (const key of onlyAvailableInBKeys) {
      const cookie = uniqueCookiesB[key as keyof object];
      onlyAvailableInB.push(cookie);
    }

    return {
      availableInFirst: onlyAvailableInA,
      availableInSecond: onlyAvailableInB,
    };
  }

  /**
   * Normalize list of cookie.
   * @param {object} cookies List of cookies object.
   * @param {string} theUrl  Site URL.
   * @returns Normalized list of cookie detail.
   */
  public static normalizeCookies(
    cookies: Cookies | Array<CookieLogDetails>,
    theUrl: string
  ): CookieLogDetailList {
    const cookiesDetails: CookieLogDetailList = [];

    if (cookies) {
      cookies.forEach((theCookie) => {
        const cookie: CookieLogDetails | null =
          CookiesManagement.normalizeCookie(theCookie, theUrl);

        if (cookie) {
          cookiesDetails.push(cookie);
        }
      });
    }

    return cookiesDetails;
  }

  /**
   * Normalize cookies.
   * @param {object} theCookie Cookie object.
   * @param {string} theUrl    Site URL.
   * @returns Normalized cookie detail on success otherwise null.
   */
  public static normalizeCookie(
    theCookie: { [key: string]: any },
    theUrl: string
  ): CookieLogDetails | null {
    const cookieName: string = 'name' in theCookie ? theCookie.name : '';

    if (!cookieName) {
      return null;
    }

    const openCookiesData: object = getOpenCookiesDetails();
    let cookieDetail: { [key: string]: string } | null =
      cookieName in openCookiesData
        ? openCookiesData[cookieName as keyof object]
        : null;

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
      httpOnly: theCookie.httpOnly ?? theCookie.httponly,
      secure: theCookie.secure,
      sameSite: theCookie.sameSite ?? (theCookie.samesite || 'Lax'),
      platform: cookieDetail.platform,
      category: cookieDetail.category,
      description: cookieDetail.description,
      isFirstParty: isFirstParty(theCookie.domain, theUrl) ? 'Yes' : 'No',
      pageUrl: theCookie.pageUrl,
      frameUrl: theCookie.frameUrl,
      isBlocked: theCookie.isBlocked,
      blockedReasons: theCookie.blockedReasons,
    };
  }
}
