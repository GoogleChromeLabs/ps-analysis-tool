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
import synchnorousCookieStore from '../../store/synchnorousCookieStore';
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

// eslint-disable-next-line complexity
export const runtimeOnMessageListener = async (request: any) => {
  if (!request.type) {
    return;
  }

  const incomingMessageType = request.type;

  if (SET_TAB_TO_READ === incomingMessageType) {
    synchnorousCookieStore.tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    await sendMessageWrapper(SET_TAB_TO_READ, {
      tabId: Number(newTab),
    });

    if (synchnorousCookieStore.globalIsUsingCDP) {
      await attachCDP({ tabId: Number(newTab) });
    }

    await reloadCurrentTab(Number(newTab));
  }

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    const actionsPerformed: { [key: string]: boolean | number } = {};

    if (sessionStorage?.allowedNumberOfTabs) {
      synchnorousCookieStore.tabMode = sessionStorage.allowedNumberOfTabs;
      actionsPerformed.allowedNumberOfTabs =
        sessionStorage.allowedNumberOfTabs === 'unlimited' ? 0 : 1;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      synchnorousCookieStore.globalIsUsingCDP = sessionStorage.isUsingCDP;
      actionsPerformed.globalIsUsingCDP = true;
    }

    await chrome.storage.session.remove(['allowedNumberOfTabs', 'isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      allowedNumberOfTabs: synchnorousCookieStore.tabMode,
      isUsingCDP: synchnorousCookieStore.globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();

    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }

        if (synchnorousCookieStore.tabMode === 'unlimited') {
          synchnorousCookieStore.initialiseVariablesForNewTab(id.toString());

          const currentTab = targets.filter(
            ({ tabId }) => tabId && id && tabId === id
          );
          synchnorousCookieStore?.addTabData(id);
          synchnorousCookieStore?.updateParentChildFrameAssociation(
            id,
            currentTab[0].id,
            '0'
          );
        }

        try {
          if (synchnorousCookieStore.globalIsUsingCDP) {
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
    dataToSend['tabMode'] = synchnorousCookieStore.tabMode;

    if (synchnorousCookieStore.tabMode === 'single') {
      dataToSend['tabToRead'] = synchnorousCookieStore.tabToRead;
    }

    if (
      !synchnorousCookieStore?.tabs[incomingMessageTabId] &&
      synchnorousCookieStore.tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(incomingMessageTabId);
      dataToSend['psatOpenedAfterPageLoad'] = request.payload.doNotReReload
        ? false
        : true;
      synchnorousCookieStore?.addTabData(incomingMessageTabId);
      synchnorousCookieStore?.updateUrl(
        incomingMessageTabId,
        currentTab?.url || ''
      );
    }

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);

    synchnorousCookieStore?.updateDevToolsState(incomingMessageTabId, true);

    if (synchnorousCookieStore?.tabsData[incomingMessageTabId]) {
      synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (POPUP_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = synchnorousCookieStore.tabMode;

    if (synchnorousCookieStore.tabMode === 'single') {
      dataToSend['tabToRead'] = synchnorousCookieStore.tabToRead;
    }

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);

    synchnorousCookieStore?.updatePopUpState(incomingMessageTabId, true);

    if (synchnorousCookieStore?.tabsData[incomingMessageTabId]) {
      synchnorousCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (DEVTOOLS_CLOSE === incomingMessageType) {
    synchnorousCookieStore?.updateDevToolsState(incomingMessageTabId, false);
  }

  if (POPUP_CLOSE === incomingMessageType) {
    synchnorousCookieStore?.updatePopUpState(incomingMessageTabId, false);
  }

  if (DEVTOOLS_SET_JAVASCSCRIPT_COOKIE === incomingMessageType) {
    synchnorousCookieStore?.update(
      incomingMessageTabId,
      request?.payload?.cookieData
    );
  }
};
