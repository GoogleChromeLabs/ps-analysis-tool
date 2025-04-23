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
import dataStore, { DataStore } from '../../store/dataStore';
import sendUpdatedData from '../../store/utils/sendUpdatedData';

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

  DataStore.globalIsUsingCDP = changes?.isUsingCDP?.newValue;

  const tabs = await chrome.tabs.query({});

  if (!changes?.isUsingCDP?.newValue) {
    if (!DataStore.globalIsUsingCDP) {
      const targets = await chrome.debugger.getTargets();
      await Promise.all(
        targets.map(async ({ id }) => {
          try {
            if (!id) {
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
    tabs.forEach(({ id, url }) => {
      if (!id) {
        return;
      }

      dataStore?.addTabData(id.toString());
      dataStore.updateUrl(id.toString(), url ?? '');
      sendUpdatedData(id.toString());
    });
  }
};
