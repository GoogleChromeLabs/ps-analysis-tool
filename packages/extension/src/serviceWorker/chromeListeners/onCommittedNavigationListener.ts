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
import ARAStore from '../../store/ARAStore';
import cookieStore from '../../store/cookieStore';
import dataStore, { DataStore } from '../../store/dataStore';
import PAStore from '../../store/PAStore';
import prebidStore from '../../store/prebidStore';
import PRTStore from '../../store/PRTStore';
import getQueryParams from '../../utils/getQueryParams';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
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

    if (url.startsWith('chrome') || url.startsWith('devtools')) {
      return;
    }

    if (!url) {
      return;
    }

    if (!DataStore.tabs[tabId.toString()]) {
      dataStore.addTabData(tabId.toString());
      dataStore.initialiseVariablesForNewTab(tabId.toString());
      DataStore.tabs[tabId.toString()].devToolsOpenState = true;

      cookieStore?.removeCookieData(tabId.toString());
      cookieStore.initialiseVariablesForNewTab(tabId.toString());
      PRTStore.initialiseVariablesForNewTab(tabId.toString());
      prebidStore.initialiseVariablesForNewTabAndFrame(tabId.toString(), 0);
      PAStore.initialiseVariablesForNewTab(tabId.toString());

      prebidStore.initialiseVariablesForNewTabAndFrame(tabId.toString(), 0);
      ARAStore.initialiseVariablesForNewTab(tabId.toString());
    } else {
      cookieStore?.removeCookieData(tabId.toString());
      cookieStore.initialiseVariablesForNewTab(tabId.toString());
      PRTStore.initialiseVariablesForNewTab(tabId.toString());
      prebidStore.initialiseVariablesForNewTabAndFrame(tabId.toString(), 0);
      PAStore.initialiseVariablesForNewTab(tabId.toString());
    }

    const queryParams = getQueryParams(url);

    if (queryParams.psat_cdp) {
      await chrome.storage.sync.set({
        isUsingCDP: queryParams.psat_cdp === 'on',
      });

      DataStore.globalIsUsingCDP = queryParams.psat_cdp === 'on';
    }

    const targets = await chrome.debugger.getTargets();
    const mainFrameId = DataStore?.globalIsUsingCDP
      ? targets.filter((target) => target.tabId && target.tabId === tabId)[0]
          ?.id
      : 0;

    dataStore?.updateUrl(tabId.toString(), url);

    if (DataStore.globalIsUsingCDP) {
      await attachCDP({ tabId });

      const {
        targetInfo: { targetId },
      } = await chrome.debugger.sendCommand({ tabId }, 'Target.getTargetInfo', {
        targetId: mainFrameId,
      });

      dataStore.updateParentChildFrameAssociation(
        tabId.toString(),
        targetId,
        '0'
      );
    }

    const tabs = await chrome.tabs.query({});
    const qualifyingTabs = tabs.filter((_tab) => _tab.url?.startsWith('http'));

    await sendMessageWrapper(
      'EXCEEDING_LIMITATION_UPDATE',
      {
        exceedingLimitations: qualifyingTabs.length > 5,
      },
      tabId
    );
    const frames = await chrome.webNavigation.getAllFrames({ tabId });

    if (!frames) {
      return;
    }

    await Promise.all(
      frames.map(async (frame) => {
        await chrome.tabs.sendMessage(
          tabId,
          {
            tabId,
            payload: {
              type: TABID_STORAGE,
              tabId,
              frameId: frame.frameId,
            },
          },
          {
            frameId: frame.frameId,
          }
        );
      })
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }
};
