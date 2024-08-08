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

/**
 * Internal dependencies.
 */
import syncCookieStore from '../store/synchnorousCookieStore';
import createCookieFromAuditsIssue from '../utils/createCookieFromAuditsIssue';

import './chromeListeners';
import networkTime from '../store/utils/networkTime';
import formatTime from '../store/utils/formatTime';

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfo',
  'Network.loadingFailed',
  'Storage.interestGroupAuctionEventOccurred',
  'Storage.interestGroupAuctionNetworkRequestCreated',
  'Network.loadingFinished',
  'Audits.issueAdded',
  'Network.requestWillBeSent',
  'Storage.interestGroupAccessed',
  'Page.frameAttached',
  'Page.frameNavigated',
  'Target.attachedToTarget',
];

let targets: chrome.debugger.TargetInfo[] = [];

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

      // This is done because sometimes we get tabId for which the event is emitted for.
      // In some cases we get only the targetId from which we have to ascertain the tabId from the frameTree.
      // In cases where we dont get any targetId or tabId we dont process it because these events are mostly from an extension.
      if (!source.tabId && !source.targetId) {
        return;
      }

      let tabId = '';

      targets = await chrome.debugger.getTargets();

      // This is to get a list of all targets being attached to the main frame.
      if (method === 'Target.attachedToTarget' && params) {
        const {
          targetInfo: { targetId, url },
        } = params as Protocol.Target.AttachedToTargetEvent;

        const childDebuggee = { targetId };
        chrome.debugger.attach(childDebuggee, '1.3', async () => {
          if (chrome.runtime.lastError) {
            // eslint-disable-next-line no-console
            console.warn(chrome.runtime.lastError);
          }
          try {
            await chrome.debugger.sendCommand(
              childDebuggee,
              'Storage.setInterestGroupAuctionTracking',
              { enable: true }
            );

            await chrome.debugger.sendCommand(
              childDebuggee,
              'Network.enable',
              {}
            );

            await chrome.debugger.sendCommand(
              childDebuggee,
              'Audits.enable',
              {}
            );

            await chrome.debugger.sendCommand(childDebuggee, 'Page.enable', {});

            const message = {
              id: 0,
              method: 'Runtime.runIfWaitingForDebugger',
              params: {},
            };

            await chrome.debugger.sendCommand(
              source,
              'Target.sendMessageToTarget',
              {
                message: JSON.stringify(message),
                targetId: targetId,
              }
            );
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        });

        targets = await chrome.debugger.getTargets();
        const parentFrameId = targets.filter(
          (target) => target?.tabId && target.tabId === source.tabId
        )[0]?.id;

        syncCookieStore?.addFrameToTabAndUpdateMetadata(
          source.tabId ?? null,
          source.targetId ?? null,
          targetId,
          parentFrameId ?? source.targetId,
          url
        );

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

        await syncCookieStore?.addFrameToTabAndUpdateMetadata(
          source.tabId ?? null,
          source.targetId ?? null,
          frameId,
          parentFrameId
        );
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

        await syncCookieStore?.addFrameToTabAndUpdateMetadata(
          source.tabId ?? null,
          source.targetId ?? null,
          id,
          parentId,
          frameUrl
        );
      }

      if (
        syncCookieStore.tabMode !== 'unlimited' &&
        syncCookieStore.tabToRead !== tabId
      ) {
        return;
      }

      if (method === 'Storage.interestGroupAuctionEventOccurred' && params) {
        const interestGroupAuctionEventOccured =
          params as Protocol.Storage.InterestGroupAuctionEventOccurredEvent;

        const { uniqueAuctionId } = interestGroupAuctionEventOccured;
        if (interestGroupAuctionEventOccured.type === 'started') {
          syncCookieStore.auctionDataForTabId[parseInt(tabId)][
            uniqueAuctionId
          ] = {
            auctionTime: interestGroupAuctionEventOccured.eventTime,
            auctionConfig: interestGroupAuctionEventOccured.auctionConfig,
          };
        }

        if (
          interestGroupAuctionEventOccured.type === 'configResolved' ||
          interestGroupAuctionEventOccured.type === 'started'
        ) {
          syncCookieStore.auctionDataForTabId[parseInt(tabId)][
            uniqueAuctionId
          ] = {
            ...syncCookieStore.auctionDataForTabId[parseInt(tabId)][
              uniqueAuctionId
            ],
            auctionConfig: interestGroupAuctionEventOccured.auctionConfig,
          };

          syncCookieStore.auctionEvents[parseInt(tabId)].push({
            bidCurrency: '',
            bid: 0,
            name: '',
            ownerOrigin: '',
            type: interestGroupAuctionEventOccured.type,
            formattedTime:
              syncCookieStore.auctionEvents[parseInt(tabId)].length === 0
                ? '0 ms'
                : formatTime(
                    syncCookieStore.auctionEvents[parseInt(tabId)][0].time,
                    interestGroupAuctionEventOccured.eventTime
                  ),
            time: interestGroupAuctionEventOccured.eventTime,
            auctionConfig: interestGroupAuctionEventOccured.auctionConfig,
            eventType: 'interestGroupAuctionEventOccurred',
          });
        }
        return;
      }

      if (method === 'Storage.interestGroupAccessed' && params) {
        const interestGroupAccessedParams =
          params as Protocol.Storage.InterestGroupAccessedEvent;

        syncCookieStore.auctionEvents[parseInt(tabId)].push({
          bidCurrency: interestGroupAccessedParams?.bidCurrency ?? '',
          bid: interestGroupAccessedParams?.bid ?? 0,
          name: interestGroupAccessedParams.name,
          ownerOrigin: interestGroupAccessedParams.ownerOrigin,
          formattedTime:
            syncCookieStore.auctionEvents[parseInt(tabId)].length === 0
              ? '0 ms'
              : formatTime(
                  syncCookieStore.auctionEvents[parseInt(tabId)][0].time,
                  interestGroupAccessedParams.accessTime
                ),
          type: interestGroupAccessedParams.type,
          time: interestGroupAccessedParams.accessTime,
          auctionConfig: {},
          interestGroupConfig: interestGroupAccessedParams,
          eventType: 'interestGroupAccessed',
        });
      }

      if (
        method === 'Storage.interestGroupAuctionNetworkRequestCreated' &&
        params
      ) {
        const interestGroupAuctionNetworkRequestCreatedParams =
          params as Protocol.Storage.InterestGroupAuctionNetworkRequestCreatedEvent;

        const requestId =
          interestGroupAuctionNetworkRequestCreatedParams.requestId;

        syncCookieStore.unParsedRequestHeadersForPA[tabId][requestId] = {
          auctions: interestGroupAuctionNetworkRequestCreatedParams.auctions,
          type: interestGroupAuctionNetworkRequestCreatedParams.type,
        };

        if (syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]) {
          const time: number =
            networkTime(
              requestId,
              syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                .timeStamp,
              tabId
            ) ?? new Date().getTime();

          syncCookieStore.auctionEvents[parseInt(tabId)].push({
            bidCurrency: '',
            bid: 0,
            name: '',
            ownerOrigin: '',
            formattedTime:
              syncCookieStore.auctionEvents[parseInt(tabId)].length === 0
                ? '0 ms'
                : formatTime(
                    syncCookieStore.auctionEvents[parseInt(tabId)][0].time,
                    time
                  ),
            type:
              'Start fetch ' +
              interestGroupAuctionNetworkRequestCreatedParams.type,
            time,
            auctionConfig: {},
            eventType: 'interestGroupAuctionNetworkRequestCreated',
          });
        }

        return;
      }

      //If we get requestWillBeSent before requestWillBeSentExtraInfo then we add the frame if to the object.
      // If we get requestWillBeSent afterwards then we will remove the add the frameId and then process the requestWillBeSentExtraInfo.
      if (method === 'Network.requestWillBeSent' && params) {
        const {
          requestId,
          request: { url: requestUrl },
          frameId = '',
          timestamp,
          wallTime,
        } = params as Protocol.Network.RequestWillBeSentEvent;

        let finalFrameId = frameId;

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        finalFrameId = syncCookieStore.addFrameIdAndRequestUrlToResourceMap(
          tabId,
          frameId,
          setTargets,
          requestUrl
        );

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
              timeStamp: timestamp,
              wallTime,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
              timeStamp: timestamp,
              wallTime,
            },
          };
        }

        if (syncCookieStore.unParsedRequestHeadersForPA[tabId][requestId]) {
          syncCookieStore.auctionEvents[parseInt(tabId)].push({
            bidCurrency: '',
            bid: 0,
            name: '',
            ownerOrigin: '',
            type:
              'Start fetch ' +
              syncCookieStore.unParsedRequestHeadersForPA[tabId][requestId]
                .type,
            formattedTime:
              syncCookieStore.auctionEvents[parseInt(tabId)].length === 0
                ? '0 ms'
                : formatTime(
                    syncCookieStore.auctionEvents[parseInt(tabId)][0].time,
                    networkTime(requestId, timestamp, tabId)
                  ),
            time: networkTime(requestId, timestamp, tabId),
            auctionConfig: {},
            eventType: 'interestGroupAuctionNetworkRequestCreated',
          });
        }

        if (
          syncCookieStore.tabs[Number(tabId)]?.isCookieAnalysisEnabled &&
          syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId]
        ) {
          syncCookieStore.parseRequestHeadersForCA(
            syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId],
            requestId,
            tabId,
            Array.from(new Set([finalFrameId, frameId]))
          );
        }
        return;
      }

      if (method === 'Network.loadingFinished' && params) {
        const loadingFinishedParams =
          params as Protocol.Network.LoadingFinishedEvent;

        syncCookieStore.parseRequestHeadersForPA(
          loadingFinishedParams.requestId,
          loadingFinishedParams.timestamp,
          tabId,
          'Finished Fetch'
        );
      }

      if (method === 'Network.loadingFailed' && params) {
        const loadingFailedParams =
          params as Protocol.Network.LoadingFinishedEvent;

        syncCookieStore.parseRequestHeadersForPA(
          loadingFailedParams.requestId,
          loadingFailedParams.timestamp,
          tabId,
          'Failed Fetch'
        );
      }

      if (method === 'Network.requestWillBeSentExtraInfo') {
        const { requestId } =
          params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

        if (syncCookieStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          syncCookieStore.parseRequestHeadersForCA(
            params as Protocol.Network.RequestWillBeSentExtraInfoEvent,
            requestId,
            tabId,
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            )
          );
        } else {
          syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId] =
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

        if (!finalFrameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        finalFrameId = syncCookieStore.addFrameIdAndRequestUrlToResourceMap(
          tabId,
          frameId,
          setTargets,
          requestUrl
        );

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              ...(syncCookieStore.requestIdToCDPURLMapping[tabId]?.[
                requestId
              ] ?? {}),
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              ...syncCookieStore.requestIdToCDPURLMapping[tabId][requestId],
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        }

        if (syncCookieStore.unParsedResponseHeadersForCA[tabId][requestId]) {
          syncCookieStore.parseResponseHeadersForCA(
            syncCookieStore.unParsedResponseHeadersForCA[tabId][requestId],
            requestId,
            tabId,
            Array.from(new Set([finalFrameId, frameId]))
          );
        }

        if (syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId]) {
          syncCookieStore.parseRequestHeadersForCA(
            syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId],
            requestId,
            tabId,
            Array.from(new Set([finalFrameId, frameId]))
          );
        }

        return;
      }

      if (method === 'Network.responseReceivedExtraInfo') {
        const { headers, requestId } =
          params as Protocol.Network.ResponseReceivedExtraInfoEvent;

        // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
        if (!headers['set-cookie'] && !headers['Set-Cookie']) {
          return;
        }

        if (syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]) {
          const frameIds = Array.from(
            new Set([
              syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                ?.finalFrameId,
              syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                ?.frameId,
            ])
          );

          syncCookieStore.parseResponseHeadersForCA(
            params as Protocol.Network.ResponseReceivedExtraInfoEvent,
            requestId,
            tabId,
            frameIds
          );

          if (syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId]) {
            syncCookieStore.parseRequestHeadersForCA(
              syncCookieStore.unParsedRequestHeadersForCA[tabId][requestId],
              requestId,
              tabId,
              frameIds
            );
          }
        } else {
          syncCookieStore.unParsedResponseHeadersForCA[tabId][requestId] =
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
          syncCookieStore.cookieDB ?? {}
        );

        if (cookieObjectToUpdate) {
          syncCookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
        }
        return;
      }
    } catch (error) {
      //Fail silently.
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  })();
});
