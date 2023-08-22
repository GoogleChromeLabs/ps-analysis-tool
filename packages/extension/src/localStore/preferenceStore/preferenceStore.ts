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
import updateStorage from './updateStorage';
import type { TabData, PreferenceData } from '../types';

const PreferenceStore = {
  /**
   * Update cookie store.
   * @param {string} tabId Tab id.
   * @param {Array} persistenceData Cookies data.
   */
  async update(tabId: string, persistenceData: PreferenceData) {
    await updateStorage(tabId, (prevState: TabData) => {
      const _updatedPreferences = persistenceData || {};
      return {
        ...prevState,
        preferences: _updatedPreferences,
      };
    });
  },

  /**
   * creates an entry for a tab
   * @param {string} tabId The tab id.
   */
  async addTabData(tabId: string) {
    await chrome.storage.local.set({
      [tabId]: {
        cookies: {},
        focusedAt: Date.now(),
        preferences: {},
      },
    });
  },
};

export default PreferenceStore;
