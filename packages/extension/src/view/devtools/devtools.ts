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
import { updateTabPSPanelState } from '../../utils/psPanelState';
import { DEVTOOL_PORT_NAME } from '../../constants';

const callback = (panel: {
  onShown: { addListener: (arg0: () => void) => void };
  onHidden: { addListener: (arg0: () => void) => void };
}) => {
  // Fires when the user switches to the panel.
  panel.onShown.addListener(async () => {
    await updateTabPSPanelState(true);
  });

  // Only works when devtool tab is switched, not when it is closed.
  panel.onHidden.addListener(async () => {
    await updateTabPSPanelState(false);
  });

  chrome.runtime.connect(chrome.runtime.id, {
    name: DEVTOOL_PORT_NAME,
  });
};

chrome.devtools.panels.create(
  'Privacy Sandbox',
  'icons/icon.svg',
  'devtools/index.html',
  callback
);
