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
import isEqual from 'lodash-es/isEqual';

/**
 * Internal dependencies
 */
import dataStore from './dataStore';
import convertKeysToCamelCase from './utils/convertKeysToCamelCase';
import transformNestedObject from './utils/transformObject';

/**
 * Class responsible for managing Attribution Reporting API (ARA) data storage and processing.
 */
class ARAStore {
  /**
   * Processes the Attribution Reporting Source Registered event.
   * @param {Protocol.Storage.AttributionReportingSourceRegisteredEvent} params - The event parameters.
   */
  processARASourcesRegistered(
    params: Protocol.Storage.AttributionReportingSourceRegisteredEvent
  ) {
    const sourceRegistrationData = convertKeysToCamelCase(
      params.registration
    ) as Protocol.Storage.AttributionReportingSourceRegistration;

    if (dataStore.sources?.sourceRegistration?.length > 0) {
      dataStore.sources.sourceRegistration.push({
        requestUrl: '',
        ...sourceRegistrationData,
        result: params.result,
        index: dataStore.sources.sourceRegistration.length,
      });
    } else {
      dataStore.sources.sourceRegistration = [
        {
          requestUrl: '',
          ...sourceRegistrationData,
          result: params.result,
          index: 0,
        },
      ];
    }

    dataStore.newUpdatesARA++;
  }

  /**
   * Processes the Attribution Reporting Trigger Registered event.
   * @param {Protocol.Storage.AttributionReportingTriggerRegisteredEvent} params - The event parameters.
   * @param {string} tabId - The ID of the tab where the event occurred.
   */
  processARATriggerRegistered(
    params: Protocol.Storage.AttributionReportingTriggerRegisteredEvent,
    tabId: string
  ) {
    const triggerRegistrationData = transformNestedObject(
      this.addNecessaryFields(convertKeysToCamelCase(params.registration)),
      ['aggregatableDebugReportingConfig']
    );

    if (dataStore.sources?.triggerRegistration?.length > 0) {
      dataStore.sources.triggerRegistration.push({
        requestUrl: '',
        ...triggerRegistrationData,
        aggregatable: params.aggregatable,
        eventLevel: params.eventLevel,
        index: dataStore.sources.triggerRegistration.length,
        time: Date.now(),
        destination: new URL(dataStore.tabs[Number(tabId)].url).origin ?? '',
      });
    } else {
      dataStore.sources.triggerRegistration = [
        {
          requestUrl: '',
          ...triggerRegistrationData,
          aggregatable: params.aggregatable,
          eventLevel: params.eventLevel,
          index: 0,
          time: Date.now(),
          destination: new URL(dataStore.tabs[Number(tabId)].url).origin ?? '',
        },
      ];
    }

    dataStore.newUpdatesARA++;
  }

  /**
   * Adds necessary fields to the trigger registration data if they are missing.
   * @param {Protocol.Storage.AttributionReportingTriggerRegistration} triggerRegistrationData - The trigger registration data.
   * @returns {Protocol.Storage.AttributionReportingTriggerRegistration} The updated trigger registration data.
   */
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

  /**
   * Matches the trigger data with the registration data based on the specified key.
   * @param {any} registrationData - The registration data.
   * @param {any} triggerData - The trigger data.
   * @param {string} key - The key to match the data.
   * @returns {boolean} True if the data matches, false otherwise.
   */
  matchTriggerData(
    registrationData: any,
    triggerData: any,
    key: string
  ): boolean {
    if (key === 'aggregatableValues') {
      return registrationData[key].values.every(
        (value: Record<string, number | string>, index: number) =>
          isEqual(value?.value, triggerData[key][index].value) &&
          isEqual(value?.key, triggerData[key][index].key)
      );
    }

    if (key === 'eventTriggerData') {
      return isEqual(registrationData[key].values, triggerData[key].values);
    }

    if (key === 'aggregatableTriggerData') {
      return registrationData[key].every((value: any, index: number) => {
        return (
          value?.sourceKeys &&
          triggerData?.[key]?.[index]?.sourceKeys &&
          value?.keyPiece &&
          triggerData?.[key]?.[index]?.keyPiece &&
          BigInt(value?.keyPiece) ===
            BigInt(triggerData[key][index]?.keyPiece) &&
          isEqual(value?.sourceKeys, triggerData[key][index]?.sourceKeys)
        );
      });
    }

    return false;
  }
}

export default new ARAStore();
