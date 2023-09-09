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
console.log('content-script: runtime');

// Setup the connection for messaging.
const port = chrome.runtime.connect({ name: 'psat-tool' });

// listen the devtool for any reply.
port.onMessage.addListener((msg) => {
  console.log('content-script: onMessage', msg);
});

// DOMContentLoad is already triggered. directly can use the code to get iframes.
const iframes = document.getElementsByTagName('iframe');
for (const frame of iframes) {
  frame.addEventListener('mouseover', () => {
    // Let devtool know that user is hovering over an iframe.
    port.postMessage({ hover: true });
  });

  frame.addEventListener('mouseout', () => {
    // Let devtool know that user is exited the iframe.
    port.postMessage({ hover: false });
  });
}
