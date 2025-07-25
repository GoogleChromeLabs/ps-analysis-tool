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
 * Internal dependencies.
 */
import {
  CS_GET_PREBID_DATA_RESPONSE,
  PREBID_SCANNING_STATUS,
  SCRIPT_GET_PREBID_DATA_RESPONSE,
  SCRIPT_PREBID_INITIAL_SYNC,
  TABID_STORAGE,
} from '../../constants';

/**
 * Represents the webpage's content script functionalities.
 */
class PrebidContentScript {
  constructor() {
    this.listenToConnection();
  }

  /**
   * Listens for connection requests from devtool.
   */
  listenToConnection() {
    // Message once on initialize, to let the devtool know that content script has loaded.
    if (chrome.runtime?.id) {
      chrome.runtime.sendMessage({
        setInPagePrebidInterface: true,
      });
    }

    window.onmessage = (event) => {
      if (event.data?.type === SCRIPT_GET_PREBID_DATA_RESPONSE) {
        chrome.runtime.sendMessage({
          type: CS_GET_PREBID_DATA_RESPONSE,
          payload: {
            prebidExists: event.data.prebidData?.prebidExists,
            prebidData: event.data.prebidData,
          },
        });
      }

      if (event.data?.type === PREBID_SCANNING_STATUS) {
        chrome.runtime.sendMessage({
          type: PREBID_SCANNING_STATUS,
          payload: {
            prebidExists: event.data.prebidExists,
          },
        });
      }
    };

    chrome.runtime.onMessage.addListener((message, _sender, response) => {
      if (message.status === 'set?') {
        response({ setInPagePrebidInterface: true });
      }

      if (message?.payload?.type === TABID_STORAGE) {
        window.postMessage({
          type: SCRIPT_PREBID_INITIAL_SYNC,
        });
      }
    });
  }
}

export default new PrebidContentScript();
