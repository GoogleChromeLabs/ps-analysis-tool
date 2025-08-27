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
import dataStore from '../../store/dataStore';
import { updateGlobalVariableAndAttachCDP, setupIntervals } from './utils';

export const runtimeOnInstalledListener = async (
  details: chrome.runtime.InstalledDetails
) => {
  dataStore?.clear();

  setupIntervals();

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      isObservabilityEnabled: false,
      observabilityPartsStatus: {
        cookies: false,
        protectedAudience: false,
        attributionReporting: false,
        ipProtection: false,
        scriptBlocking: false,
      },
      isFirstTime: true,
    });
    await updateGlobalVariableAndAttachCDP();
  }

  if (details.reason === 'update') {
    const preSetSettings = await chrome.storage.sync.get();

    await updateGlobalVariableAndAttachCDP();

    if (Object.keys(preSetSettings).includes('isObservabilityEnabled')) {
      return;
    }

    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      isObservabilityEnabled: false,
      observabilityPartsStatus: {
        cookies: false,
        protectedAudience: false,
        attributionReporting: false,
        ipProtection: false,
        scriptBlocking: false,
      },
    });
  }
};
