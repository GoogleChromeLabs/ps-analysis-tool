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
import { DataStore } from '../../../store/dataStore';
import sendUpdatedData from '../../../store/utils/sendUpdatedData';
import { getAndParseNetworkCookies } from '../../../utils/getAndParseNetworkCookies';

const setupIntervals = () => {
  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(async () => {
    await chrome.storage.session.get();
  }, 20000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(DataStore.tabs ?? {}).length === 0) {
      return;
    }

    Object.keys(DataStore.tabs ?? {}).forEach((key) => {
      sendUpdatedData(key);
    });
  }, 1200);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(DataStore.tabs ?? {}).length === 0) {
      return;
    }

    Object.keys(DataStore.tabs ?? {}).forEach((key) => {
      getAndParseNetworkCookies(key);
    });
  }, 5000);
};

export default setupIntervals;
