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
 * External dependencies.
 */
import { Protocol } from 'devtools-protocol';
import {
  type CookieDatabase,
  type CookieData,
  parseResponseReceivedExtraInfo,
  parseRequestWillBeSentExtraInfo,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { fetchDictionary } from '../utils/fetchCookieDictionary';
import {
  ALLOWED_NUMBER_OF_TABS,
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  INITIAL_SYNC,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  SET_TAB_TO_READ,
  TABID_STORAGE,
} from '../constants';
import SynchnorousCookieStore from '../store/synchnorousCookieStore';
import { getTab } from '../utils/getTab';
import getQueryParams from '../utils/getQueryParams';
import reloadCurrentTab from '../utils/reloadCurrentTab';
import createCookieFromAuditsIssue from '../utils/createCookieFromAuditsIssue';
import attachCDP from './attachCDP';
import isValidURL from '../utils/isValidURL';
import fetchFrameResourceAndGetCookies from './fetchFrameResourceAndGetCookies';

let cookieDB: CookieDatabase | null = null;
let syncCookieStore: SynchnorousCookieStore | undefined;

const requestIdToCDPURLMapping: {
  [tabId: string]: {
    [requestId: string]: {
      frameId: string;
      url: string;
    };
  };
} = {};

const auditsIssueForTab: {
  [tabId: string]: {
    [requestId: string]: Protocol.Audits.CookieIssueDetails;
  };
} = {};

const unParsedRequestHeaders: {
  [tabId: string]: {
    [requestId: string]: Protocol.Network.RequestWillBeSentExtraInfoEvent;
  };
} = {};

const unParsedResponseHeaders: {
  [tabId: string]: {
    [requestId: string]: Protocol.Network.ResponseReceivedExtraInfoEvent;
  };
} = {};

const initiatorToUrlMap: {
  [tabId: string]: {
    [initiatorDomain: string]: string[];
  };
} = {};

let tabMode: 'single' | 'unlimited' = 'single';
let tabToRead = '';
let globalIsUsingCDP = false;

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfo',
  'Audits.issueAdded',
  'Network.requestWillBeSent',
  'Page.frameAttached',
  'Page.frameNavigated',
];

/**
 * Fires when a tab is created.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

  unParsedRequestHeaders[tab.id.toString()] = {};
  unParsedResponseHeaders[tab.id.toString()] = {};
  requestIdToCDPURLMapping[tab.id.toString()] = {};
  auditsIssueForTab[tab.id.toString()] = {};
  initiatorToUrlMap[tab.id.toString()] = {};

  if (!syncCookieStore) {
    syncCookieStore = new SynchnorousCookieStore();
  }

  const targets = await chrome.debugger.getTargets();

  if (tabMode && tabMode !== 'unlimited') {
    const doesTabExist = tabToRead;
    if (
      Object.keys(syncCookieStore?.tabsData ?? {}).length >=
        ALLOWED_NUMBER_OF_TABS &&
      doesTabExist
    ) {
      return;
    }
    tabToRead = tab.id.toString();
    syncCookieStore?.addTabData(tab.id);

    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    syncCookieStore.updateFrameIdSet(tab.id, currentTab[0].id);
  } else {
    syncCookieStore?.addTabData(tab.id);
    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    syncCookieStore.updateFrameIdSet(tab.id, currentTab[0].id);
  }
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  delete unParsedRequestHeaders[tabId];
  delete unParsedResponseHeaders[tabId];
  delete requestIdToCDPURLMapping[tabId];
  delete auditsIssueForTab[tabId];

  syncCookieStore?.removeTabData(tabId);
});

/**
 * Fires when a profile with extension is started.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onStartup
 */
