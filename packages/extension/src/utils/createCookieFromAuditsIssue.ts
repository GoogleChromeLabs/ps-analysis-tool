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
  REQUEST_EVENT,
  type CookieData,
  isFirstParty,
  findAnalyticsMatch,
  type CookieDatabase,
} from '@ps-analysis-tool/common';
import type { Protocol } from 'devtools-protocol';
import { type Cookie, parse } from 'simple-cookie';

/**
 * This function creates cookie object from the audits issue.
 * @param {Protocol.Audits.CookieIssueDetails} issue The cookieIssue Details.
 * @param {string} tabUrl The url of the tab.
 * @param {string} frameId frameId this cookie belongs to.
 * @param {string} requestUrl The url of the request this cookie belongs to.
 * @param {CookieDatabase} cookieDB CookieDatabase to find analytics match.
 * @returns {CookieData | null} The create cookie object.
 */
export default function createCookieFromAuditsIssue(
  issue: Protocol.Audits.CookieIssueDetails,
  tabUrl: string,
  frameId: string,
  requestUrl: string,
  cookieDB: CookieDatabase
) {
  const {
    cookie,
    cookieExclusionReasons,
    cookieWarningReasons,
    rawCookieLine,
    request,
  } = issue;

  if (!request) {
    return null;
  }
  const { requestId, url = '' } = request;

  if (!cookie || !rawCookieLine) {
    return null;
  }

  let generatedCookie: Protocol.Audits.AffectedCookie | Cookie | undefined =
    cookie;

  if (!cookie) {
    generatedCookie = cookie;
  }
  if (!cookie && rawCookieLine) {
    generatedCookie = parse(rawCookieLine);
  }
  const cookieObjectToUpdate: CookieData = {
    parsedCookie: {
      ...generatedCookie,
      name: generatedCookie?.name ?? '',
      priority: 'Medium',
      value: '',
    },
    warningReasons: cookieWarningReasons,
    blockedReasons: cookieExclusionReasons,
    networkEvents: {
      requestEvents: [
        {
          type: REQUEST_EVENT.CDP_REQUEST_WILL_BE_SENT_EXTRA_INFO,
          requestId,
          url,
          blocked: Boolean(cookieExclusionReasons.length),
          timeStamp: Date.now(),
        },
      ],
      responseEvents: [],
    },
    headerType: 'request',
    isFirstParty: isFirstParty(cookie?.domain, tabUrl ?? ''),
    url: url ?? requestUrl,
    frameIdList: [frameId],
    analytics:
      cookie?.name && cookieDB
        ? findAnalyticsMatch(cookie?.name, cookieDB)
        : null,
  };

  return cookieObjectToUpdate;
}
