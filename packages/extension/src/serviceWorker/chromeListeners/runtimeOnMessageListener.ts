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
import dataStore, { DataStore } from '../../store/dataStore';
import {
  CS_GET_PREBID_DATA_RESPONSE,
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  INITIAL_SYNC,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  TABID_STORAGE,
} from '../../constants';
import attachCDP from '../attachCDP';
import reloadCurrentTab from '../../utils/reloadCurrentTab';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
import cookieStore from '../../store/cookieStore';
import sendUpdatedData from '../../store/utils/sendUpdatedData';
import PAStore from '../../store/PAStore';

// eslint-disable-next-line complexity
export const runtimeOnMessageListener = async (request: any) => {
  if (request.setInPagePrebidInterface) {
    const tabs = await chrome.tabs.query({});

    if (!tabs) {
      return;
    }

    await Promise.all(
      tabs.map(async (tab) => {
        if (!tab.id) {
          return;
        }
        await chrome.tabs.sendMessage(tab.id, {
          tabId: tab.id,
          payload: {
            type: TABID_STORAGE,
            tabId: tab.id,
            frameId: 0,
          },
        });
      })
    );
  }
  if (!request.type) {
    return;
  }

  const incomingMessageType = request.type;

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    const actionsPerformed: { [key: string]: boolean | number } = {};

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      DataStore.globalIsUsingCDP = sessionStorage.isUsingCDP;
      actionsPerformed.globalIsUsingCDP = true;
    }

    await chrome.storage.session.remove(['isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      isUsingCDP: DataStore.globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();

    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }

        dataStore.initialiseVariablesForNewTab(id.toString());

        const currentTab = targets.filter(
          ({ tabId }) => tabId && id && tabId === id
        );
        dataStore?.addTabData(id.toString());
        dataStore?.updateParentChildFrameAssociation(
          id.toString(),
          currentTab[0].id,
          '0'
        );

        try {
          if (DataStore.globalIsUsingCDP) {
            await attachCDP({ tabId: id });
          }
        } catch (error) {
          //Fail silently
        }

        reloadCurrentTab(id);
      })
    );

    await sendMessageWrapper(SERVICE_WORKER_RELOAD_MESSAGE, {
      actionsPerformed,
    });
  }

  if (!request?.payload?.tabId) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId;

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string | boolean } = {};
    const tabs = await chrome.tabs.query({});
    const qualifyingTabs = tabs.filter((tab) => tab.url?.startsWith('https'));

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);

    await sendMessageWrapper('EXCEEDING_LIMITATION_UPDATE', {
      exceedingLimitations: qualifyingTabs.length > 5,
    });

    dataStore?.updateDevToolsState(incomingMessageTabId, true);

    if (cookieStore.getTabsData(incomingMessageTabId)) {
      sendUpdatedData(incomingMessageTabId, true);
    }
  }

  if (POPUP_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    const tabs = await chrome.tabs.query({});
    const qualifyingTabs = tabs.filter((tab) => tab.url?.startsWith('https'));

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);
    await sendMessageWrapper('EXCEEDING_LIMITATION_UPDATE', {
      exceedingLimitations: qualifyingTabs.length > 5,
    });

    dataStore?.updatePopUpState(incomingMessageTabId, true);

    if (cookieStore.getTabsData(incomingMessageTabId)) {
      sendUpdatedData(incomingMessageTabId, true);
    }
  }

  if (DEVTOOLS_CLOSE === incomingMessageType) {
    dataStore?.updateDevToolsState(incomingMessageTabId, false);
  }

  if (POPUP_CLOSE === incomingMessageType) {
    dataStore?.updatePopUpState(incomingMessageTabId, false);
  }

  if (DEVTOOLS_SET_JAVASCSCRIPT_COOKIE === incomingMessageType) {
    cookieStore?.update(incomingMessageTabId, request?.payload?.cookieData);
  }

  if (CS_GET_PREBID_DATA_RESPONSE === incomingMessageType) {
    PAStore.prebidEvents[incomingMessageTabId.toString()] = {
      ...request.payload.prebidData,
    };
    DataStore.tabs[incomingMessageTabId.toString()].newUpdatesPA++;
  }
};
