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
const callback = (panel: {
  onShown: { addListener: (arg0: () => void) => void };
}) => {
  // Fires when the user switches to the panel.
  panel.onShown.addListener(() => {
    // Make sure the context is not changed. This can occur if the service worker is refreshed or becomes inactive.
    if (chrome?.storage) {
      // eslint-disable-next-line no-console
      console.log(panel, 'panel');

      // Remove if exist. otherwise onupdate hook will not trigger.
      chrome.storage.session.remove('devToolState');

      // try to communicate with web page.
      chrome.storage.session.set({
        devToolState: 'Ready!',
      });
    }
  });
};

chrome.devtools.panels.create(
  'Privacy Sandbox',
  'icons/icon.svg',
  'devtools/index.html',
  callback
);
