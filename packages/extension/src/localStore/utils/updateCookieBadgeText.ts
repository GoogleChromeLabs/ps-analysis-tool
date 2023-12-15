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
import { getCurrentTabId } from '../../utils/getCurrentTabId';
import type { TabData } from '../types';
/**
 *
 * @param storage {object} The storage object from local store.
 * @param tabId {string} The tabId of the the tab where badge text need to be updated.
 */
export default async function updateCookieBadgeText(
  storage: {
    [key: string]: TabData;
  },
  tabId?: string
) {
  try {
    let currentTabId = '';
    if (tabId) {
      currentTabId = tabId;
    } else {
      currentTabId = (await getCurrentTabId()) as string;
    }
    if (!currentTabId) {
      return;
    }
    const tabCookies = storage[currentTabId].cookies || {};
    const numCookies = Object.keys(tabCookies).filter(
      (cookieKey) =>
        tabCookies[cookieKey]?.parsedCookie &&
        tabCookies[cookieKey].frameIdList?.length >= 1
    ).length;
    if (numCookies >= 0) {
      await chrome.action.setBadgeText({
        tabId: parseInt(currentTabId),
        text: numCookies.toString(),
      });
    }
  } catch (error) {
    // do nothing
  }
}
