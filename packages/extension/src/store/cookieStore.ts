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
  getCookieKey,
  type CookieData,
  type BlockedReason,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
  deriveBlockingStatus,
} from '@google-psat/common';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import updateCookieBadgeText from './utils/updateCookieBadgeText';
import dataStore from './dataStore';

class CookieStore {
  /**
   * This function parses response headers for Cookie Analysis.
   * @param {Protocol.Network.ResponseReceivedExtraInfoEvent} response The response to be parsed.
   * @param {string} requestId This is used to get the related data for parsing the response.
   * @param {string} tabId The tabId this request is associated to.
   * @param {string[]} frameIds This is used to associate the cookies from request to set of frameIds.
   */
  parseResponseHeadersForCA(
    response: Protocol.Network.ResponseReceivedExtraInfoEvent,
    requestId: string,
    tabId: string,
    frameIds: string[]
  ) {
    const { headers, blockedCookies, cookiePartitionKey, exemptedCookies } =
      response;

    const cookies: CookieData[] = parseResponseReceivedExtraInfo(
      headers,
      blockedCookies,
      exemptedCookies,
      cookiePartitionKey,
      dataStore.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      dataStore.tabs[Number(tabId)].url ?? '',
      dataStore.cookieDB ?? {},
      frameIds,
      requestId
    );
    this.update(Number(tabId), cookies);

    delete dataStore.unParsedResponseHeadersForCA[tabId][requestId];
  }

  /**
   * This function parses request headers for Cookie Analysis.
   * @param {Protocol.Network.RequestWillBeSentExtraInfoEvent} request The response to be parsed.
   * @param {string} requestId This is used to get the related data for parsing the response.
   * @param {string} tabId The tabId this request is associated to.
   * @param {string[]} frameIds This is used to associate the cookies from request to set of frameIds.
   */
  parseRequestHeadersForCA(
    request: Protocol.Network.RequestWillBeSentExtraInfoEvent,
    requestId: string,
    tabId: string,
    frameIds: string[]
  ) {
    const { associatedCookies } = request;

    const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
      associatedCookies,
      dataStore.cookieDB ?? {},
      dataStore.requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
      dataStore.tabs[Number(tabId)].url ?? '',
      frameIds,
      requestId
    );

    delete dataStore.unParsedRequestHeadersForCA[tabId][requestId];
    if (cookies.length === 0) {
      return;
    }

