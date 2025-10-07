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
  PREBID_SCANNING_STATUS,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  UPDATE_PRT,
} from '../../constants';
import attachCDP from '../attachCDP';
import reloadCurrentTab from '../../utils/reloadCurrentTab';
import sendMessageWrapper from '../../utils/sendMessageWrapper';
import cookieStore from '../../store/cookieStore';
import sendUpdatedData from '../../store/utils/sendUpdatedData';
import prebidStore from '../../store/prebidStore';
import ARAStore from '../../store/ARAStore';
import PAStore from '../../store/PAStore';
import PRTStore from '../../store/PRTStore';

// eslint-disable-next-line complexity
export const runtimeOnMessageListener = async (
  request: any,
  sender: chrome.runtime.MessageSender
) => {
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

        dataStore.initialiseVariablesForNewTab(id.toString());
        dataStore.addTabData(id.toString());
        dataStore?.updateParentChildFrameAssociation(
          id.toString(),
          currentTab[0].id,
          '0'
        );
        DataStore.tabs[id.toString()].devToolsOpenState = true;
        cookieStore.initialiseVariablesForNewTab(id.toString());
        PRTStore.deinitialiseVariablesForTab(id.toString());
        PRTStore.initialiseVariablesForNewTab(id.toString());

        prebidStore.initialiseVariablesForNewTabAndFrame(id.toString(), 0);
        PAStore.initialiseVariablesForNewTab(id.toString());
        ARAStore.initialiseVariablesForNewTab(id.toString());
        sendUpdatedData(id.toString(), true);

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

  const frameId = sender?.frameId ?? 0;
  const senderTabId = sender?.tab?.id;
  if (
    (!request?.payload?.tabId && !senderTabId) ||
    (senderTabId && !DataStore.tabs[senderTabId?.toString()])
  ) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId ?? senderTabId;

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string | boolean } = {};
    const tabs = await chrome.tabs.query({});
    const qualifyingTabs = tabs.filter((tab) => tab.url?.startsWith('http'));

    await sendMessageWrapper(INITIAL_SYNC, dataToSend);
    await dataStore.sendUpdatedDataToPopupAndDevTools(
      incomingMessageTabId,
      true
    );

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
    const qualifyingTabs = tabs.filter((tab) => tab.url?.startsWith('http'));

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
    if (request?.payload?.prebidExists === false) {
      return;
    }

    if (request.payload.prebidData.pbjsNamespace) {
      prebidStore.prebidEvents[incomingMessageTabId.toString()][
        `${frameId}#${request.payload.prebidData.pbjsNamespace}`
      ] = {
        prebidExists: true,
        ...request.payload.prebidData,
      };
      DataStore.tabs[incomingMessageTabId.toString()].newUpdatesPrebid++;
    }
  }

  if (PREBID_SCANNING_STATUS === incomingMessageType) {
    if (request?.payload?.prebidExists === false) {
      //@ts-ignore -- We dont want to create a new object here, just add data whether or not prebid exists for this frame.
      prebidStore.prebidEvents[incomingMessageTabId.toString()][`${frameId}`] =
        {
          prebidExists: false,
        };
      DataStore.tabs[incomingMessageTabId.toString()].newUpdatesPrebid++;
      return;
    }
  }

  if (UPDATE_PRT === incomingMessageType) {
    const harLog: chrome.devtools.network.HARLog = request.payload.harLog;

    harLog.entries.forEach((entry) => {
      const token = entry.request.headers.find(
        (header) =>
          header.name === 'Sec-Probabilistic-Reveal-Token' ||
          header.name === 'sec-probabilistic-reveal-token'
      );
      const isTokenPresent =
        PRTStore.tabTokens[request.payload.tabId.toString()].perTokenMetadata[
          new URL(entry.request.url).origin
        ];

      if (token?.value && !isTokenPresent) {
        PRTStore.decryptAndUpdatePRT(
          token?.value,
          new URL(entry.request.url).origin,
          request.payload.tabId.toString()
        );
      }
    });
  }
};
