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
import synchnorousCookieStore from '../store/synchnorousCookieStore';
import { getTab } from './getTab';

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();
  tabId;

  if (!newTabId) {
    return '';
  }

  if (
    synchnorousCookieStore.tabMode &&
    synchnorousCookieStore.tabMode !== 'unlimited'
  ) {
    const storedTabData = Object.keys(synchnorousCookieStore?.tabsData ?? {});

    await Promise.all(
      storedTabData.map(async (tabIdToDelete) => {
        synchnorousCookieStore?.removeTabData(Number(tabIdToDelete));
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

  synchnorousCookieStore.tabToRead = newTabId;

  synchnorousCookieStore.initialiseVariablesForNewTab(newTabId);

  synchnorousCookieStore?.addTabData(Number(newTabId));
  synchnorousCookieStore?.updateDevToolsState(Number(newTabId), true);
  synchnorousCookieStore?.updatePopUpState(Number(newTabId), true);

  const currentTab = await getTab(Number(newTabId));

  synchnorousCookieStore?.updateUrl(Number(newTabId), currentTab?.url ?? '');

  return newTabId;
};

export default listenToNewTab;