chrome.runtime.onStartup.addListener(async () => {
  const storage = await chrome.storage.sync.get();

  if (!syncCookieStore) {
    syncCookieStore = new SynchnorousCookieStore();
  }

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(syncCookieStore?.tabsData ?? {}).length === 0) {
      return;
    }

    Object.keys(syncCookieStore?.tabsData ?? {}).forEach((key) => {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (Object.keys(storage).includes('allowedNumberOfTabs')) {
    tabMode = storage.allowedNumberOfTabs;
  }

  if (Object.keys(storage).includes('isUsingCDP')) {
    globalIsUsingCDP = storage.isUsingCDP;
  }
});

/**
 * Fires when a tab is updated.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onUpdated
 */
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

    globalIsUsingCDP = queryParams.psat_cdp === 'on';
    tabMode = queryParams.psat_multitab === 'on' ? 'unlimited' : 'single';
  }

  syncCookieStore?.updateUrl(tabId, tab.url);

  if (changeInfo.status === 'loading' && tab.url) {
    syncCookieStore?.removeCookieData(tabId);

    syncCookieStore?.updateFrameIdSet(
      tabId,
      (await chrome.debugger.getTargets()).filter(
        (target) => target.tabId && target.tabId === tabId
      )[0].id
    );
  }

  try {
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

  try {
    if (globalIsUsingCDP) {
      await attachCDP({ tabId });
    } else {
      await chrome.debugger.detach({ tabId });
    }
  } catch (error) {
    //Fail silently
  }
});

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved
 */
chrome.windows.onRemoved.addListener((windowId) => {
  syncCookieStore?.removeWindowData(windowId);
});

/**
 * Fires when the extension is first installed,
 * when clicked on the extension refresh button from chrome://extensions/
 * when the extension is updated to a new version,
 * when Chrome is updated to a new version.
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onInstalled
 * @todo Shouldn't have to reinstall the extension.
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  syncCookieStore = new SynchnorousCookieStore();
  syncCookieStore?.clear();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // @todo Send tab data of the active tab only, also if sending only the difference would make it any faster.
  setInterval(() => {
    if (Object.keys(syncCookieStore?.tabsData ?? {}).length === 0) {
      return;
    }

    Object.keys(syncCookieStore?.tabsData ?? {}).forEach((key) => {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(Number(key));
    });
  }, 1200);

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
    });
  }

  if (details.reason === 'update') {
    await chrome.storage.local.clear();
    const preSetSettings = await chrome.storage.sync.get();
    tabMode = preSetSettings?.allowedNumberOfTabs ?? 'single';
    globalIsUsingCDP = preSetSettings?.isUsingCDP ?? false;

    if (tabMode === 'unlimited') {
      const allTabs = await chrome.tabs.query({});
      const targets = await chrome.debugger.getTargets();

      allTabs.forEach((tab) => {
        if (!tab.id) {
          return;
        }
        unParsedRequestHeaders[tab.id.toString()] = {};
        unParsedResponseHeaders[tab.id.toString()] = {};
        requestIdToCDPURLMapping[tab.id.toString()] = {};
        auditsIssueForTab[tab.id.toString()] = {};
        initiatorToUrlMap[tab.id.toString()] = {};

        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        syncCookieStore?.addTabData(tab.id);
        syncCookieStore?.updateFrameIdSet(tab.id, currentTab[0].id);
      });
    }

    if (
      preSetSettings?.allowedNumberOfTabs &&
      Object.keys(preSetSettings).includes('isUsingCDP')
    ) {
      return;
    }

    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: false,
    });
  }
});

/**
 * Fires whenever debugging target issues instrumentation event.
 * @see https://developer.chrome.com/docs/extensions/reference/api/debugger
 */
