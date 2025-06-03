/*
 * Copyright 2024 Google LLC
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
import ARAStore from '../../../../store/ARAStore';
import cookieStore from '../../../../store/cookieStore';
import dataStore, { DataStore } from '../../../../store/dataStore';
import PAStore from '../../../../store/PAStore';
import attachCDP from '../../attachCDP';

const updateGlobalVariableAndAttachCDP = async () => {
  await chrome.storage.local.clear();

  const preSetSettings = await chrome.storage.sync.get();

  DataStore.globalIsUsingCDP = preSetSettings?.isUsingCDP ?? false;

  const allTabs = await chrome.tabs.query({});
  const targets = await chrome.debugger.getTargets();

  allTabs.forEach((tab) => {
    if (!tab.id || !tab.url?.startsWith('https://')) {
      return;
    }

    dataStore?.addTabData(tab.id.toString());
    dataStore.initialiseVariablesForNewTab(tab.id.toString());
    cookieStore.initialiseVariablesForNewTab(tab.id.toString());

    PAStore.initialiseVariablesForNewTab(tab.id.toString());
    ARAStore.initialiseVariablesForNewTab(tab.id.toString());

    if (DataStore.globalIsUsingCDP) {
      attachCDP({ tabId: tab.id });

      const currentTab = targets.filter(
        ({ tabId }) => tabId && tab.id && tabId === tab.id
      );
      dataStore?.updateParentChildFrameAssociation(
        tab.id.toString(),
        currentTab[0].id,
        '0'
      );
    }
  });
};

export default updateGlobalVariableAndAttachCDP;
