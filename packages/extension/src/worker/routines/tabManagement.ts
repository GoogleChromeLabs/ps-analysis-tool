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
import type { ICookieStore } from '../../localStore/cookieStore';
import getAllTabs from '../../utils/getAllTabs';

/**
 * Routine for intializing managing tab related data in cookie store.
 * Event listeners added in this routine should manage.
 * - Creating entries for tabs already opened before intializing.
 * - Creating entries for tabs when a new tab is opened.
 * - Updating url of a tab when navigation happens.
 * - Updating focusedAt var when foucus changes.
 * - Removing all entries for tabs in a window when its about to be closed.
 * @param CookieStore Store handler to which tab mangement routine should be added to.
 */
const initialize = async (CookieStore: ICookieStore) => {
  await CookieStore.clearStorage();

  const allTabs = await getAllTabs();
  allTabs.forEach(async ({ id, windowId, url }) => {
    if (id && windowId) {
      await CookieStore.createTabEntry(windowId, id, url, undefined);
    }
  });

  chrome.tabs.onCreated.addListener(onCreatedListener(CookieStore));
  chrome.tabs.onRemoved.addListener(onRemovedListener(CookieStore));
  chrome.tabs.onActivated.addListener(onActivatedListener(CookieStore));
  chrome.webNavigation.onBeforeNavigate.addListener(
    onBeforeNavigateListener(CookieStore)
  );
  chrome.windows.onRemoved.addListener(onWindowRemoveListener(CookieStore));
};

/**
 * @param CookieStore CookieStore
 * @returns EventHandler that creates entries for all opened tabs.
 */
const onCreatedListener =
  (CookieStore: ICookieStore) => async (tab: chrome.tabs.Tab) => {
    if (tab.id) {
      await CookieStore.createTabEntry(
        tab.windowId,
        tab.id,
        tab.url,
        Date.now()
      );
    }
  };

/**
 * @param CookieStore CookieStore
 * @returns EventHandler that removes entry for a tab.
 */
const onRemovedListener =
  (CookieStore: ICookieStore) => async (tabId: number) => {
    if (tabId) {
      await CookieStore.deleteTabEntry(tabId);
    }
  };

/**
 * @param CookieStore CookieStore
 * @returns EventHandler that updates focusedAt's value which is used for partial clearing to prevent overflow.
 */
const onActivatedListener =
  (CookieStore: ICookieStore) =>
  async (activeInfo: chrome.tabs.TabActiveInfo) => {
    await CookieStore.updateTabEntry(activeInfo.tabId, {
      focusedAt: Date.now(),
    });
  };

/**
 * @param CookieStore CookieStore
 * @returns EventHandler that updates url of a tab in cookie storage.
 */
const onBeforeNavigateListener =
  (CookieStore: ICookieStore) =>
  async (details: { tabId: number; url: string; frameType: string }) => {
    const { tabId, url, frameType } = details;

    if (url && frameType === 'outermost_frame') {
      await CookieStore.updateTabEntry(tabId, { url });
    }
  };

/**
 * Deletes entry of all the tabs of a window which is being closed.
 * @param CookieStore CookieStore
 * @returns EventHandler that deletes entry of all the tabs of a window which is being closed.
 */
const onWindowRemoveListener =
  (CookieStore: ICookieStore) => async (windowId: number) => {
    const windowTabList = await chrome.tabs.query({ windowId });
    windowTabList.forEach(async ({ id }) => {
      if (id) {
        await CookieStore.deleteTabEntry(id);
      }
    });
  };

/**
 * Routines related to tab management. Any routine here has a side effect of
 * updating cookie store instance passed to it using the its interface described by {@link ICookieStore}.
 */
const tabManagementRoutine = {
  initialize,
};

export default tabManagementRoutine;
