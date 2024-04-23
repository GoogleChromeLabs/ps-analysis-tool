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

export const runtimeOnInstalledListener = async (
  details: chrome.runtime.InstalledDetails
) => {
  synchnorousCookieStore?.clear();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(synchnorousCookieStore?.tabsData ?? {}).length === 0) {
      return;
    }

    Object.keys(synchnorousCookieStore?.tabsData ?? {}).forEach((key) => {
      synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: true,
    });
  }

  if (details.reason === 'update') {
    await chrome.storage.local.clear();
    const preSetSettings = await chrome.storage.sync.get();
    synchnorousCookieStore.tabMode =
      preSetSettings?.allowedNumberOfTabs ?? 'single';
    synchnorousCookieStore.globalIsUsingCDP =
      preSetSettings?.isUsingCDP ?? false;

    if (synchnorousCookieStore.tabMode === 'unlimited') {
      const allTabs = await chrome.tabs.query({});
      const targets = await chrome.debugger.getTargets();

      allTabs.forEach((tab) => {
        if (!tab.id) {
          return;
        }

        synchnorousCookieStore.initialiseVariablesForNewTab(tab.id.toString());

        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        synchnorousCookieStore?.addTabData(tab.id);
        synchnorousCookieStore?.updateParentChildFrameAssociation(
          tab.id,
          currentTab[0].id,
          '0'
        );
      });
    }

    if (
      preSetSettings?.allowedNumberOfTabs &&
      Object.keys(preSetSettings).includes('isUsingCDP')
    ) {
      return;
    }

    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: true,
    });
  }
};

chrome.runtime.onInstalled.addListener(runtimeOnInstalledListener);