// eslint-disable-next-line complexity
chrome.debugger.onEvent.addListener(async (source, method, params) => {
  if (!ALLOWED_EVENTS.includes(method)) {
    return;
  }

  let tabId = '';
  try {
    const targets = await chrome.debugger.getTargets();

    await Promise.all(
      targets.map(async ({ id }) => {
        await chrome.debugger.attach({ targetId: id }, '1.3');
        await chrome.debugger.sendCommand({ targetId: id }, 'Network.enable');
        await chrome.debugger.sendCommand({ targetId: id }, 'Audits.enable');
        await chrome.debugger.sendCommand({ targetId: id }, 'Page.enable');
      })
    );
  } catch (error) {
    //Fail silently since it gives only one kind of error. Debugger already attached to tabId.
  }

  if (source?.tabId) {
    tabId = source?.tabId?.toString();
  } else if (source.targetId && method !== 'Page.frameAttached') {
    const tab = Object.keys(syncCookieStore?.tabs ?? {}).filter(
      (key) =>
        source.targetId &&
        syncCookieStore?.tabs[Number(key)].frameIdSet.has(source.targetId)
    );
    tabId = tab[0];
  }

  if (method === 'Page.frameAttached' && params) {
    const frameData = params as Protocol.Page.FrameAttachedEvent;
    try {
      await attachCDP({ targetId: frameData.frameId });
    } catch (error) {
      /* empty */
    }

    if (source.tabId) {
      syncCookieStore?.updateFrameIdSet(source.tabId, frameData.frameId);
      await syncCookieStore?.updateFrameIdURLSet(
        source.tabId,
        frameData.frameId
      );
    } else if (source.targetId) {
      Object.keys(syncCookieStore?.tabs ?? {}).forEach(async (key) => {
        if (
          source.targetId &&
          syncCookieStore?.tabs[Number(key)].frameIdSet.has(source.targetId)
        ) {
          syncCookieStore?.tabs[Number(key)].frameIdSet.add(frameData.frameId);
          await syncCookieStore?.updateFrameIdURLSet(
            Number(key),
            frameData.frameId
          );
        }
      });
    }
  }

  if (method === 'Page.frameNavigated' && params) {
    const {
      frame: { parentId = '', id, url },
    } = params as Protocol.Page.FrameNavigatedEvent;

    if (parentId) {
      Object.keys(syncCookieStore?.tabs ?? {}).forEach((key) => {
        if (
          source.targetId &&
          syncCookieStore?.tabs[Number(key)].frameIdSet.has(parentId)
        ) {
          syncCookieStore?.tabs[Number(key)].frameIdSet.add(id);

          if (isValidURL(url)) {
            const parsedUrl = new URL(url).origin;
            if (!syncCookieStore?.tabs[Number(key)].frameIDURLSet[parsedUrl]) {
              syncCookieStore.tabs[Number(key)].frameIDURLSet[parsedUrl] = [];
            }

            syncCookieStore.tabs[Number(key)].frameIDURLSet[parsedUrl] = [
              ...new Set([
                ...syncCookieStore.tabs[Number(key)].frameIDURLSet[parsedUrl],
                id,
              ]),
            ];
          }
        }
      });
    }
  }

  if (!tabId) {
    return;
  }

  const url = syncCookieStore?.getTabUrl(Number(tabId));

  if (tabMode !== 'unlimited' && tabToRead !== tabId) {
    return;
  }

  if (!cookieDB) {
    cookieDB = await fetchDictionary();
  }

  if (method === 'Network.requestWillBeSent' && params) {
    const request = params as Protocol.Network.RequestWillBeSentEvent;
    // To get domain from the request URL if not given in the cookie line.
    if (!requestIdToCDPURLMapping[tabId]) {
      requestIdToCDPURLMapping[tabId] = {
        [request.requestId]: {
          frameId: request?.frameId ?? '',
          url: request?.request?.url,
        },
      };
    } else {
      requestIdToCDPURLMapping[tabId] = {
        ...requestIdToCDPURLMapping[tabId],
        [request.requestId]: {
          frameId: request?.frameId ?? '',
          url: request?.request?.url,
        },
      };
    }

    const initiator = request.initiator.url ?? '';

    if (initiator && isValidURL(initiator)) {
      if (!initiatorToUrlMap[tabId][new URL(initiator).origin]) {
        initiatorToUrlMap[tabId][new URL(initiator).origin] = [];
      }

      initiatorToUrlMap[tabId][new URL(initiator).origin].push(
        request?.request?.url ?? ''
      );

      const gatheredCookies = await fetchFrameResourceAndGetCookies(
        request?.frameId,
        initiatorToUrlMap[tabId][new URL(initiator).origin],
        cookieDB,
        url ?? ''
      );

      syncCookieStore?.update(Number(tabId), gatheredCookies);
    }

    if (unParsedRequestHeaders[tabId][request.requestId]) {
      const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
        unParsedRequestHeaders[tabId][request.requestId].associatedCookies,
        cookieDB ?? {},
        request?.request?.url ?? '',
        url ?? '',
        requestIdToCDPURLMapping[tabId][request.requestId]?.frameId,
        request?.requestId
      );

      if (cookies.length === 0) {
        return;
      }

      syncCookieStore?.update(Number(tabId), cookies);
    }
  }

  if (method === 'Network.requestWillBeSentExtraInfo') {
    const requestParams =
      params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

    const { associatedCookies, requestId } = requestParams;

    if (associatedCookies.length === 0) {
      return;
    }

    if (requestIdToCDPURLMapping[tabId][requestId]) {
      const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
        associatedCookies,
        cookieDB ?? {},
        requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
        url ?? '',
        requestIdToCDPURLMapping[tabId][requestId]?.frameId,
        requestId
      );

      if (cookies.length === 0) {
        return;
      }

      syncCookieStore?.update(Number(tabId), cookies);
      delete unParsedRequestHeaders[tabId][requestParams.requestId];
    } else {
      unParsedRequestHeaders[tabId][requestParams?.requestId] = requestParams;
    }
  }

  if (method === 'Network.responseReceived' && params) {
    const request = params as Protocol.Network.ResponseReceivedEvent;

    // To get domain from the request URL if not given in the cookie line.
    if (!requestIdToCDPURLMapping[tabId]) {
      requestIdToCDPURLMapping[tabId] = {
        [request.requestId]: {
          frameId: request?.frameId ?? '',
          url: request?.response.url,
        },
      };
    } else {
      requestIdToCDPURLMapping[tabId] = {
        ...requestIdToCDPURLMapping[tabId],
        [request.requestId]: {
          frameId: request?.frameId ?? '',
          url: request?.response.url,
        },
      };
    }

    if (unParsedResponseHeaders[tabId][request.requestId]) {
      const {
        headers,
        blockedCookies,
        requestId,
        cookiePartitionKey = '',
      } = unParsedResponseHeaders[tabId][request.requestId];

      const cookies: CookieData[] = parseResponseReceivedExtraInfo(
        headers,
        blockedCookies,
        cookiePartitionKey,
        requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
        url ?? '',
        cookieDB ?? {},
        requestIdToCDPURLMapping[tabId][request.requestId]?.frameId,
        requestId
      );
      syncCookieStore?.update(Number(tabId), cookies);

      delete unParsedRequestHeaders[tabId][request.requestId];
    }

    if (auditsIssueForTab[tabId][request.requestId]) {
      const cookieObjectToUpdate = createCookieFromAuditsIssue(
        auditsIssueForTab[tabId][request.requestId],
        syncCookieStore?.getTabUrl(Number(tabId)) ?? '',
        requestIdToCDPURLMapping[tabId][request.requestId].frameId,
        requestIdToCDPURLMapping[tabId][request.requestId].url,
        cookieDB
      );

      if (cookieObjectToUpdate) {
        syncCookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
      }

      delete auditsIssueForTab[tabId][request.requestId];
    }

    if (!request.hasExtraInfo) {
      delete requestIdToCDPURLMapping[tabId][request.requestId];
    }
  }

  if (method === 'Network.responseReceivedExtraInfo') {
    const responseParams =
      params as Protocol.Network.ResponseReceivedExtraInfoEvent;

    const {
      headers,
      blockedCookies,
      requestId,
      cookiePartitionKey = '',
    } = responseParams;

    // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
    if (!headers['set-cookie'] && !headers['Set-Cookie']) {
      return;
    }

    if (requestIdToCDPURLMapping[tabId][responseParams?.requestId]) {
      const cookies: CookieData[] = parseResponseReceivedExtraInfo(
        headers,
        blockedCookies,
        cookiePartitionKey,
        requestIdToCDPURLMapping[tabId][responseParams?.requestId]?.url ?? '',
        url ?? '',
        cookieDB ?? {},
        requestIdToCDPURLMapping[tabId][responseParams?.requestId]?.frameId,
        requestId
      );

      syncCookieStore?.update(Number(tabId), cookies);

      delete unParsedRequestHeaders[tabId][responseParams?.requestId];
      delete requestIdToCDPURLMapping[tabId][responseParams?.requestId];
    } else {
      unParsedResponseHeaders[tabId][responseParams?.requestId] =
        responseParams;
    }
  }

  if (method === 'Audits.issueAdded' && params) {
    const auditParams = params as Protocol.Audits.IssueAddedEvent;
    const { code, details } = auditParams.issue;
    if (code !== 'CookieIssue' && !details.cookieIssueDetails) {
      return;
    }

    if (
      !details.cookieIssueDetails?.cookie ||
      !details.cookieIssueDetails?.cookieWarningReasons ||
      !details.cookieIssueDetails?.cookieExclusionReasons ||
      !details.cookieIssueDetails?.request
    ) {
      return;
    }

    //@ts-ignore -- because this has been checked above
    const { requestId = '' } = details.cookieIssueDetails.request;

    if (requestId && requestIdToCDPURLMapping[tabId][requestId]) {
      const cookieObjectToUpdate = createCookieFromAuditsIssue(
        details.cookieIssueDetails,
        syncCookieStore?.getTabUrl(Number(tabId)) ?? '',
        requestIdToCDPURLMapping[tabId][requestId].frameId,
        requestIdToCDPURLMapping[tabId][requestId].url,
        cookieDB
      );

      if (cookieObjectToUpdate) {
        syncCookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
      }
    } else {
      auditsIssueForTab[tabId][requestId] = details.cookieIssueDetails;
    }
  }
});

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();
  tabId;

  if (!newTabId) {
    return '';
  }

  if (tabMode && tabMode !== 'unlimited') {
    const storedTabData = Object.keys(syncCookieStore?.tabsData ?? {});

    await Promise.all(
      storedTabData.map(async (tabIdToDelete) => {
        syncCookieStore?.removeTabData(Number(tabIdToDelete));
        try {
          await chrome.action.setBadgeText({
            tabId: Number(tabIdToDelete),
            text: '',
          });
          await chrome.debugger.detach({ tabId: Number(tabIdToDelete) });
        } catch (error) {
          // Fail silently
        }
        return tabIdToDelete;
      })
    );
  }

  tabToRead = newTabId;

  unParsedRequestHeaders[newTabId] = {};
  unParsedResponseHeaders[newTabId] = {};
  requestIdToCDPURLMapping[newTabId] = {};
  auditsIssueForTab[newTabId] = {};
  initiatorToUrlMap[newTabId] = {};

  syncCookieStore?.addTabData(Number(newTabId));
  syncCookieStore?.updateDevToolsState(Number(newTabId), true);
  syncCookieStore?.updatePopUpState(Number(newTabId), true);

  const currentTab = await getTab(Number(newTabId));

  syncCookieStore?.updateUrl(Number(newTabId), currentTab?.url ?? '');

  return newTabId;
};

