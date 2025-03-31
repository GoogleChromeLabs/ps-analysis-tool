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
import cookieStore from '../store/cookieStore';
import dataStore, { DataStore } from '../store/dataStore';
import { getCurrentTab } from './getCurrentTab';
import { getTab } from './getTab';

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() ||
    chrome?.devtools?.inspectedWindow?.tabId?.toString() ||
    (await getCurrentTab(true))?.id?.toString();
  tabId;

  if (!newTabId) {
    return '';
  }

  if (DataStore.tabMode && DataStore.tabMode !== 'unlimited') {
    const storedTabData = Object.keys(cookieStore.getTabsData() ?? {});

    await Promise.all(
      storedTabData.map(async (tabIdToDelete) => {
        dataStore?.removeTabData(tabIdToDelete);
        try {
          await chrome.action.setBadgeText({
            tabId: Number(tabIdToDelete),
            text: '',
          });
          await chrome.debugger.detach({ tabId: Number(tabIdToDelete) });
        } catch (error) {
          // Fail silently
        }
        return tabIdToDelete;
      })
    );
  }

  DataStore.tabToRead = newTabId;

  cookieStore.initialiseVariablesForNewTab(newTabId);

  cookieStore.addTabData(newTabId);
  dataStore?.updateDevToolsState(newTabId, true);
  dataStore?.updatePopUpState(newTabId, true);

  const currentTab = await getTab(newTabId);

  dataStore?.updateUrl(newTabId, currentTab?.url ?? '');

  return newTabId;
};

export default listenToNewTab;
