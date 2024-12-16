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
import dataStore from '../../store/dataStore';
import {
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  INITIAL_SYNC,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  SET_TAB_TO_READ,
} from '../../constants';
import listenToNewTab from '../../utils/listenToNewTab';
import attachCDP from '../attachCDP';
import reloadCurrentTab from '../../utils/reloadCurrentTab';
import { getTab } from '../../utils/getTab';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
import cookieStore from '../../store/cookieStore';

// eslint-disable-next-line complexity
export const runtimeOnMessageListener = async (request: any) => {
  if (!request.type) {
    return;
  }

  const incomingMessageType = request.type;

  if (SET_TAB_TO_READ === incomingMessageType) {
    dataStore.tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    await sendMessageWrapper(SET_TAB_TO_READ, {
      tabId: Number(newTab),
    });

    if (dataStore.globalIsUsingCDP) {
      await attachCDP({ tabId: Number(newTab) });
    }

    await reloadCurrentTab(Number(newTab));
  }

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    const actionsPerformed: { [key: string]: boolean | number } = {};

    if (sessionStorage?.allowedNumberOfTabs) {
      dataStore.tabMode = sessionStorage.allowedNumberOfTabs;
      actionsPerformed.allowedNumberOfTabs =
        sessionStorage.allowedNumberOfTabs === 'unlimited' ? 0 : 1;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      dataStore.globalIsUsingCDP = sessionStorage.isUsingCDP;
      actionsPerformed.globalIsUsingCDP = true;
    }

    await chrome.storage.session.remove(['allowedNumberOfTabs', 'isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      allowedNumberOfTabs: dataStore.tabMode,
      isUsingCDP: dataStore.globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();

    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }

        if (dataStore.tabMode === 'unlimited') {
          dataStore.initialiseVariablesForNewTab(id.toString());

          const currentTab = targets.filter(
            ({ tabId }) => tabId && id && tabId === id
          );
          dataStore?.addTabData(id);
          dataStore?.updateParentChildFrameAssociation(
            id,
            currentTab[0].id,
            '0'
          );
        }

        try {
          if (dataStore.globalIsUsingCDP) {
            await attachCDP({ tabId: id });
          }
        } catch (error) {
          //Fail silently
        }

        await reloadCurrentTab(id);
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
    dataToSend['tabMode'] = dataStore.tabMode;

    if (dataStore.tabMode === 'single') {
      dataToSend['tabToRead'] = dataStore.tabToRead;
    }

    if (
      !dataStore?.tabs[incomingMessageTabId] &&
      dataStore.tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(incomingMessageTabId);
      dataToSend['psatOpenedAfterPageLoad'] = request.payload.doNotReReload
        ? false
        : true;
      dataStore?.addTabData(incomingMessageTabId);
      dataStore?.updateUrl(incomingMessageTabId, currentTab?.url || '');
    }

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);

    dataStore?.updateDevToolsState(incomingMessageTabId, true);

    if (dataStore?.tabsData[incomingMessageTabId]) {
      dataStore?.sendUpdatedDataToPopupAndDevTools(incomingMessageTabId, true);
    }
  }

  if (POPUP_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = dataStore.tabMode;

    if (dataStore.tabMode === 'single') {
      dataToSend['tabToRead'] = dataStore.tabToRead;
    }

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);

    dataStore?.updatePopUpState(incomingMessageTabId, true);

    if (dataStore?.tabsData[incomingMessageTabId]) {
      dataStore?.sendUpdatedDataToPopupAndDevTools(incomingMessageTabId, true);
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
};
