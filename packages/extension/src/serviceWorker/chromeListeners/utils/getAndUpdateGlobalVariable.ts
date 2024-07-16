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
import synchnorousCookieStore from '../../../store/synchnorousCookieStore';
import attachCDP from '../../attachCDP';

const getAndUpdateGlobalVariable = async () => {
  await chrome.storage.local.clear();

  const preSetSettings = await chrome.storage.sync.get();

  synchnorousCookieStore.tabMode =
    preSetSettings?.allowedNumberOfTabs ?? 'single';
  synchnorousCookieStore.globalIsUsingCDP = preSetSettings?.isUsingCDP ?? false;

  if (synchnorousCookieStore.tabMode === 'unlimited') {
    const allTabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();
    await Promise.all(
      allTabs.map(async (tab) => {
        if (!tab.id || tab.url?.startsWith('chrome://')) {
          return;
        }

        synchnorousCookieStore?.addTabData(tab.id);

        if (synchnorousCookieStore.globalIsUsingCDP) {
          synchnorousCookieStore.initialiseVariablesForNewTab(
            tab.id.toString()
          );

          await attachCDP({ tabId: tab.id });

          const currentTab = targets.filter(
            ({ tabId }) => tabId && tab.id && tabId === tab.id
          );
          synchnorousCookieStore?.updateParentChildFrameAssociation(
            tab.id,
            currentTab[0].id,
            '0'
          );
        }
      })
    );
  }
};

export default getAndUpdateGlobalVariable;
