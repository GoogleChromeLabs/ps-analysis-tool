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
import { parse } from 'simple-cookie';
/**
 * Internal dependencies
 */
import type {
  NetworkResponseReceivedExtraInfo,
  BlockedResponseCookieWithReason,
} from '../cdp.types';
import findAnalyticsMatch from './findAnalyticsMatch';
import { CookieDatabase } from '../cookies.types';

/**
 *
 * @param {object} response Response to be parsed to get extra information about a cookie.
 * @param {object} cookieDB Cookie database to find analytics from.
 * @returns {object} parsed cookies.
 */
export default function parseResponseReceivedExtraInfo(
  response: NetworkResponseReceivedExtraInfo,
  cookieDB?: CookieDatabase
) {
  return response.headers['set-cookie']
    ?.split('\n')
    .map((headerLine: string) => {
      const parsedCookie = parse(headerLine);
      const blockedCookie = response.blockedCookies.find(
        (c: BlockedResponseCookieWithReason) => {
          return c.cookie?.name === parsedCookie.name;
        }
      );

      return {
        isBlocked: blockedCookie ? true : false,
        blockedReasons: blockedCookie ? blockedCookie?.blockedReasons : [],
        parsedCookie: {
          ...parsedCookie,
          expires: parsedCookie.expires
            ? String(new Date(parsedCookie.expires).toISOString())
            : 'Session',
        },
        partitionKey: response?.cookiePartitionKey,
        analytics: cookieDB
          ? findAnalyticsMatch(parsedCookie.name, cookieDB)
          : null,
        url: response.headers['url'],
        headerType: 'response',
        frameIdList: [0],
      };
    });
}
