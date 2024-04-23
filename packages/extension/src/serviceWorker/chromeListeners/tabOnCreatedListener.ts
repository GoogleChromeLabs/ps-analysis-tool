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
import { ALLOWED_NUMBER_OF_TABS } from '../../constants';
import syncCookieStore from '../../store/synchnorousCookieStore';

export const onTabCreatedListener = async (tab: chrome.tabs.Tab) => {
  if (!tab.id) {
    return;
  }

  const targets = await chrome.debugger.getTargets();

  if (syncCookieStore.tabMode && syncCookieStore.tabMode !== 'unlimited') {
    const doesTabExist = syncCookieStore.tabToRead;
    if (
      Object.keys(syncCookieStore?.tabsData ?? {}).length >=
        ALLOWED_NUMBER_OF_TABS &&
      doesTabExist
    ) {
      return;
    }
    syncCookieStore.tabToRead = tab.id.toString();
    syncCookieStore?.addTabData(tab.id);

    syncCookieStore.initialiseVariablesForNewTab(tab.id.toString());

    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    syncCookieStore.updateParentChildFrameAssociation(
      tab.id,
      currentTab[0].id,
      '0'
    );
  } else {
    syncCookieStore?.addTabData(tab.id);
    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    syncCookieStore.initialiseVariablesForNewTab(tab.id.toString());

    syncCookieStore.updateParentChildFrameAssociation(
      tab.id,
      currentTab[0].id,
      '0'
    );
  }
};

chrome.tabs.onCreated.addListener(onTabCreatedListener);
