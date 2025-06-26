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
 * Internal depencencies
 */
import { DataStore } from '../store/dataStore';
const sendMessageWrapper = async (
  type: string,
  payload?: Record<string, any>,
  tabId?: number //This is send only when we have to update the devtools open state to true.
) => {
  try {
    await chrome.runtime.sendMessage({
      type,
      payload,
    });

    if (tabId && !DataStore.tabs[tabId].devToolsOpenState) {
      DataStore.tabs[tabId].devToolsOpenState = true;
    }
  } catch (error) {
    // Fail silently. The only error which will be thrown is receiving end does not exist.
  }
};

export default sendMessageWrapper;
