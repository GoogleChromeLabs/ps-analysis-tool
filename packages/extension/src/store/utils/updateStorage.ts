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
 * Internal dependencies.
 */
import { type Storage, type TabData } from '../types';
import updateCookieBadgeText from './updateCookieBadgeText';

const updateStorage = async (
  tabId: string,
  updater: (prevState: TabData) => TabData
) => {
  //Find out storage quota used currently
  const currentStorageSnapshot: Storage = await chrome.storage.local.get();

  //Find out storage quota that will be used in the future
  const newStorageValue: Storage = {
    ...currentStorageSnapshot,
    [tabId]: updater(currentStorageSnapshot[tabId]),
  };

  await updateCookieBadgeText(newStorageValue, tabId);
  //Apply update to the chrome local store
  await chrome.storage.local.set(newStorageValue);
};

export default updateStorage;
