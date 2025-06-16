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
import type { PrebidEvents } from '@google-psat/common';
/**
 * Internal dependencies.
 */
import { PREBID_EVENTS } from '../constants';
import { DataStore } from './dataStore';

class PrebidStore extends DataStore {
  /**
   * This will store the prebid data for each tab
   */
  prebidEvents: {
    [tabId: string]: PrebidEvents;
  } = {};

  constructor() {
    super();
  }

  deinitialiseVariablesForTab(tabId: string): void {
    super.deinitialiseVariablesForTab(tabId);
    delete this.prebidEvents[tabId];
  }

  initialiseVariablesForNewTab(tabId: string): void {
    super.initialiseVariablesForNewTab(tabId);
    this.prebidEvents[tabId] = {
      prebidExists: false,
      adUnits: {},
      pbjsNamespace: '',
      noBids: {},
      receivedBids: [],
      errorEvents: [],
      versionInfo: '',
      config: {},
      auctionEvents: {},
      installedModules: [],
    };
    //@ts-ignore
    globalThis.PSAT = {
      //@ts-ignore
      ...globalThis.PSAT,
      prebidEvents: this.prebidEvents,
    };
  }

  /**
   * Remove the tab data from the store.
   * @param {number} tabId The tab id.
   */
  removeTabData(tabId: string) {
    delete this.prebidEvents[tabId.toString()];
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
   * Processes and sends prebid data message to the extension for the specified tabId
   * @param {number} tabId The url whose url needs to be update.
   * @param {boolean | undefined} overrideForInitialSync Override the condition.
   */
  async processAndSendPrebidData(
    tabId: string,
    overrideForInitialSync: boolean
  ) {
    try {
      if (
        DataStore.tabs[tabId].newUpdatesPrebid <= 0 &&
        !overrideForInitialSync
      ) {
        return;
      }

      await chrome.runtime.sendMessage({
        type: PREBID_EVENTS,
        payload: {
          refreshTabData: overrideForInitialSync,
          tabId,
          prebidEvents: this.prebidEvents[tabId],
        },
      });
      DataStore.tabs[tabId].newUpdatesPrebid = 0;
    } catch (error) {
      // Fail silently
    }
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
        await this.processAndSendPrebidData(tabId, overrideForInitialSync);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
      //Fail silently. Ignoring the console.warn here because the only error this will throw is of "Error: Could not establish connection".
    }
  }
}

export default new PrebidStore();
