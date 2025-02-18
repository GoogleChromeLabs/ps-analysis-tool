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
import type { SourcesRegistration } from '@google-psat/common';
/**
 * Internal dependencies
 */
import dataStore from './dataStore';

class ARAStore {
  processARASourcesRegistered(
    params: Protocol.Storage.AttributionReportingSourceRegisteredEvent,
    tabId: string
  ) {
    if (dataStore.sources?.[tabId]?.['sourceRegistration']?.length > 0) {
      let eventFired = false;

      dataStore.sources[tabId].sourceRegistration.forEach((event) => {
        if (
          (event as SourcesRegistration).eventId === params.registration.eventId
        ) {
          eventFired = true;
        }
      });

      if (eventFired) {
        return;
      }

      dataStore.sources[tabId].sourceRegistration.push({
        ...params.registration,
        result: params.result,
        index: dataStore.sources[tabId].sourceRegistration.length,
      });
    } else {
      dataStore.sources[tabId].sourceRegistration = [
        { ...params.registration, result: params.result, index: 0 },
      ];
    }
    dataStore.tabs[Number(tabId)].newUpdatesARA++;
  }

  processARATriggerRegistered(
    params: Protocol.Storage.AttributionReportingTriggerRegisteredEvent,
    tabId: string
  ) {
    if (dataStore.sources?.[tabId]?.triggerRegistration?.length > 0) {
      dataStore.sources[tabId].triggerRegistration.push({
        ...params.registration,
        aggregatable: params.aggregatable,
        eventLevel: params.eventLevel,
        index: dataStore.sources[tabId].sourceRegistration.length,
      });
    } else {
      dataStore.sources[tabId].triggerRegistration = [
        {
          ...params.registration,
          aggregatable: params.aggregatable,
          eventLevel: params.eventLevel,
          index: 0,
        },
      ];
    }
    dataStore.tabs[Number(tabId)].newUpdatesARA++;
  }
}

export default new ARAStore();
