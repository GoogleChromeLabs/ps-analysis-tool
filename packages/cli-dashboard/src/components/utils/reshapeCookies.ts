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
import {
  UNKNOWN_FRAME_KEY,
  type CookieTableData,
  type CookieData,
  type CookieFrameStorageType,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */

const reshapeCookies = (cookies: CookieFrameStorageType) => {
  return Object.entries(cookies)
    .filter(([frame]) => frame.includes('http') || frame === UNKNOWN_FRAME_KEY)
    .map(([frame, _cookies]) => createCookieObj(frame, _cookies))
    .reduce((acc, cookieObj) => {
      Object.keys(cookieObj).forEach((key) => {
        if (acc[key]) {
          (acc[key].frameUrls as string[]).push(
            ...(cookieObj[key].frameUrls as string[])
          );
        } else {
          acc[key] = cookieObj[key];
        }
      });

      return acc;
    }, {});
};

const createCookieObj = (
  frame: string,
  cookies: {
    [cookieKey: string]: CookieData;
  }
) =>
  Object.fromEntries(
    Object.values(cookies).map((cookie) => [
      cookie.parsedCookie.name +
        cookie.parsedCookie.domain +
        cookie.parsedCookie.path,
      {
        parsedCookie: cookie.parsedCookie,
        analytics: {
          ...cookie.analytics,
          category:
            cookie.analytics?.category === 'Unknown Category'
              ? 'Uncategorized'
              : cookie.analytics?.category,
        } as CookieTableData['analytics'],
        url: cookie.url,
        headerType: 'response',
        blockedReasons: cookie.blockedReasons,
        isFirstParty: cookie.isFirstParty,
        frameIdList: [frame], // Hot fix: For Displaying cookies in CLI Dashboard.
        isBlocked: cookie.isBlocked,
        frameUrls: [frame],
      } as CookieTableData,
    ])
  );

export default reshapeCookies;
