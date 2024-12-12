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
import { INITIAL_SYNC } from '../../constants';
import dataStore from '../../store/dataStore';
import resetCookieBadgeText from '../../store/utils/resetCookieBadgeText';
import sendMessageWrapper from '../../utils/sendMessageWrapper';

export const onSyncStorageChangedListenerForMultiTab = async (changes: {
  [key: string]: chrome.storage.StorageChange;
}) => {
  if (
    !changes?.allowedNumberOfTabs ||
    !changes?.allowedNumberOfTabs?.newValue ||
    !changes?.allowedNumberOfTabs?.oldValue
  ) {
    return;
  }
  dataStore.tabMode = changes.allowedNumberOfTabs.newValue;

  const tabs = await chrome.tabs.query({});
  await sendMessageWrapper(INITIAL_SYNC, {
    tabMode: dataStore.tabMode,
    tabToRead: dataStore.tabToRead,
  });

  if (changes?.allowedNumberOfTabs?.newValue === 'single') {
    dataStore.tabToRead = '';

    tabs.map((tab) => {
      if (!tab?.id) {
        return tab;
      }

      resetCookieBadgeText(tab.id);

      dataStore?.removeTabData(tab.id);

      return tab;
    });
  } else {
    tabs.forEach((tab) => {
      if (!tab?.id) {
        return;
      }
      dataStore?.addTabData(tab.id);
      dataStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
      dataStore?.updateDevToolsState(tab.id, true);
    });
  }
};

export const onSyncStorageChangedListenerForCDP = async (changes: {
  [key: string]: chrome.storage.StorageChange;
}) => {
  if (
    !changes?.isUsingCDP ||
    typeof changes?.isUsingCDP?.newValue === 'undefined' ||
    typeof changes?.isUsingCDP?.oldValue === 'undefined'
  ) {
    return;
  }

  dataStore.globalIsUsingCDP = changes?.isUsingCDP?.newValue;

  const tabs = await chrome.tabs.query({});

  if (!changes?.isUsingCDP?.newValue) {
    if (!dataStore.globalIsUsingCDP) {
      const targets = await chrome.debugger.getTargets();
      await Promise.all(
        targets.map(async ({ id, attached }) => {
          try {
            if (!id || !attached) {
              return;
            }

            await chrome.debugger.detach({ targetId: id });
          } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
          }
        })
      );
    }
  } else {
    tabs.forEach(({ id }) => {
      if (!id) {
        return;
      }

      dataStore?.sendUpdatedDataToPopupAndDevTools(id);
    });
  }
};
