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
import { CookieStore } from '../localStore';
import { getCurrentTabId } from './getCurrentTabId';

export const updateTabPSPanelState = async (status: boolean) => {
  const tabId = await getCurrentTabId();

  if (tabId) {
    await CookieStore.updateTabPSPanelState(tabId, status);
  }
};

export const getTabPSPanelState = async () => {
  const tabId = await getCurrentTabId();

  return tabId ? CookieStore.getTabPSPanelState(tabId) : false;
};
