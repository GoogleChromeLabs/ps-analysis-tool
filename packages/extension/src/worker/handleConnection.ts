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
import { WEBPAGE_PORT_NAME, DEVTOOL_PORT_NAME } from '../constants';

let webpagePort: chrome.runtime.Port | null = null;
let devToolPort: chrome.runtime.Port | null = null;

/**
 * Fires when connection for messaging is initiated.
 * @see https://developer.chrome.com/docs/extensions/reference/runtime/#event-onConnect
 */
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === WEBPAGE_PORT_NAME) {
    webpagePort = port;
    webpagePort.onMessage.addListener((response) => {
      if (devToolPort) {
        devToolPort.postMessage(response);
      }
    });
  }

  if (port.name === DEVTOOL_PORT_NAME) {
    devToolPort = port;
    devToolPort.onMessage.addListener((response) => {
      if (webpagePort) {
        webpagePort.postMessage(response);
      }
    });
  }
});
