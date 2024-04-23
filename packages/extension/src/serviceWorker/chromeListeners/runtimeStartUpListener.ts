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
import synchnorousCookieStore from '../../store/synchnorousCookieStore';

const onStartUpListener = async () => {
  const storage = await chrome.storage.sync.get();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(synchnorousCookieStore?.tabsData ?? {}).length === 0) {
      return;
    }

    Object.keys(synchnorousCookieStore?.tabsData ?? {}).forEach((key) => {
      synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (Object.keys(storage).includes('allowedNumberOfTabs')) {
    synchnorousCookieStore.tabMode = storage.allowedNumberOfTabs;
  }

  if (Object.keys(storage).includes('isUsingCDP')) {
    synchnorousCookieStore.globalIsUsingCDP = storage.isUsingCDP;
  }
};

chrome.runtime.onStartup.addListener(onStartUpListener);
