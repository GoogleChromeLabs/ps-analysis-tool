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
import synchnorousCookieStore from '../../store/synchnorousCookieStore';
import { getAndUpdateGlobalVariable, setupTimeouts } from './utils';

export const runtimeOnInstalledListener = async (
  details: chrome.runtime.InstalledDetails
) => {
  synchnorousCookieStore?.clear();

  setupTimeouts();

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
    });
  }

  if (details.reason === 'update') {
    const preSetSettings = await chrome.storage.sync.get();

    await getAndUpdateGlobalVariable();

    if (
      preSetSettings?.allowedNumberOfTabs &&
      Object.keys(preSetSettings).includes('isUsingCDP')
    ) {
      return;
    }

    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
    });
  }
};
