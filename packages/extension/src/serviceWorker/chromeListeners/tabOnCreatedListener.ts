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
import { ALLOWED_NUMBER_OF_TABS } from '../../constants';
import cookieStore from '../../store/cookieStore';
import dataStore, { DataStore } from '../../store/dataStore';

export const onTabCreatedListener = async (tab: chrome.tabs.Tab) => {
  try {
    if (!tab?.id) {
      return;
    }

    const targets = await chrome.debugger.getTargets();

    if (DataStore.tabMode && DataStore.tabMode !== 'unlimited') {
      const doesTabExist = DataStore.tabToRead;
      if (
        Object.keys(cookieStore.getTabsData() ?? {}).length >=
          ALLOWED_NUMBER_OF_TABS &&
        doesTabExist
      ) {
        return;
      }
      DataStore.tabToRead = tab.id.toString();
      dataStore?.addTabData(tab.id.toString());

      if (DataStore.globalIsUsingCDP) {
        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        cookieStore.initialiseVariablesForNewTab(tab.id.toString());

        dataStore.updateParentChildFrameAssociation(
          tab.id.toString(),
          currentTab[0].id,
          '0'
        );
      }
    } else {
      dataStore?.addTabData(tab.id.toString());

      if (DataStore.globalIsUsingCDP) {
        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        cookieStore.initialiseVariablesForNewTab(tab.id.toString());

        dataStore.updateParentChildFrameAssociation(
          tab.id.toString(),
          currentTab[0].id,
          '0'
        );
      }
    }
  } catch (error) {
    //Fail silently
    //eslint-disable-next-line no-console
    console.warn(error);
  }
};
