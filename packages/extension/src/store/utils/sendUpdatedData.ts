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
 * Internal dependencies
 */
import ARAStore from '../ARAStore';
import cookieStore from '../cookieStore';
import PAStore from '../PAStore';
import prebidStore from '../prebidStore';

/**
 * Sends updated data to popup and developer tools for multiple store instances.
 * Triggers data synchronization across different stores including cookie, PA, ARA, and prebid stores.
 * @param {string} tabId - The ID of the browser tab to send the updated data to
 * @param {boolean} overrideForInitialSync - Optional flag to override initial synchronization behavior. Defaults to false
 */
function sendUpdatedData(tabId: string, overrideForInitialSync = false) {
  cookieStore.sendUpdatedDataToPopupAndDevTools(tabId, overrideForInitialSync);
  PAStore.sendUpdatedDataToPopupAndDevTools(tabId, overrideForInitialSync);
  ARAStore.sendUpdatedDataToPopupAndDevTools(tabId, overrideForInitialSync);
  prebidStore.sendUpdatedDataToPopupAndDevTools(tabId, overrideForInitialSync);
}

export default sendUpdatedData;