    this.update(Number(tabId), cookies);
    delete dataStore.unParsedRequestHeadersForCA[tabId][requestId];
  }

  /**
   * Adds exclusion and warning reasons for a given cookie.
   * @param {string} cookieName Name of the cookie.
   * @param {string[]} exclusionReasons reasons to be added to the blocked reason array.
   * @param {string[]} warningReasons warning reasons to be added to the warning reason array.
   * @param {number} tabId tabId where change has to be made.
   */
  addCookieExclusionWarningReason(
    cookieName: string,
    exclusionReasons: BlockedReason[],
    warningReasons: Protocol.Audits.CookieWarningReason[],
    tabId: number
  ) {
    if (!dataStore.tabsData[tabId]) {
      return;
    }
    if (dataStore.tabsData[tabId] && dataStore.tabsData[tabId][cookieName]) {
      dataStore.tabsData[tabId][cookieName].blockedReasons = [
        ...new Set([
          ...(dataStore.tabsData[tabId][cookieName].blockedReasons ?? []),
          ...exclusionReasons,
        ]),
      ];
      dataStore.tabsData[tabId][cookieName].warningReasons = [
        ...new Set([
          ...(dataStore.tabsData[tabId][cookieName].warningReasons ?? []),
          ...warningReasons,
        ]),
      ];

      dataStore.tabsData[tabId][cookieName].isBlocked =
        exclusionReasons.length > 0 ? true : false;
      dataStore.tabs[tabId].newUpdates++;
    } else {
      dataStore.tabs[tabId].newUpdates++;
      // If none of them exists. This case is possible when the cookies hasnt processed and we already have an issue.
      dataStore.tabsData[tabId] = {
        ...dataStore.tabsData[tabId],
        [cookieName]: {
          ...(dataStore.tabsData[tabId][cookieName] ?? {}),
          blockedReasons: [...exclusionReasons],
          warningReasons: [...warningReasons],
          isBlocked: exclusionReasons.length > 0 ? true : false,
        },
      };
    }
  }

  /**
   * Update cookie store.
   * @param {number} tabId Tab id.
   * @param {Array} cookies Cookies data.
   */
  // eslint-disable-next-line complexity
  update(tabId: number, cookies: CookieData[]) {
    try {
      if (!dataStore.tabsData[tabId] || !dataStore.tabs[tabId]) {
        return;
      }

      for (const cookie of cookies) {
        const cookieKey = getCookieKey(cookie.parsedCookie);
        if (!cookieKey) {
          continue;
        }

        // Merge in previous blocked reasons.
        const blockedReasons: BlockedReason[] = [
          ...new Set<BlockedReason>([
            ...(cookie?.blockedReasons ?? []),
            ...(dataStore.tabsData[tabId]?.[cookieKey]?.blockedReasons ?? []),
          ]),
        ];

        const warningReasons = Array.from(
          new Set<Protocol.Audits.CookieWarningReason>([
            ...(cookie?.warningReasons ?? []),
            ...(dataStore.tabsData[tabId]?.[cookieKey]?.warningReasons ?? []),
          ])
        );

        const frameIdList = Array.from(
          new Set<number>([
            ...((cookie?.frameIdList ?? []) as number[]),
            ...((dataStore.tabsData[tabId]?.[cookieKey]?.frameIdList ??
              []) as number[]),
          ])
        ).map((frameId) => frameId.toString());

        if (dataStore.tabsData[tabId]?.[cookieKey]) {
          dataStore.tabs[tabId].newUpdates++;
          // Merge in previous warning reasons.
          const parsedCookie = {
            ...dataStore.tabsData[tabId][cookieKey].parsedCookie,
            ...cookie.parsedCookie,
            samesite: (
              cookie.parsedCookie.samesite ??
              dataStore.tabsData[tabId][cookieKey].parsedCookie.samesite ??
              'lax'
            ).toLowerCase(),
            httponly:
              cookie.parsedCookie.httponly ??
              dataStore.tabsData[tabId][cookieKey].parsedCookie.httponly,
            priority:
              cookie.parsedCookie?.priority ??
              dataStore.tabsData[tabId][cookieKey].parsedCookie?.priority ??
              'Medium',
            partitionKey: '',
          };
          if (
            cookie.parsedCookie?.partitionKey ||
            dataStore.tabsData[tabId][cookieKey].parsedCookie?.partitionKey
          ) {
            parsedCookie.partitionKey =
              cookie.parsedCookie?.partitionKey ||
              dataStore.tabsData[tabId][cookieKey].parsedCookie?.partitionKey;
          }

          const networkEvents: CookieData['networkEvents'] = {
            requestEvents: [
              ...(dataStore.tabsData[tabId][cookieKey]?.networkEvents
                ?.requestEvents || []),
              ...(cookie.networkEvents?.requestEvents || []),
            ],
            responseEvents: [
              ...(dataStore.tabsData[tabId][cookieKey]?.networkEvents
                ?.responseEvents || []),
              ...(cookie.networkEvents?.responseEvents || []),
            ],
          };
          dataStore.tabsData[tabId][cookieKey] = {
            ...dataStore.tabsData[tabId][cookieKey],
            ...cookie,
            parsedCookie,
            isBlocked: blockedReasons.length > 0,
            blockedReasons,
            networkEvents,
            blockingStatus: deriveBlockingStatus(networkEvents),
            warningReasons,
            url: dataStore.tabsData[tabId][cookieKey].url ?? cookie.url,
            headerType:
              dataStore.tabsData[tabId][cookieKey].headerType === 'javascript'
                ? dataStore.tabsData[tabId][cookieKey].headerType
                : cookie.headerType,
            frameIdList,
            exemptionReason:
              cookie?.exemptionReason ||
              dataStore.tabsData[tabId][cookieKey]?.exemptionReason,
          };
        } else {
          dataStore.tabs[tabId].newUpdates++;
          dataStore.tabsData[tabId][cookieKey] = {
            ...cookie,
            blockingStatus: deriveBlockingStatus(cookie.networkEvents),
          };
        }
      }

      updateCookieBadgeText(dataStore.tabsData[tabId], tabId);
    } catch (error) {
      //Fail silently
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }
}

export default new CookieStore();
