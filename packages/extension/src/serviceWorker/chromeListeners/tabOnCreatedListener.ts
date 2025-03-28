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
import dataStore from '../../store/dataStore';

export const onTabCreatedListener = async (tab: chrome.tabs.Tab) => {
  try {
    if (!tab?.id) {
      return;
    }

    const targets = await chrome.debugger.getTargets();

    if (dataStore.tabMode && dataStore.tabMode !== 'unlimited') {
      const doesTabExist = dataStore.tabToRead;
      if (
        Object.keys(dataStore?.tabsData ?? {}).length >=
          ALLOWED_NUMBER_OF_TABS &&
        doesTabExist
      ) {
        return;
      }
      dataStore.tabToRead = tab.id.toString();
      dataStore?.addTabData(tab.id);

      if (dataStore.globalIsUsingCDP) {
        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        dataStore.initialiseVariablesForNewTab(tab.id.toString());

        dataStore.updateParentChildFrameAssociation(
          tab.id,
          currentTab[0].id,
          '0'
        );
      }
    } else {
      dataStore?.addTabData(tab.id);

      if (dataStore.globalIsUsingCDP) {
        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        dataStore.initialiseVariablesForNewTab(tab.id.toString());

        dataStore.updateParentChildFrameAssociation(
          tab.id,
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
