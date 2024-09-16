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
import { I18n } from '@google-psat/i18n';
import {
  CookieFrameStorageType,
  BlockedReason,
  CookieData,
  CookieTableData,
} from '../cookies.types';
import deriveBlockingStatus from './deriveBlockingStatus';

const reshapeCookies = (cookies: CookieFrameStorageType) => {
  return Object.entries(cookies)
    .filter(([frame]) => frame.includes('http') || frame === 'unknown')
    .map(([frame, _cookies]) => createCookieObj(frame, _cookies))
    .reduce((acc, cookieObj) => {
      Object.keys(cookieObj).forEach((key) => {
        if (acc[key]) {
          const frameUrls: string[] = [
            ...(acc[key]?.frameUrls ?? []),
            ...(cookieObj[key]?.frameUrls ?? []),
          ];

          const blockedReasons: BlockedReason[] = [
            ...new Set<BlockedReason>([
              ...(acc[key]?.blockedReasons ?? []),
              ...(cookieObj[key]?.blockedReasons ?? []),
            ]),
          ];

          const frameIdList = Array.from(
            new Set<number>([
              ...((acc[key]?.frameIdList ?? []) as number[]),
              ...((cookieObj[key]?.frameIdList ?? []) as number[]),
            ])
          );

          const networkEvents: CookieData['networkEvents'] = {
            requestEvents: [
              ...(cookieObj[key]?.networkEvents?.requestEvents || []),
              ...(acc[key].networkEvents?.requestEvents || []),
            ],
            responseEvents: [
              ...(cookieObj[key]?.networkEvents?.responseEvents || []),
              ...(acc[key].networkEvents?.responseEvents || []),
            ],
          };

          let blockingStatus = deriveBlockingStatus(networkEvents);

          //@ts-ignore -- Since this has to be run for data coming from extension only.
          if (globalThis?.PSAT_EXTENSION) {
            blockingStatus = cookieObj[key].blockingStatus;
          }

          acc[key] = {
            ...cookieObj[key],
            ...acc[key],
            blockedReasons,
            frameIdList,
            exemptionReason:
              acc[key]?.exemptionReason || cookieObj[key]?.exemptionReason,
            frameUrls,
            networkEvents,
            blockingStatus,
          };
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
        ':' +
        cookie.parsedCookie.domain +
        ':' +
        cookie.parsedCookie.path,
      {
        parsedCookie: cookie.parsedCookie,
        analytics: {
          ...cookie.analytics,
          category:
            cookie.analytics?.category === 'Unknown Category'
              ? I18n.getMessage('sdUncategorized')
              : cookie.analytics?.category,
        } as CookieTableData['analytics'],
        url: cookie.url,
        headerType: 'response',
        blockedReasons: cookie.blockedReasons,
        isFirstParty: cookie.isFirstParty,
        frameIdList: [frame], // Hot fix: For Displaying cookies in CLI Dashboard.
        isBlocked: cookie.isBlocked,
        networkEvents: cookie.networkEvents,
        blockingStatus: cookie.blockingStatus,
        frameUrls: [frame],
        exemptionReason: cookie.exemptionReason,
        pageUrl: cookie.pageUrl,
      } as CookieTableData,
    ])
  );

export default reshapeCookies;
