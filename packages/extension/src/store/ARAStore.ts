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
import type {
  SourcesRegistration,
  TriggerRegistration,
} from '@google-psat/common';
/**
 * Internal dependencies
 */
import { DataStore } from './dataStore';
import convertKeysToCamelCase from './utils/convertKeysToCamelCase';
import transformNestedObject from './utils/transformObject';

/**
 * Class responsible for managing Attribution Reporting API (ARA) data storage and processing.
 */
class ARAStore extends DataStore {
  /**
   * The Attribution Reporting sources for the tab.
   */
  sources: {
    sourceRegistration: SourcesRegistration[];
    triggerRegistration: TriggerRegistration[];
  } = {
    sourceRegistration: [],
    triggerRegistration: [],
  };

  /**
   * The Attribution Reporting sources for the tab.
   */
  oldSources: {
    sourceRegistration: SourcesRegistration[];
    triggerRegistration: TriggerRegistration[];
  } = {
    sourceRegistration: [],
    triggerRegistration: [],
  };

  /**
   * The Attribution Reporting headers for the tab.
   */
  headersForARA: {
    [tabId: string]: {
      [requestId: string]: {
        url: string;
        headers: Protocol.Network.Headers;
      };
    };
  } = {};

  constructor() {
    super();
    this.sources = {
      sourceRegistration: [],
      triggerRegistration: [],
    };
  }

  deinitialiseVariablesForTab(tabId: string): void {
    super.deinitialiseVariablesForTab(tabId);
    delete this.headersForARA[tabId];
  }

  initialiseVariablesForNewTab(tabId: string): void {
    super.initialiseVariablesForNewTab(tabId);
    this.headersForARA[tabId.toString()] = {};
    //@ts-ignore
    globalThis.PSAT = {
      //@ts-ignore
      ...globalThis.PSAT,
      sources: this.sources,
      headersForARA: this.headersForARA,
    };
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: string) {
    delete this.headersForARA[tabId.toString()];
  }

  /**
   * Remove the window's all tabs data from the store.
   * @param {number} windowId The window id.
   */
  removeWindowData(windowId: number) {
    chrome.tabs.query({ windowId }, (tabs) => {
      tabs.map((tab) => {
        if (tab.id) {
          this.removeTabData(tab.id.toString());
        }
        return tab;
      });
    });
  }

  /**
   * Sends updated data to the popup and devtools
   * @param {number} tabId The window id.
   * @param {boolean} overrideForInitialSync Optional is only passed when we want to override the newUpdate condition for initial sync.
   */
  async sendUpdatedDataToPopupAndDevTools(
    tabId: string,
    overrideForInitialSync = false
  ) {
    if (!DataStore.tabs[tabId]) {
      return;
    }

    try {
      if (
        DataStore.tabs[tabId].devToolsOpenState ||
        DataStore.tabs[tabId].popupOpenState
      ) {
        await this.processAndSendARAData(tabId, overrideForInitialSync);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
    }
  }

  /**
   * Processes the Attribution Reporting Source Registered event.
   * @param {Protocol.Storage.AttributionReportingSourceRegisteredEvent} params - The event parameters.
   * @param {string} tabId - The ID of the tab where the event occurred.
   */
  processARASourcesRegistered(
    params: Protocol.Storage.AttributionReportingSourceRegisteredEvent,
    tabId: string
  ) {
    const sourceRegistrationData = convertKeysToCamelCase(
      params.registration
    ) as Protocol.Storage.AttributionReportingSourceRegistration;

    if (this.sources?.sourceRegistration?.length > 0) {
      this.sources.sourceRegistration.push({
        requestUrl: '',
        ...sourceRegistrationData,
        result: params.result,
        tabId,
        index: this.sources.sourceRegistration.length,
      });
    } else {
      this.sources.sourceRegistration = [
        {
          requestUrl: '',
          ...sourceRegistrationData,
          result: params.result,
          index: 0,
          tabId,
        },
      ];
    }
  }

  /**
   * Processes and sends auction message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendARAData(tabId: string, overrideForInitialSync: boolean) {
    try {
      if (isEqual(this.oldSources, this.sources) && !overrideForInitialSync) {
        return;
      }

      await chrome.runtime.sendMessage({
        type: 'ARA_EVENTS',
        payload: {
          sourcesRegistration: this.sources.sourceRegistration,
          triggerRegistration: this.sources.triggerRegistration,
          tabId: Number(tabId),
        },
      });

      this.oldSources = structuredClone(this.sources);
    } catch (error) {
      // Fail silently
    }
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

    if (this.sources?.triggerRegistration?.length > 0) {
      this.sources.triggerRegistration.push({
        requestUrl: '',
        ...triggerRegistrationData,
        aggregatable: params.aggregatable,
        eventLevel: params.eventLevel,
        index: this.sources.triggerRegistration.length,
        time: Date.now(),
        tabId,
        destination: new URL(DataStore.tabs[Number(tabId)].url).origin ?? '',
      });
    } else {
      this.sources.triggerRegistration = [
        {
          requestUrl: '',
          ...triggerRegistrationData,
          aggregatable: params.aggregatable,
          eventLevel: params.eventLevel,
          index: 0,
          time: Date.now(),
          tabId,
          destination: new URL(DataStore.tabs[Number(tabId)].url).origin ?? '',
        },
      ];
    }
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
