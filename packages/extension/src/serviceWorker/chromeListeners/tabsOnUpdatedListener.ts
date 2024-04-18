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
import { TABID_STORAGE } from '../../constants';
import synchnorousCookieStore from '../../store/synchnorousCookieStore';
import getQueryParams from '../../utils/getQueryParams';
import attachCDP from '../attachCDP';

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!tab.url) {
    return;
  }

  const queryParams = getQueryParams(tab.url);

  if (queryParams.psat_cdp || queryParams.psat_multitab) {
    await chrome.storage.sync.set({
      allowedNumberOfTabs:
        queryParams.psat_multitab === 'on' ? 'unlimited' : 'single',
      isUsingCDP: queryParams.psat_cdp === 'on',
    });

    synchnorousCookieStore.globalIsUsingCDP = queryParams.psat_cdp === 'on';
    synchnorousCookieStore.tabMode =
      queryParams.psat_multitab === 'on' ? 'unlimited' : 'single';
  }

  synchnorousCookieStore?.updateUrl(tabId, tab.url);

  if (changeInfo.status === 'loading' && tab.url) {
    synchnorousCookieStore?.removeCookieData(tabId);
    synchnorousCookieStore.deinitialiseVariablesForTab(tabId.toString());
    synchnorousCookieStore.initialiseVariablesForNewTab(tabId.toString());

    synchnorousCookieStore?.updateParentChildFrameAssociation(
      tabId,
      (await chrome.debugger.getTargets()).filter(
        (target) => target.tabId && target.tabId === tabId
      )[0].id,
      '0'
    );
  }
  try {
    if (synchnorousCookieStore.globalIsUsingCDP) {
      await attachCDP({ tabId });
    } else {
      await chrome.debugger.detach({ tabId });
    }

    await chrome.tabs.sendMessage(tabId, {
      tabId,
      payload: {
        type: TABID_STORAGE,
        tabId,
        frameId: (
          await chrome.debugger.getTargets()
        ).filter((target) => target.tabId && target.tabId === tabId)[0].id,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
});
