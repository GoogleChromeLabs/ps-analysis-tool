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
import { setupTimeouts } from './utils';

export const onStartUpListener = async () => {
  const storage = await chrome.storage.sync.get();
  setupTimeouts();

  if (storage?.allowedNumberOfTabs) {
    synchnorousCookieStore.tabMode = storage.allowedNumberOfTabs;
  }

  if (Object.keys(storage).includes('isUsingCDP')) {
    synchnorousCookieStore.globalIsUsingCDP = storage.isUsingCDP;
  }
};
