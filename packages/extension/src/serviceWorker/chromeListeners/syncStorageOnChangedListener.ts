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
import synchnorousCookieStore from '../../store/synchnorousCookieStore';
import resetCookieBadgeText from '../../store/utils/resetCookieBadgeText';
import sendMessageWrapper from '../../utils/sendMessageWrapper';

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.allowedNumberOfTabs ||
      !changes?.allowedNumberOfTabs?.newValue ||
      !changes?.allowedNumberOfTabs?.oldValue
    ) {
      return;
    }
    synchnorousCookieStore.tabMode = changes.allowedNumberOfTabs.newValue;

    const tabs = await chrome.tabs.query({});
    await sendMessageWrapper(INITIAL_SYNC, {
      tabMode: synchnorousCookieStore.tabMode,
      tabToRead: synchnorousCookieStore.tabToRead,
    });

    if (changes?.allowedNumberOfTabs?.newValue === 'single') {
      synchnorousCookieStore.tabToRead = '';

      tabs.map((tab) => {
        if (!tab?.id) {
          return tab;
        }

        resetCookieBadgeText(tab.id);

        synchnorousCookieStore?.removeTabData(tab.id);

        return tab;
      });
    } else {
      tabs.forEach((tab) => {
        if (!tab?.id) {
          return;
        }
        synchnorousCookieStore?.addTabData(tab.id);
        synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
        synchnorousCookieStore?.updateDevToolsState(tab.id, true);
      });
    }
  }
);

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.isUsingCDP ||
      typeof changes?.isUsingCDP?.newValue === 'undefined' ||
      typeof changes?.isUsingCDP?.oldValue === 'undefined'
    ) {
      return;
    }

    synchnorousCookieStore.globalIsUsingCDP = changes?.isUsingCDP?.newValue;

    const tabs = await chrome.tabs.query({});

    if (!changes?.isUsingCDP?.newValue) {
      await Promise.all(
        tabs.map(async ({ id }) => {
          if (!id) {
            return;
          }

          try {
            await chrome.debugger.detach({ tabId: id });
            synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        })
      );
    } else {
      tabs.forEach(({ id }) => {
        if (!id) {
          return;
        }

        synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
      });
    }
  }
);
