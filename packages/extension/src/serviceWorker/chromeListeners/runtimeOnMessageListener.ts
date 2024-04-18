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
import type { CookieData, CookieDatabase } from '@ps-analysis-tool/common';

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
import parseNetworkCookies from '../../utils/parseNetworkCookies';
import { fetchDictionary } from '../../utils/fetchCookieDictionary';
import { getTab } from '../../utils/getTab';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
// eslint-disable-next-line complexity
chrome.runtime.onMessage.addListener(async (request) => {
  let cookieDB: CookieDatabase | null = null;
  if (!request.type) {
    return;
  }

  if (!cookieDB) {
    cookieDB = await fetchDictionary();
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
    if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
      synchnorousCookieStore.tabMode = sessionStorage.allowedNumberOfTabs;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      synchnorousCookieStore.globalIsUsingCDP = sessionStorage.isUsingCDP;
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
          } else {
            await chrome.debugger.detach({ tabId: id });
          }
        } catch (error) {
          //Fail silently
        }

        await reloadCurrentTab(id);
      })
    );
    await sendMessageWrapper(SERVICE_WORKER_RELOAD_MESSAGE);
  }

  if (!request?.payload?.tabId) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId;

  if ('GET_REST_DATA_FROM_URL' === incomingMessageType) {
    let allCookies: CookieData[] = [];
    await Promise.all(
      Object.entries(
        synchnorousCookieStore.frameIdToResourceMap[incomingMessageTabId] ?? {}
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
            synchnorousCookieStore?.getTabUrl(incomingMessageTabId) ?? '',
            cookieDB ?? {},
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

    synchnorousCookieStore?.update(Number(incomingMessageTabId), allCookies);
  }

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
});
