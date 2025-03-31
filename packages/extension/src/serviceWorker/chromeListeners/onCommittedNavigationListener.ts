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
import cookieStore from '../../store/cookieStore';
import dataStore, { DataStore } from '../../store/dataStore';
import getQueryParams from '../../utils/getQueryParams';
import attachCDP from '../attachCDP';

export const onCommittedNavigationListener = async ({
  frameId,
  frameType,
  url,
  tabId,
}: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
  try {
    if (frameType !== 'outermost_frame' && frameId !== 0) {
      return;
    }
    if (!url) {
      return;
    }

    const targets = await chrome.debugger.getTargets();
    const mainFrameId = DataStore?.globalIsUsingCDP
      ? targets.filter((target) => target.tabId && target.tabId === tabId)[0]
          ?.id
      : 0;

    const queryParams = getQueryParams(url);

    if (queryParams.psat_cdp || queryParams.psat_multitab) {
      await chrome.storage.sync.set({
        allowedNumberOfTabs:
          queryParams.psat_multitab === 'on' ? 'unlimited' : 'single',
        isUsingCDP: queryParams.psat_cdp === 'on',
      });

      DataStore.globalIsUsingCDP = queryParams.psat_cdp === 'on';
      DataStore.tabMode =
        queryParams.psat_multitab === 'on' ? 'unlimited' : 'single';
    }

    dataStore?.updateUrl(tabId.toString(), url);

    if (url && !url.startsWith('chrome://')) {
      cookieStore?.removeCookieData(tabId.toString());

      if (DataStore.globalIsUsingCDP) {
        cookieStore.deinitialiseVariablesForTab(tabId.toString());
        cookieStore.initialiseVariablesForNewTab(tabId.toString());

        await attachCDP({ tabId });

        const {
          targetInfo: { targetId },
        } = await chrome.debugger.sendCommand(
          { tabId },
          'Target.getTargetInfo',
          {
            targetId: mainFrameId,
          }
        );

        dataStore.updateParentChildFrameAssociation(
          tabId.toString(),
          targetId,
          '0'
        );
      }
    }
    await chrome.tabs.sendMessage(tabId, {
      tabId,
      payload: {
        type: TABID_STORAGE,
        tabId,
        frameId: mainFrameId,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
};
