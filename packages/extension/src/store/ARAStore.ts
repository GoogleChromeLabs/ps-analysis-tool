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
import dataStore from './dataStore';
import convertKeysToCamelCase from './utils/convertKeysToCamelCase';

class ARAStore {
  processARASourcesRegistered(
    params: Protocol.Storage.AttributionReportingSourceRegisteredEvent,
    tabId: string
  ) {
    const sourceRegistrationData = convertKeysToCamelCase(
      params.registration
    ) as Protocol.Storage.AttributionReportingSourceRegistration;

    if (dataStore.sources?.[tabId]?.['sourceRegistration']?.length > 0) {
      dataStore.sources[tabId].sourceRegistration.push({
        ...sourceRegistrationData,
        type: this.parseTypeOfAttribution(sourceRegistrationData?.eventType),
        result: params.result,
        index: dataStore.sources[tabId].sourceRegistration.length,
      });
    } else {
      dataStore.sources[tabId].sourceRegistration = [
        {
          ...sourceRegistrationData,
          result: params.result,
          index: 0,
        },
      ];
    }
    dataStore.tabs[Number(tabId)].newUpdatesARA++;
  }

  processARATriggerRegistered(
    params: Protocol.Storage.AttributionReportingTriggerRegisteredEvent,
    tabId: string
  ) {
    const triggerRegistrationData = this.addNecessaryFields(
      convertKeysToCamelCase(
        params.registration
      ) as Protocol.Storage.AttributionReportingTriggerRegistration
    );

    if (dataStore.sources?.[tabId]?.triggerRegistration?.length > 0) {
      dataStore.sources[tabId].triggerRegistration.push({
        ...triggerRegistrationData,
        aggregatable: params.aggregatable,
        eventLevel: params.eventLevel,
        index: dataStore.sources[tabId].triggerRegistration.length,
        time: Date.now(),
        destination: new URL(dataStore.tabs[Number(tabId)].url).origin ?? '',
      });
    } else {
      dataStore.sources[tabId].triggerRegistration = [
        {
          ...triggerRegistrationData,
          aggregatable: params.aggregatable,
          eventLevel: params.eventLevel,
          index: 0,
          time: Date.now(),
          destination: new URL(dataStore.tabs[Number(tabId)].url).origin ?? '',
        },
      ];
    }
    dataStore.tabs[Number(tabId)].newUpdatesARA++;
  }

  addNecessaryFields(
    triggerRegistrationData: Protocol.Storage.AttributionReportingTriggerRegistration
  ): Protocol.Storage.AttributionReportingTriggerRegistration {
    const reformedData = triggerRegistrationData;
    if (!triggerRegistrationData) {
      return reformedData;
    }
    if (!reformedData?.aggregatableDebugReportingConfig) {
      reformedData.aggregatableDebugReportingConfig = {
        keyPiece: '0X0',
        debugData: [],
      };
      reformedData.debugReporting = false;
    }
    if (!reformedData?.aggregatableFilteringIdMaxBytes) {
      reformedData.aggregatableFilteringIdMaxBytes = 1;
    }

    if (!reformedData?.aggregatableFilteringIdMaxBytes) {
      reformedData.aggregatableFilteringIdMaxBytes = 1;
    }

    return reformedData;
  }

  parseTypeOfAttribution(
    headerLine: string
  ): Protocol.Storage.AttributionReportingSourceType {
    if (new RegExp('\\event-source\\b', 'i').test(headerLine)) {
      return 'event';
    }
    if (new RegExp('\\navigation-source\\b', 'i').test(headerLine)) {
      return 'navigation';
    }
    return 'event';
  }
}

export default new ARAStore();
