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
import ARAStore from '../../../store/ARAStore';
import cookieStore from '../../../store/cookieStore';
import dataStore, { DataStore } from '../../../store/dataStore';
import PAStore from '../../../store/PAStore';
import prebidStore from '../../../store/prebidStore';
import PRTStore from '../../../store/PRTStore';
import attachCDP from '../../attachCDP';

const updateGlobalVariableAndAttachCDP = async () => {
  await chrome.storage.local.clear();

  const preSetSettings = await chrome.storage.sync.get();

  DataStore.isObservabilityEnabled =
    preSetSettings?.isObservabilityEnabled ?? false;

  DataStore.observabilityPartsStatus = {
    cookies: preSetSettings?.observabilityPartsStatus.cookies || false,
    protectedAudience:
      preSetSettings?.observabilityPartsStatus.protectedAudience || false,
    attributionReporting:
      preSetSettings.observabilityPartsStatus.attributionReporting || false,
    ipProtection: preSetSettings.observabilityPartsStatus.ipProtection || false,
    scriptBlocking:
      preSetSettings.observabilityPartsStatus.scriptBlocking || false,
  };

  if (!DataStore.isObservabilityEnabled) {
    return;
  }

  const allTabs = await chrome.tabs.query({});
  const targets = await chrome.debugger.getTargets();

  allTabs.forEach((tab) => {
    if (!tab.id || !tab.url?.startsWith('http')) {
      return;
    }

    dataStore?.addTabData(tab.id.toString());
    dataStore.initialiseVariablesForNewTab(tab.id.toString());
    cookieStore.initialiseVariablesForNewTab(tab.id.toString());
    PRTStore.initialiseVariablesForNewTab(tab.id.toString());

    prebidStore.deinitialiseVariablesForTab(tab.id.toString());
    prebidStore.initialiseVariablesForNewTabAndFrame(tab.id.toString(), 0);

    PAStore.initialiseVariablesForNewTab(tab.id.toString());
    ARAStore.initialiseVariablesForNewTab(tab.id.toString());

    if (DataStore.isObservabilityEnabled) {
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
