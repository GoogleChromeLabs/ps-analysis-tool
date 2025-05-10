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
 * Internal dependencies
 */
import cookieStore from '../../store/cookieStore';
import dataStore from '../../store/dataStore';

export const windowsOnRemovedListener = (windowId: number) => {
  chrome.tabs.query({ windowId }, (tabs) => {
    tabs.map((tab) => {
      if (tab.id) {
        cookieStore.deinitialiseVariablesForTab(tab.id.toString());
      }
      return tab;
    });
  });

  dataStore?.removeWindowData(windowId);
};
