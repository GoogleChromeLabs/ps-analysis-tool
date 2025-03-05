/*
 * Copyright 2025 Google LLC
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
import Protocol from 'devtools-protocol';
/**
 * Internal dependencies
 */
import ARAStore from '../store/ARAStore';
import dataStore from '../store/dataStore';
import convertKeysToCamelCase from '../store/utils/convertKeysToCamelCase';
const readHeaderAndRegister = (
  headers: Protocol.Network.ResponseReceivedExtraInfoEvent['headers'],
  requestUrl: string,
  tabId: string
) => {
  if (!requestUrl) {
    return;
  }

  const extractHeader = (header: string) =>
    headers?.[header.toLowerCase()] ?? headers?.[header];

  const triggerRegistration = extractHeader(
    'Attribution-Reporting-Register-Trigger'
  );

  if (triggerRegistration) {
    const shouldRegisterTrigger = dataStore.sources.triggerRegistration.filter(
      (trigger) => trigger.requestUrl === requestUrl
    );

    if (shouldRegisterTrigger.length > 0) {
      return;
    }

    ARAStore.processARATriggerRegistered(
      {
        registration: {
          ...JSON.parse(triggerRegistration),
          reportingOrigin: new URL(requestUrl).origin,
          requestUrl: requestUrl,
          time: Date.now(),
        } as Protocol.Storage.AttributionReportingTriggerRegistration,
        eventLevel: '' as Protocol.Storage.AttributionReportingEventLevelResult,
        aggregatable:
          '' as Protocol.Storage.AttributionReportingAggregatableResult,
      },
      tabId
    );
  }

  const sourceRegistration = extractHeader(
    'Attribution-Reporting-Register-Source'
  );

  if (sourceRegistration) {
    const jsonSource = convertKeysToCamelCase(JSON.parse(sourceRegistration));

    const shouldRegisterSource = dataStore.sources.sourceRegistration.filter(
      (source) =>
        //@ts-ignore
        (source.eventId ?? source.sourceEventId) === jsonSource.sourceEventId
    );

    if (shouldRegisterSource.length > 0) {
      return;
    }

    ARAStore.processARASourcesRegistered({
      registration: {
        ...jsonSource,
        reportingOrigin: new URL(requestUrl).origin,
        requestUrl: requestUrl,
        sourceOrigin: dataStore.tabs[Number(tabId)].url ?? '',
        time: Date.now(),
      } as Protocol.Storage.AttributionReportingSourceRegistration,
      result:
        'success' as Protocol.Storage.AttributionReportingSourceRegistrationResult,
    });
  }
};

export default readHeaderAndRegister;
