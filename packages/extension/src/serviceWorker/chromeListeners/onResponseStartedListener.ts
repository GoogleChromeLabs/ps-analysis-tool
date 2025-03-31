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
import parseHeaders from '../../utils/parseHeaders';
import dataStore, { DataStore } from '../../store/dataStore';
import { getTab } from '../../utils/getTab';
import cookieStore from '../../store/cookieStore';

export const onResponseStartedListener = ({
  tabId,
  url,
  responseHeaders,
  frameId,
  requestId,
}: chrome.webRequest.WebResponseCacheDetails) => {
  if (DataStore.globalIsUsingCDP) {
    return;
  }

  (async () => {
    const tab = await getTab(tabId);
    let tabUrl = dataStore?.getTabUrl(tabId.toString());

    if (tab && tab.pendingUrl) {
      tabUrl = tab.pendingUrl;
    }

    const cookies = await parseHeaders(
      DataStore.globalIsUsingCDP,
      'response',
      DataStore.tabToRead,
      DataStore.tabMode,
      tabId,
      url,
      DataStore.cookieDB ?? {},
      tabUrl,
      frameId.toString(),
      requestId,
      responseHeaders
    );

    if (!cookies || (cookies && cookies?.length === 0)) {
      return;
    }

    // Adds the cookies from the request headers to the cookies object.
    cookieStore?.update(tabId.toString(), cookies);
  })();
};
