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
 * Internal dependencies.
 */
import {
  CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA,
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
} from '../../constants';
import { decycle } from '../utils/decycle';
import doesPrebidExist from '../utils/doesPrebidExist';

/**
 * Represents the webpage's content script functionalities.
 */
class PrebidInterface {
  /**
   * TabId of the current Tab
   */
  tabId: number | null = null;

  /**
   * Boolean which indicates if prebid exists on the page.
   */
  prebidExists: boolean | null = null;
  /**
   * Prebid interface.
   */
  prebidInterface: any | null = null;

  /**
   * Scanning status
   */
  scanningStatus: any | null = false;

  constructor() {
    this.listenToConnection();
  }

  /**
   * Listens for connection requests from devtool.
   */
  listenToConnection() {
    window.onmessage = (event) => {
      if (
        event.data?.type === SCRIPT_PREBID_INITIAL_SYNC &&
        this.scanningStatus
      ) {
        this.sendInitialData();
      }

      if (event.data?.type === CONTENT_SCRIPT_TO_SCRIPT_GET_PREBID_DATA) {
        this.tabId = event.data.tabId;
        this.getAndProcessPrebidData(event.data.propertyName);
      }
    };

    document.addEventListener('unload', () => {
      this.prebidExists = false;
      this.scanningStatus = false;
      this.prebidInterface = null;
    });
  }

  sendInitialData() {
    window.top?.postMessage({
      type: SCRIPT_GET_PREBID_DATA_RESPONSE,
      tabId: this.tabId,
      prebidData: Object.keys(window[this.prebidInterface]),
      propertyName: 'keys',
    });
  }

  async getAndProcessPrebidData(propertyName: string) {
    //@ts-ignore
    if (
      this.prebidExists &&
      !Object.keys(window[this.prebidInterface]).includes(propertyName)
    ) {
      return;
    }

    //@ts-ignore
    const prebidCaller = window[this.prebidInterface]?.[propertyName];

    const prebidData =
      typeof prebidCaller === 'function' ? await prebidCaller() : prebidCaller;

    if (prebidData) {
      // Send the prebid data to contentscript so that it can be sent to the devtools
      window.top?.postMessage({
        type: SCRIPT_GET_PREBID_DATA_RESPONSE,
        tabId: this.tabId,
        propertyName,
        prebidData: JSON.parse(decycle(prebidData)),
      });
    }
  }
}

export type PrebidInterfaceType = typeof PrebidInterface;

doesPrebidExist(PrebidInterface);
