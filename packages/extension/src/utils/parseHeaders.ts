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
 * External dependencies
 */
import { Protocol } from 'devtools-protocol';
import { type CookieData, type CookieDatabase } from '@ps-analysis-tool/common';
import parseResponseCookieHeader from '../serviceWorker/parseResponseCookieHeader';
import canProcessCookies from './canProcessCookies';
import parseRequestCookieHeader from '../serviceWorker/parseRequestCookieHeader';

type CDPCookiesType = { [cookies: string]: Protocol.Network.Cookie[] };
/**
 * Common utility function that can parse both request and response headers.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {boolean} globalIsUsingCDP Boolean to determie whether or not CDP is being used.
 * @param {string} type The type of headers that are to be processed.
 * @param {string} tabToRead The current tab being read in single tab mode.
 * @param {string} tabMode The processing mode of the extension.
 * @param {string} tabId The tabId of the current request.
 * @param {string} url Cookie URL (URL of the server which is setting/updating cookies).
 * @param {CookieDatabase} cookieDB Dictionary from open cookie database
 * @param {string} tabUrl top url of the tab from which the request originated.
 * @param {number} frameId Id of the frame the cookie is used in.
 * @param {string} requestId Request id.
 * @param {chrome.webRequest.HttpHeader} headers The headers that need to be parsed to get cookies.
 * @returns {CookieData[] | null} returns set of cookies from the header.
 */
export default async function parseHeaders(
  globalIsUsingCDP: boolean,
  type: 'request' | 'response',
  tabToRead: string,
  tabMode: 'single' | 'unlimited',
  tabId: number,
  url: string,
  cookieDB: CookieDatabase,
  tabUrl: string,
  frameId: number,
  requestId: string,
  headers?: chrome.webRequest.HttpHeader[]
) {
  if (!canProcessCookies(tabMode, tabUrl, tabToRead, tabId, headers)) {
    return null;
  }

  let cdpCookies: CDPCookiesType;

  if (globalIsUsingCDP) {
    // Since we are using CDP we might as well use it to get the proper cookies in the request this will further reduce the load of domain calculation
    cdpCookies = (await chrome.debugger.sendCommand(
      { tabId: tabId },
      'Network.getCookies',
      { urls: [url] }
    )) as CDPCookiesType;
  }

  switch (type) {
    case 'response':
      return headers?.reduce<CookieData[]>((accumulator, header) => {
        if (
          header.name.toLowerCase() === 'set-cookie' &&
          header.value &&
          tabUrl &&
          cookieDB
        ) {
          const cookie = parseResponseCookieHeader(
            url,
            header.value,
            cookieDB,
            tabUrl,
            frameId,
            cdpCookies?.cookies ?? [],
            requestId
          );

          return [...accumulator, cookie];
        }

        return accumulator;
      }, []);

    case 'request':
      return headers?.reduce<CookieData[]>((accumulator, header) => {
        if (
          header.name.toLowerCase() === 'cookie' &&
          header.value &&
          url &&
          tabUrl &&
          cookieDB
        ) {
          const cookieList = parseRequestCookieHeader(
            url,
            header.value,
            cookieDB,
            tabUrl,
            frameId,
            cdpCookies?.cookies ?? [],
            requestId
          );

          return [...accumulator, ...cookieList];
        }

        return accumulator;
      }, []);
    default:
      return [];
  }
}
