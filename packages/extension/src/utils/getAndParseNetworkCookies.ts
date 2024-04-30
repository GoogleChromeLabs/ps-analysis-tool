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
 * External dependencies
 */
import type { CookieData } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import synchnorousCookieStore from '../store/synchnorousCookieStore';
import parseNetworkCookies from './parseNetworkCookies';

export const getAndParseNetworkCookies = async (tabId: string) => {
  if (!synchnorousCookieStore.globalIsUsingCDP) {
    return;
  }

  let allCookies: CookieData[] = [];

  await Promise.all(
    Object.entries(
      synchnorousCookieStore.frameIdToResourceMap[tabId] ?? {}
    ).map(async ([key, value]) => {
      try {
        //@ts-ignore
        const { cookies = [] } = await chrome.debugger.sendCommand(
          { targetId: key },
          'Network.getCookies',
          { urls: Array.from(value) }
        );

        const parsedCookies = parseNetworkCookies(
          cookies,
          synchnorousCookieStore?.getTabUrl(Number(tabId)) ?? '',
          synchnorousCookieStore.cookieDB ?? {},
          key
        );
        if (parsedCookies.length > 0) {
          allCookies = [...allCookies, ...parsedCookies];
        }
      } catch (error) {
        //Fail silently. There will be only one reason stating target id not found.
      }
    })
  );

  synchnorousCookieStore.update(Number(tabId), allCookies);
};