/**
 * Fires when a message is sent from either an extension process (by runtime.sendMessage) or a content script (by tabs.sendMessage).
 * @see https://developer.chrome.com/docs/extensions/reference/api/runtime#event-onMessage
 */
// eslint-disable-next-line complexity
chrome.runtime.onMessage.addListener(async (request) => {
  if (!request.type) {
    return;
  }

  const incomingMessageType = request.type;

  if (SET_TAB_TO_READ === incomingMessageType) {
    tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    chrome.runtime.sendMessage({
      type: SET_TAB_TO_READ,
      payload: {
        tabId: Number(newTab),
      },
    });

    if (globalIsUsingCDP) {
      await chrome.debugger.attach({ tabId: Number(newTab) }, '1.3');
      await chrome.debugger.sendCommand(
        { tabId: Number(newTab) },
        'Network.enable'
      );
      await chrome.debugger.sendCommand(
        { tabId: Number(newTab) },
        'Audits.enable'
      );
    }

    await reloadCurrentTab(Number(newTab));
  }

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
      tabMode = sessionStorage.allowedNumberOfTabs;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      globalIsUsingCDP = sessionStorage.isUsingCDP;
    }

    await chrome.storage.session.remove(['allowedNumberOfTabs', 'isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      allowedNumberOfTabs: tabMode,
      isUsingCDP: globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();
    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }

        if (tabMode === 'unlimited') {
          unParsedRequestHeaders[id.toString()] = {};
          unParsedResponseHeaders[id.toString()] = {};
          requestIdToCDPURLMapping[id.toString()] = {};
          auditsIssueForTab[id.toString()] = {};
          initiatorToUrlMap[id.toString()] = {};

          const currentTab = targets.filter(
            ({ tabId }) => tabId && id && tabId === id
          );
          syncCookieStore?.addTabData(id);
          syncCookieStore?.updateFrameIdSet(id, currentTab[0].id);
        }

        await reloadCurrentTab(id);
      })
    );

    await chrome.runtime.sendMessage({
      type: SERVICE_WORKER_RELOAD_MESSAGE,
    });
  }

  if (!request?.payload?.tabId) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId;

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }

    chrome.runtime.sendMessage({
      type: INITIAL_SYNC,
      payload: dataToSend,
    });

    if (
      !syncCookieStore?.tabs[incomingMessageTabId] &&
      tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(incomingMessageTabId);

      syncCookieStore?.addTabData(incomingMessageTabId);
      syncCookieStore?.updateUrl(incomingMessageTabId, currentTab?.url || '');
    }

    syncCookieStore?.updateDevToolsState(incomingMessageTabId, true);

    if (syncCookieStore?.tabsData[incomingMessageTabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (POPUP_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }

    chrome.runtime.sendMessage({
      type: INITIAL_SYNC,
      payload: dataToSend,
    });

    syncCookieStore?.updatePopUpState(incomingMessageTabId, true);

    if (syncCookieStore?.tabsData[incomingMessageTabId]) {
      syncCookieStore?.sendUpdatedDataToPopupAndDevTools(
        incomingMessageTabId,
        true
      );
    }
  }

  if (DEVTOOLS_CLOSE === incomingMessageType) {
    syncCookieStore?.updateDevToolsState(incomingMessageTabId, false);
  }

  if (POPUP_CLOSE === incomingMessageType) {
    syncCookieStore?.updatePopUpState(incomingMessageTabId, false);
  }

  if (DEVTOOLS_SET_JAVASCSCRIPT_COOKIE === incomingMessageType) {
    syncCookieStore?.update(incomingMessageTabId, request?.payload?.cookieData);
  }
});

