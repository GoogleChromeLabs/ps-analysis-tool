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
import createCookieFromAuditsIssue from '../utils/createCookieFromAuditsIssue';
import './chromeListeners';
import dataStore from '../store/dataStore';
import cookieStore from '../store/cookieStore';
import PAStore from '../store/PAStore';
import ARAStore from '../store/ARAStore';
import attachCDP from './attachCDP';
import readHeaderAndRegister from './readHeaderAndRegister';

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
  'Storage.attributionReportingSourceRegistered',
  'Storage.attributionReportingTriggerRegistered',
];
const attachedSet = new Set<string>();
let targets: chrome.debugger.TargetInfo[] = [];

/**
 * Extracts the value of a specific HTTP header from the request or response.
 * @param header The name of the header to extract.
 * @param headers The request or response information.
 * @returns The value of the specified header.
 */
const extractHeader = (header: string, headers: Protocol.Network.Headers) =>
  headers?.[header.toLowerCase()] ?? headers?.[header];

const calculateTabId = (source: chrome.debugger.Debuggee) => {
  if (source.tabId) {
    return source.tabId.toString();
  }

  let tabId = '';
  const tab = Object.keys(dataStore?.tabs ?? {}).filter(
    (key) =>
      source.targetId &&
      dataStore?.getFrameIDSet(Number(key))?.has(source.targetId)
  );
  tabId = tab[0];
  return tabId;
};

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

      targets.forEach((target) => {
        if (
          !target.url.startsWith('devtools://') &&
          !target.url.startsWith('chrome://') &&
          !attachedSet.has(target.id)
        ) {
          attachCDP({ targetId: target.id });
          attachedSet.add(target.id);
        }
      });

      // This is to get a list of all targets being attached to the main frame.
      if (method === 'Target.attachedToTarget' && params) {
        const {
          targetInfo: { targetId, url },
        } = params as Protocol.Target.AttachedToTargetEvent;

        const childDebuggee = { targetId };

        if (!attachedSet.has(targetId)) {
          attachCDP(childDebuggee, true);
          attachedSet.add(targetId);
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
        }

        targets = await chrome.debugger.getTargets();
        const parentFrameId = targets.filter(
          (target) => target?.tabId && target.tabId === source.tabId
        )[0]?.id;

        dataStore?.addFrameToTabAndUpdateMetadata(
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
        tabId = calculateTabId(source);
      }
      // Using Page.frameAttached and Page.frameNavigated we will find the tabId using the frameId because in certain events source.tabId is missing and source.targetId is availale.
      if (method === 'Page.frameAttached' && params) {
        const { frameId, parentFrameId } =
          params as Protocol.Page.FrameAttachedEvent;

        await dataStore?.addFrameToTabAndUpdateMetadata(
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

        await dataStore?.addFrameToTabAndUpdateMetadata(
          source.tabId ?? null,
          source.targetId ?? null,
          id,
          parentId,
          frameUrl
        );
      }

      if (dataStore.tabMode !== 'unlimited' && dataStore.tabToRead !== tabId) {
        return;
      }

      if (method === 'Storage.interestGroupAuctionEventOccurred' && params) {
        const interestGroupAuctionEventOccured =
          params as Protocol.Storage.InterestGroupAuctionEventOccurredEvent;

        const { uniqueAuctionId, eventTime, auctionConfig, parentAuctionId } =
          interestGroupAuctionEventOccured;

        dataStore.auctionDataForTabId[tabId][uniqueAuctionId] = {
          ...(dataStore.auctionDataForTabId[tabId]?.[uniqueAuctionId] ?? {}),
          auctionConfig,
          parentAuctionId,
          auctionTime: eventTime,
        };

        PAStore.processInterestGroupAuctionEventOccurred(
          interestGroupAuctionEventOccured,
          tabId
        );

        return;
      }

      if (
        method === 'Storage.interestGroupAccessed' &&
        params &&
        source.tabId
      ) {
        const interestGroupAccessedParams =
          params as Protocol.Storage.InterestGroupAccessedEvent;

        PAStore.processInterestGroupEvent(interestGroupAccessedParams, tabId);
      }

      if (
        method === 'Storage.interestGroupAuctionNetworkRequestCreated' &&
        params
      ) {
        const interestGroupAuctionNetworkRequestCreatedParams =
          params as Protocol.Storage.InterestGroupAuctionNetworkRequestCreatedEvent;

        const { auctions, type, requestId } =
          interestGroupAuctionNetworkRequestCreatedParams;

        dataStore.unParsedRequestHeadersForPA[tabId][requestId] = {
          auctions,
          type,
        };

        if (dataStore.requestIdToCDPURLMapping[tabId][requestId]) {
          PAStore.processStartFetchEvents(auctions, tabId, requestId, type);
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

        finalFrameId = dataStore.addFrameIdAndRequestUrlToResourceMap(
          tabId,
          frameId,
          setTargets,
          requestUrl
        );

        if (!dataStore.requestIdToCDPURLMapping[tabId]) {
          dataStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
              timeStamp: timestamp,
              wallTime,
            },
          };
        } else {
          dataStore.requestIdToCDPURLMapping[tabId] = {
            ...dataStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
              timeStamp: timestamp,
              wallTime,
            },
          };
        }

        if (dataStore.unParsedRequestHeadersForPA[tabId][requestId]) {
          const { auctions, type } =
            dataStore.unParsedRequestHeadersForPA[tabId][requestId];

          PAStore.processStartFetchEvents(auctions, tabId, requestId, type);
        }
        //@todo When cookie analysis is decoupled move this to a separate function.
        if (
          dataStore.tabs[Number(tabId)]?.isCookieAnalysisEnabled &&
          dataStore.unParsedRequestHeadersForCA[tabId][requestId]
        ) {
          if (
            extractHeader(
              'Attribution-Reporting-Eligible',
              dataStore.unParsedRequestHeadersForCA[tabId][requestId].headers
            )
          ) {
            if (dataStore.headersForARA?.[tabId]?.[requestId]) {
              readHeaderAndRegister(
                dataStore.headersForARA?.[tabId]?.[requestId].headers,
                requestUrl,
                tabId
              );
            } else {
              dataStore.headersForARA[tabId] = {
                ...dataStore.headersForARA[tabId],
                [requestId]: {
                  headers: {},
                  url: requestUrl,
                },
              };
            }
          }
          cookieStore.parseRequestHeadersForCA(
            dataStore.unParsedRequestHeadersForCA[tabId][requestId],
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

        PAStore.parseRequestHeadersForPA(
          loadingFinishedParams.requestId,
          loadingFinishedParams.timestamp,
          tabId,
          'Finished Fetch'
        );
      }

      if (method === 'Network.loadingFailed' && params) {
        const loadingFailedParams =
          params as Protocol.Network.LoadingFinishedEvent;

        PAStore.parseRequestHeadersForPA(
          loadingFailedParams.requestId,
          loadingFailedParams.timestamp,
          tabId,
          'Failed Fetch'
        );
      }

      if (method === 'Network.requestWillBeSentExtraInfo') {
        const { requestId, headers } =
          params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

        if (dataStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          if (extractHeader('Attribution-Reporting-Eligible', headers)) {
            if (dataStore.headersForARA?.[tabId]?.[requestId]) {
              readHeaderAndRegister(
                headers,
                dataStore.requestIdToCDPURLMapping[tabId]?.[requestId]?.url,
                tabId
              );
            } else {
              dataStore.headersForARA[tabId] = {
                ...dataStore.headersForARA[tabId],
                [requestId]: {
                  headers: {},
                  url: dataStore.requestIdToCDPURLMapping[tabId]?.[requestId]
                    ?.url,
                },
              };
            }
          }

          cookieStore.parseRequestHeadersForCA(
            params as Protocol.Network.RequestWillBeSentExtraInfoEvent,
            requestId,
            tabId,
            Array.from(
              new Set([
                dataStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                dataStore.requestIdToCDPURLMapping[tabId][requestId]?.frameId,
              ])
            )
          );
        } else {
          dataStore.unParsedRequestHeadersForCA[tabId][requestId] =
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
          response: { url: requestUrl, headers },
        } = params as Protocol.Network.ResponseReceivedEvent;

        let finalFrameId = frameId;

        if (
          extractHeader('Attribution-Reporting-Register-Trigger', headers) ||
          extractHeader('Attribution-Reporting-Register-Source', headers)
        ) {
          readHeaderAndRegister(headers, requestUrl, tabId);
        }

        if (!finalFrameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        finalFrameId = dataStore.addFrameIdAndRequestUrlToResourceMap(
          tabId,
          frameId,
          setTargets,
          requestUrl
        );

        if (!dataStore.requestIdToCDPURLMapping[tabId]) {
          dataStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              ...(dataStore.requestIdToCDPURLMapping[tabId]?.[requestId] ?? {}),
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        } else {
          dataStore.requestIdToCDPURLMapping[tabId] = {
            ...dataStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              ...dataStore.requestIdToCDPURLMapping[tabId][requestId],
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        }

        if (dataStore.unParsedResponseHeadersForCA[tabId][requestId]) {
          cookieStore.parseResponseHeadersForCA(
            dataStore.unParsedResponseHeadersForCA[tabId][requestId],
            requestId,
            tabId,
            Array.from(new Set([finalFrameId, frameId]))
          );
        }

        if (dataStore.unParsedRequestHeadersForCA[tabId][requestId]) {
          cookieStore.parseRequestHeadersForCA(
            dataStore.unParsedRequestHeadersForCA[tabId][requestId],
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
        if (
          extractHeader('Attribution-Reporting-Register-Trigger', headers) ||
          extractHeader('Attribution-Reporting-Register-Source', headers)
        ) {
          //sometimes this fires early and we still havent calculated tabId for this.
          tabId = calculateTabId(source);

          if (dataStore.headersForARA?.[tabId]?.[requestId]) {
            readHeaderAndRegister(
              headers,
              dataStore.headersForARA?.[tabId]?.[requestId]?.url,
              tabId
            );
          } else {
            dataStore.headersForARA[tabId] = {
              ...dataStore.headersForARA[tabId],
              [requestId]: {
                headers,
                url: '',
              },
            };
          }
        }

        // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
        if (!headers['set-cookie'] && !headers['Set-Cookie']) {
          return;
        }

        if (dataStore.requestIdToCDPURLMapping[tabId][requestId]) {
          const frameIds = Array.from(
            new Set([
              dataStore.requestIdToCDPURLMapping[tabId][requestId]
                ?.finalFrameId,
              dataStore.requestIdToCDPURLMapping[tabId][requestId]?.frameId,
            ])
          );

          cookieStore.parseResponseHeadersForCA(
            params as Protocol.Network.ResponseReceivedExtraInfoEvent,
            requestId,
            tabId,
            frameIds
          );

          if (dataStore.unParsedRequestHeadersForCA[tabId][requestId]) {
            cookieStore.parseRequestHeadersForCA(
              dataStore.unParsedRequestHeadersForCA[tabId][requestId],
              requestId,
              tabId,
              frameIds
            );
          }
        } else {
          dataStore.unParsedResponseHeadersForCA[tabId][requestId] =
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
          dataStore?.getTabUrl(Number(tabId)) ?? '',
          [],
          dataStore.requestIdToCDPURLMapping[tabId][requestId]?.url,
          dataStore.cookieDB ?? {}
        );

        if (cookieObjectToUpdate) {
          cookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
        }
        return;
      }

      if (
        method === 'Storage.attributionReportingSourceRegistered' &&
        params &&
        source.tabId
      ) {
        const { registration, result } =
          params as Protocol.Storage.AttributionReportingSourceRegisteredEvent;
        dataStore.sources.sourceRegistration =
          dataStore.sources.sourceRegistration.map((singleSource) => {
            //@ts-ignore
            if (singleSource?.sourceEventId === registration.eventId) {
              const time = registration.time.toString().includes('.')
                ? registration.time * 1000
                : registration.time;

              const combinedData = {
                ...singleSource,
                ...registration,
                time,
                expiry: registration.expiry * 1000 + time,
                result,
                tabId: tabId ?? singleSource.tabId,
              };
              //@ts-ignore
              delete combinedData.sourceEventId;
              //@ts-ignore
              delete combinedData.destination;
              return combinedData;
            }
            return singleSource;
          });
      }

      if (
        method === 'Storage.attributionReportingTriggerRegistered' &&
        params
      ) {
        const { registration, eventLevel, aggregatable } =
          params as Protocol.Storage.AttributionReportingTriggerRegisteredEvent;

        dataStore.sources.triggerRegistration.forEach((trigger, index) => {
          if (tabId !== trigger.tabId) {
            return;
          }
          const registrationKeys = new Set<string>();
          Object.keys(registration).forEach((key) => registrationKeys.add(key));

          const triggerKeys = new Set<string>();
          Object.keys(trigger).forEach((key) => triggerKeys.add(key));
          let match = false;

          if (
            registrationKeys
              .intersection(triggerKeys)
              .has('aggregatableTriggerData') &&
            !match &&
            registration['aggregatableTriggerData'].length > 0
          ) {
            match = ARAStore.matchTriggerData(
              registration,
              trigger,
              'aggregatableTriggerData'
            );
          } else if (
            registrationKeys
              .intersection(triggerKeys)
              .has('aggregatableValues') &&
            !match &&
            Object.prototype.hasOwnProperty.call(
              registration['aggregatableValues'],
              'values'
            )
          ) {
            match = ARAStore.matchTriggerData(
              registration,
              trigger,
              'aggregatableValues'
            );
          } else if (
            registrationKeys
              .intersection(triggerKeys)
              .has('eventTriggerData') &&
            !match
          ) {
            match = ARAStore.matchTriggerData(
              registration,
              trigger,
              'eventTriggerData'
            );
          }

          if (match && !trigger?.aggregatable && !trigger?.eventLevel) {
            dataStore.sources.triggerRegistration[index] = {
              ...trigger,
              eventLevel,
              aggregatable,
              ...registration,
              tabId: tabId ?? trigger.tabId,
            };
          }
        });
      }
    } catch (error) {
      //Fail silently.
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  })();
});
