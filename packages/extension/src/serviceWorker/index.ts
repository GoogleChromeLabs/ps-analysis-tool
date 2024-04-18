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
import { Protocol } from 'devtools-protocol';
import {
  type CookieDatabase,
  type CookieData,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import syncCookieStore from '../store/synchnorousCookieStore';
import createCookieFromAuditsIssue from '../utils/createCookieFromAuditsIssue';
import attachCDP from './attachCDP';
import './chromeListeners';

let cookieDB: CookieDatabase | null = null;

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfo',
  'Audits.issueAdded',
  'Network.requestWillBeSent',
  'Page.frameAttached',
  'Page.frameNavigated',
  'Target.attachedToTarget',
];

/**
 * Fires whenever debugging target issues instrumentation event.
 * @see https://developer.chrome.com/docs/extensions/reference/api/debugger
 */
chrome.debugger.onEvent.addListener((source, method, params) => {
  // eslint-disable-next-line complexity
  (async () => {
    try {
      if (!ALLOWED_EVENTS.includes(method)) {
        return;
      }

      let targets = await chrome.debugger.getTargets();
      await Promise.all(
        targets.map(async ({ id, url }) => {
          if (url.startsWith('http')) {
            await attachCDP({ targetId: id });
          }
        })
      );

      let tabId = '';
      // This is to get a list of all targets being attached to the main frame.
      if (method === 'Target.attachedToTarget' && params) {
        const {
          targetInfo: { targetId },
        } = params as Protocol.Target.AttachedToTargetEvent;
        await attachCDP({ targetId });
        return;
      }

      //If we get the tabId from source.tabId the we use it else we parse the tabsData and find the parentId in the frameIdSet and return the tabId.
      if (source?.tabId) {
        tabId = source?.tabId?.toString();
      } else if (source.targetId) {
        const tab = Object.keys(syncCookieStore?.tabs ?? {}).filter(
          (key) =>
            source.targetId &&
            syncCookieStore?.getFrameIDSet(Number(key))?.has(source.targetId)
        );
        tabId = tab[0];
      }

      // Using Page.frameAttached and Page.frameNavigated we will find the tabId using the frameId because in certain events source.tabId is missing and source.targetId is availale.
      if (method === 'Page.frameAttached' && params) {
        const { frameId, parentFrameId } =
          params as Protocol.Page.FrameAttachedEvent;

        await attachCDP({ targetId: frameId });

        if (source.tabId) {
          syncCookieStore?.updateParentChildFrameAssociation(
            source.tabId,
            frameId,
            parentFrameId
          );
          await syncCookieStore?.updateFrameIdURLSet(source.tabId, frameId);
        } else {
          await Promise.all(
            Object.keys(syncCookieStore?.tabs ?? {}).map(async (key) => {
              const currentTabFrameIdSet = syncCookieStore?.getFrameIDSet(
                Number(key)
              );

              if (
                source.targetId &&
                currentTabFrameIdSet &&
                currentTabFrameIdSet.has(source.targetId)
              ) {
                syncCookieStore?.updateParentChildFrameAssociation(
                  Number(key),
                  frameId,
                  parentFrameId
                );
                await syncCookieStore?.updateFrameIdURLSet(
                  Number(key),
                  frameId
                );
              }
              return key;
            })
          );
        }
        return;
      }

      //Some times we get frames here which we dont get in the extension, which is mostly because of frame Navigation we collect the data and send it to the extension.
      if (method === 'Page.frameNavigated' && params) {
        const {
          frame: { parentId = '', id, url: frameUrl },
        } = params as Protocol.Page.FrameNavigatedEvent;

        if (!parentId && !source.targetId) {
          return;
        }

        if (source.tabId) {
          syncCookieStore?.updateParentChildFrameAssociation(
            source.tabId,
            id,
            parentId
          );
          await syncCookieStore?.updateFrameIdURLSet(source.tabId, id);
        } else {
          Object.keys(syncCookieStore?.tabs ?? {}).forEach((key) => {
            const currentTabFrameIdSet = syncCookieStore?.getFrameIDSet(
              Number(key)
            );
            if (currentTabFrameIdSet && currentTabFrameIdSet.has(parentId)) {
              syncCookieStore?.updateParentChildFrameAssociation(
                Number(key),
                id,
                parentId
              );
              syncCookieStore?.updateFrameIdURLSet(Number(key), id, frameUrl);
            }
          });
        }
      }

      const url = syncCookieStore?.getTabUrl(Number(tabId));

      if (
        syncCookieStore.tabMode !== 'unlimited' &&
        syncCookieStore.tabToRead !== tabId
      ) {
        return;
      }

      if (!cookieDB) {
        cookieDB = await fetchDictionary();
      }

      //If we get requestWillBeSent before requestWillBeSentExtraInfo then we add the frame if to the object.
      // If we get requestWillBeSent afterwards then we will remove the add the frameId and then process the requestWillBeSentExtraInfo.
      if (method === 'Network.requestWillBeSent' && params) {
        const {
          requestId,
          request: { url: requestUrl },
          frameId = '',
        } = params as Protocol.Network.RequestWillBeSentEvent;

        let finalFrameId = frameId;

        if (!finalFrameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        if (
          setTargets.has(frameId) &&
          !syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]
        ) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId] = new Set();
          await attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
            requestUrl
          );
        } else {
          const ancestorFrameId = syncCookieStore.findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
              requestUrl
            );
            finalFrameId = ancestorFrameId;
          }
        }

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        }

        if (syncCookieStore.unParsedRequestHeaders[tabId][requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            syncCookieStore.unParsedRequestHeaders[tabId][requestId]
              .associatedCookies,
            cookieDB ?? {},
            requestUrl,
            url ?? '',
            Array.from(new Set([finalFrameId, frameId])),
            requestId
          );

          if (cookies.length === 0) {
            return;
          }

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedRequestHeaders[tabId][requestId];
        }
        return;
      }

      if (method === 'Network.requestWillBeSentExtraInfo') {
        const { associatedCookies, requestId } =
          params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

        if (associatedCookies.length === 0) {
          return;
        }

        if (syncCookieStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            associatedCookies,
            cookieDB ?? {},
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url ??
              '',
            url ?? '',
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );

          if (cookies.length === 0) {
            return;
          }

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedRequestHeaders[tabId][requestId];
        } else {
          syncCookieStore.unParsedRequestHeaders[tabId][requestId] =
            params as Protocol.Network.RequestWillBeSentExtraInfoEvent;
        }
        return;
      }

      //If we get responseReceived before responseReceivedExtraInfo then we add the frame if to the object.
      // If we get responseReceived afterwards then we will remove the add the frameId and then process the responseReceivedExtraInfo.
      //Here if we get the audits before we get the frameId then we will add the audits to auditsIssueForTab else we will process the audits and delete it from the auditsIssueForTab.
      if (method === 'Network.responseReceived' && params) {
        const {
          frameId = '',
          requestId,
          response: { url: requestUrl },
        } = params as Protocol.Network.ResponseReceivedEvent;

        let finalFrameId = frameId;

        if (!frameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        if (
          setTargets.has(finalFrameId) &&
          !syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]
        ) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId] = new Set();
          attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
            requestUrl
          );
        } else {
          const ancestorFrameId = syncCookieStore.findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
              requestUrl
            );
            finalFrameId = ancestorFrameId;
          }
        }

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              ...syncCookieStore.requestIdToCDPURLMapping[tabId][requestId],
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              ...syncCookieStore.requestIdToCDPURLMapping[tabId][requestId],
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        }

        if (syncCookieStore.unParsedResponseHeaders[tabId][requestId]) {
          const {
            headers,
            blockedCookies,
            cookiePartitionKey = '',
            exemptedCookies,
          } = syncCookieStore.unParsedResponseHeaders[tabId][requestId];

          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url ??
              '',
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );
          syncCookieStore?.update(Number(tabId), cookies);

          delete syncCookieStore.unParsedResponseHeaders[tabId][requestId];
        }
        return;
      }

      if (method === 'Network.responseReceivedExtraInfo') {
        const {
          headers,
          blockedCookies,
          requestId,
          cookiePartitionKey = '',
          exemptedCookies = [],
        } = params as Protocol.Network.ResponseReceivedExtraInfoEvent;

        // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
        if (!headers['set-cookie'] && !headers['Set-Cookie']) {
          return;
        }

        if (syncCookieStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url,
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedResponseHeaders[tabId][requestId];
        } else {
          syncCookieStore.unParsedResponseHeaders[tabId][requestId] =
            params as Protocol.Network.ResponseReceivedExtraInfoEvent;
        }
        return;
      }

      if (method === 'Audits.issueAdded' && params) {
        const auditParams = params as Protocol.Audits.IssueAddedEvent;
        const {
          code,
          details: { cookieIssueDetails },
        } = auditParams.issue;

        if (code !== 'CookieIssue' && !cookieIssueDetails) {
          return;
        }

        if (
          !cookieIssueDetails?.cookie ||
          !cookieIssueDetails?.cookieWarningReasons ||
          !cookieIssueDetails?.cookieExclusionReasons ||
          !cookieIssueDetails?.request
        ) {
          return;
        }

        const { requestId = '', url: requestUrl = '' } =
          cookieIssueDetails.request;

        if (!requestId || !requestUrl) {
          return;
        }

        const cookieObjectToUpdate = createCookieFromAuditsIssue(
          cookieIssueDetails,
          syncCookieStore?.getTabUrl(Number(tabId)) ?? '',
          [],
          syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url,
          cookieDB ?? {}
        );

        if (cookieObjectToUpdate) {
          syncCookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
        }
        return;
      }
    } catch (error) {
      //Fail silently.
    }
  })();
});