/**
 * Fires when the browser window is opened.
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onCreated
 */
chrome.windows.onCreated.addListener(async () => {
  const totalWindows = await chrome.windows.getAll();

  // @see https://developer.chrome.com/blog/longer-esw-lifetimes#whats_changed
  // Doing this to keep the service worker alive so that we dont loose any data and introduce any bug.
  setInterval(() => {
    chrome.storage.local.get();
  }, 28000);

  // We do not want to clear content settings if a user has create one more window.
  if (totalWindows.length < 2) {
    chrome.contentSettings.cookies.clear({});
  }
});

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.allowedNumberOfTabs ||
      !changes?.allowedNumberOfTabs?.newValue ||
      !changes?.allowedNumberOfTabs?.oldValue
    ) {
      return;
    }
    tabMode = changes.allowedNumberOfTabs.newValue;

    const tabs = await chrome.tabs.query({});

    if (changes?.allowedNumberOfTabs?.newValue === 'single') {
      tabToRead = '';

      chrome.runtime.sendMessage({
        type: INITIAL_SYNC,
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });
    } else {
      chrome.runtime.sendMessage({
        type: INITIAL_SYNC,
        payload: {
          tabMode,
          tabToRead: tabToRead,
        },
      });

      tabs.forEach((tab) => {
        if (!tab?.id) {
          return;
        }
        syncCookieStore?.addTabData(tab.id);
        syncCookieStore?.sendUpdatedDataToPopupAndDevTools(tab.id);
        syncCookieStore?.updateDevToolsState(tab.id, true);
      });
    }
  }
);

chrome.storage.sync.onChanged.addListener(
  async (changes: { [key: string]: chrome.storage.StorageChange }) => {
    if (
      !changes?.isUsingCDP ||
      typeof changes?.isUsingCDP?.newValue === 'undefined' ||
      typeof changes?.isUsingCDP?.oldValue === 'undefined'
    ) {
      return;
    }

    globalIsUsingCDP = changes?.isUsingCDP?.newValue;

    const tabs = await chrome.tabs.query({});

    if (!changes?.isUsingCDP?.newValue) {
      await Promise.all(
        tabs.map(async ({ id }) => {
          if (!id) {
            return;
          }

          try {
            await chrome.debugger.detach({ tabId: id });
            syncCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.warn(error);
          }
        })
      );
    }
  }
);
