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
import ARAStore from '../../store/ARAStore';
import dataStore from '../../store/dataStore';
import PAStore from '../../store/PAStore';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
import cookieStore from '../../store/cookieStore';

export const onTabRemovedListener = async (tabId: number) => {
  dataStore.removeTabData(tabId.toString());
  PAStore.removeTabData(tabId.toString());
  ARAStore.removeTabData(tabId.toString());
  cookieStore.removeTabData(tabId.toString());

  dataStore?.removeTabData(tabId.toString());
  const tabs = await chrome.tabs.query({});
  const qualifyingTabs = tabs.filter((_tab) => _tab.url?.startsWith('http'));

  await sendMessageWrapper('EXCEEDING_LIMITATION_UPDATE', {
    exceedingLimitations: qualifyingTabs.length > 5,
  });
};
