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
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  DEVTOOLS_SET_JAVASCSCRIPT_COOKIE,
  INITIAL_SYNC,
  POPUP_CLOSE,
  POPUP_OPEN,
  SERVICE_WORKER_RELOAD_MESSAGE,
  SERVICE_WORKER_TABS_RELOAD_COMMAND,
  SET_TAB_TO_READ,
} from '../constants';
import syncCookieStore from '../store/synchnorousCookieStore';
import { getTab } from '../utils/getTab';
import reloadCurrentTab from '../utils/reloadCurrentTab';
import createCookieFromAuditsIssue from '../utils/createCookieFromAuditsIssue';
import attachCDP from './attachCDP';
import resetCookieBadgeText from '../store/utils/resetCookieBadgeText';
import parseNetworkCookies from '../utils/parseNetworkCookies';
import './chromeListeners';

let cookieDB: CookieDatabase | null = null;

const ALLOWED_EVENTS = [
  'Network.responseReceived',
  'Network.requestWillBeSentExtraInfo',
  'Network.responseReceivedExtraInfo',
  'Audits.issueAdded',
  'Network.requestWillBeSent',
  'Page.frameAttached',
  'Page.frameNavigated',
  'Target.attachedToTarget',
];

/**
 * Fires whenever debugging target issues instrumentation event.
 * @see https://developer.chrome.com/docs/extensions/reference/api/debugger
 */
chrome.debugger.onEvent.addListener((source, method, params) => {
  // eslint-disable-next-line complexity
  (async () => {
    try {
      if (!ALLOWED_EVENTS.includes(method)) {
        return;
      }

      let targets = await chrome.debugger.getTargets();
      await Promise.all(
        targets.map(async ({ id, url }) => {
          if (url.startsWith('http')) {
            await attachCDP({ targetId: id });
          }
        })
      );

      let tabId = '';
      // This is to get a list of all targets being attached to the main frame.
      if (method === 'Target.attachedToTarget' && params) {
        const {
          targetInfo: { targetId },
        } = params as Protocol.Target.AttachedToTargetEvent;

        await attachCDP({ targetId });
        return;
      }

      //If we get the tabId from source.tabId the we use it else we parse the tabsData and find the parentId in the frameIdSet and return the tabId.
      if (source?.tabId) {
        tabId = source?.tabId?.toString();
      } else if (source.targetId) {
        const tab = Object.keys(syncCookieStore?.tabs ?? {}).filter(
          (key) =>
            source.targetId &&
            syncCookieStore?.getFrameIDSet(Number(key))?.has(source.targetId)
        );
        tabId = tab[0];
      }

      // Using Page.frameAttached and Page.frameNavigated we will find the tabId using the frameId because in certain events source.tabId is missing and source.targetId is availale.
      if (method === 'Page.frameAttached' && params) {
        const { frameId, parentFrameId } =
          params as Protocol.Page.FrameAttachedEvent;

        await attachCDP({ targetId: frameId });

        if (source.tabId) {
          syncCookieStore?.updateParentChildFrameAssociation(
            source.tabId,
            frameId,
            parentFrameId
          );
          await syncCookieStore?.updateFrameIdURLSet(source.tabId, frameId);
        } else {
          await Promise.all(
            Object.keys(syncCookieStore?.tabs ?? {}).map(async (key) => {
              const currentTabFrameIdSet = syncCookieStore?.getFrameIDSet(
                Number(key)
              );

              if (
                source.targetId &&
                currentTabFrameIdSet &&
                currentTabFrameIdSet.has(source.targetId)
              ) {
                syncCookieStore?.updateParentChildFrameAssociation(
                  Number(key),
                  frameId,
                  parentFrameId
                );
                await syncCookieStore?.updateFrameIdURLSet(
                  Number(key),
                  frameId
                );
              }
              return key;
            })
          );
        }
        return;
      }

      //Some times we get frames here which we dont get in the extension, which is mostly because of frame Navigation we collect the data and send it to the extension.
      if (method === 'Page.frameNavigated' && params) {
        const {
          frame: { parentId = '', id, url: frameUrl },
        } = params as Protocol.Page.FrameNavigatedEvent;

        if (!parentId) {
          return;
        }

        if (source.tabId) {
          syncCookieStore?.updateParentChildFrameAssociation(
            source.tabId,
            id,
            parentId
          );
          await syncCookieStore?.updateFrameIdURLSet(source.tabId, id);
        } else {
          Object.keys(syncCookieStore?.tabs ?? {}).forEach((key) => {
            const currentTabFrameIdSet = syncCookieStore?.getFrameIDSet(
              Number(key)
            );
            if (currentTabFrameIdSet && currentTabFrameIdSet.has(parentId)) {
              syncCookieStore?.updateParentChildFrameAssociation(
                Number(key),
                id,
                parentId
              );
              syncCookieStore?.updateFrameIdURLSet(Number(key), id, frameUrl);
            }
          });
        }
      }

      const url = syncCookieStore?.getTabUrl(Number(tabId));

      if (
        syncCookieStore.tabMode !== 'unlimited' &&
        syncCookieStore.tabToRead !== tabId
      ) {
        return;
      }

      if (!cookieDB) {
        cookieDB = await fetchDictionary();
      }

      //If we get requestWillBeSent before requestWillBeSentExtraInfo then we add the frame if to the object.
      // If we get requestWillBeSent afterwards then we will remove the add the frameId and then process the requestWillBeSentExtraInfo.
      if (method === 'Network.requestWillBeSent' && params) {
        const {
          requestId,
          request: { url: requestUrl },
          frameId = '',
        } = params as Protocol.Network.RequestWillBeSentEvent;

        let finalFrameId = frameId;

        if (!finalFrameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        if (
          setTargets.has(frameId) &&
          !syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]
        ) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId] = new Set();
          attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
            requestUrl
          );
        } else {
          const ancestorFrameId = syncCookieStore.findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
              requestUrl
            );
            finalFrameId = ancestorFrameId;
          }
        }

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        }

        if (syncCookieStore.unParsedRequestHeaders[tabId][requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            syncCookieStore.unParsedRequestHeaders[tabId][requestId]
              .associatedCookies,
            cookieDB ?? {},
            requestUrl,
            url ?? '',
            Array.from(new Set([finalFrameId, frameId])),
            requestId
          );

          if (cookies.length === 0) {
            return;
          }

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedRequestHeaders[tabId][requestId];
        }
        return;
      }

      if (method === 'Network.requestWillBeSentExtraInfo') {
        const { associatedCookies, requestId } =
          params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

        if (associatedCookies.length === 0) {
          return;
        }

        if (syncCookieStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            associatedCookies,
            cookieDB ?? {},
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url ??
              '',
            url ?? '',
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );

          if (cookies.length === 0) {
            return;
          }

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedRequestHeaders[tabId][requestId];
        } else {
          syncCookieStore.unParsedRequestHeaders[tabId][requestId] =
            params as Protocol.Network.RequestWillBeSentExtraInfoEvent;
        }
        return;
      }

      //If we get responseReceived before responseReceivedExtraInfo then we add the frame if to the object.
      // If we get responseReceived afterwards then we will remove the add the frameId and then process the responseReceivedExtraInfo.
      //Here if we get the audits before we get the frameId then we will add the audits to auditsIssueForTab else we will process the audits and delete it from the auditsIssueForTab.
      if (method === 'Network.responseReceived' && params) {
        const {
          frameId = '',
          requestId,
          response: { url: requestUrl },
        } = params as Protocol.Network.ResponseReceivedEvent;

        let finalFrameId = frameId;

        if (!frameId) {
          return;
        }

        targets = await chrome.debugger.getTargets();
        const setTargets = new Set<string>();

        targets.map(({ id }) => {
          setTargets.add(id);
          return id;
        });

        if (
          setTargets.has(finalFrameId) &&
          !syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]
        ) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId] = new Set();
          attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
            requestUrl
          );
        } else {
          const ancestorFrameId = syncCookieStore.findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            syncCookieStore.frameIdToResourceMap[tabId][finalFrameId]?.add(
              requestUrl
            );
            finalFrameId = ancestorFrameId;
          }
        }

        if (!syncCookieStore.requestIdToCDPURLMapping[tabId]) {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              ...syncCookieStore.requestIdToCDPURLMapping[tabId][requestId],
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          syncCookieStore.requestIdToCDPURLMapping[tabId] = {
            ...syncCookieStore.requestIdToCDPURLMapping[tabId],
            [requestId]: {
              ...syncCookieStore.requestIdToCDPURLMapping[tabId][requestId],
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        }

        if (syncCookieStore.unParsedResponseHeaders[tabId][requestId]) {
          const {
            headers,
            blockedCookies,
            cookiePartitionKey = '',
            exemptedCookies,
          } = syncCookieStore.unParsedResponseHeaders[tabId][requestId];

          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url ??
              '',
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );
          syncCookieStore?.update(Number(tabId), cookies);

          delete syncCookieStore.unParsedResponseHeaders[tabId][requestId];
        }
        return;
      }

      if (method === 'Network.responseReceivedExtraInfo') {
        const {
          headers,
          blockedCookies,
          requestId,
          cookiePartitionKey = '',
          exemptedCookies = [],
        } = params as Protocol.Network.ResponseReceivedExtraInfoEvent;

        // Sometimes CDP gives "set-cookie" and sometimes it gives "Set-Cookie".
        if (!headers['set-cookie'] && !headers['Set-Cookie']) {
          return;
        }

        if (syncCookieStore.requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url,
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.finalFrameId,
                syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]
                  ?.frameId,
              ])
            ),
            requestId
          );

          syncCookieStore?.update(Number(tabId), cookies);
          delete syncCookieStore.unParsedResponseHeaders[tabId][requestId];
        } else {
          syncCookieStore.unParsedResponseHeaders[tabId][requestId] =
            params as Protocol.Network.ResponseReceivedExtraInfoEvent;
        }
        return;
      }

      if (method === 'Audits.issueAdded' && params) {
        const auditParams = params as Protocol.Audits.IssueAddedEvent;
        const {
          code,
          details: { cookieIssueDetails },
        } = auditParams.issue;

        if (code !== 'CookieIssue' && !cookieIssueDetails) {
          return;
        }

        if (
          !cookieIssueDetails?.cookie ||
          !cookieIssueDetails?.cookieWarningReasons ||
          !cookieIssueDetails?.cookieExclusionReasons ||
          !cookieIssueDetails?.request
        ) {
          return;
        }

        const { requestId = '', url: requestUrl = '' } =
          cookieIssueDetails.request;

        if (!requestId || !requestUrl) {
          return;
        }

        const cookieObjectToUpdate = createCookieFromAuditsIssue(
          cookieIssueDetails,
          syncCookieStore?.getTabUrl(Number(tabId)) ?? '',
          [],
          syncCookieStore.requestIdToCDPURLMapping[tabId][requestId]?.url,
          cookieDB ?? {}
        );

        if (cookieObjectToUpdate) {
          syncCookieStore?.update(Number(tabId), [cookieObjectToUpdate]);
        }
        return;
      }
    } catch (error) {
      //Fail silently.
    }
  })();
});

const listenToNewTab = async (tabId?: number) => {
  const newTabId =
    tabId?.toString() || chrome.devtools.inspectedWindow.tabId.toString();
  tabId;

  if (!newTabId) {
    return '';
  }

  if (syncCookieStore.tabMode && syncCookieStore.tabMode !== 'unlimited') {
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

  syncCookieStore.tabToRead = newTabId;

  syncCookieStore.initialiseVariablesForNewTab(newTabId);

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
    syncCookieStore.tabToRead = request?.payload?.tabId?.toString();
    const newTab = await listenToNewTab(request?.payload?.tabId);
    // Can't use sendResponse as delay is too long. So using sendMessage instead.
    chrome.runtime.sendMessage({
      type: SET_TAB_TO_READ,
      payload: {
        tabId: Number(newTab),
      },
    });

    if (syncCookieStore.globalIsUsingCDP) {
      try {
        await attachCDP({ tabId: Number(newTab) });
      } catch (error) {
        //Fail silently
      }
    }

    await reloadCurrentTab(Number(newTab));
  }

  if (SERVICE_WORKER_TABS_RELOAD_COMMAND === incomingMessageType) {
    const sessionStorage = await chrome.storage.session.get();
    if (Object.keys(sessionStorage).includes('allowedNumberOfTabs')) {
      syncCookieStore.tabMode = sessionStorage.allowedNumberOfTabs;
    }

    if (Object.keys(sessionStorage).includes('isUsingCDP')) {
      syncCookieStore.globalIsUsingCDP = sessionStorage.isUsingCDP;
    }

    await chrome.storage.session.remove(['allowedNumberOfTabs', 'isUsingCDP']);

    await chrome.storage.session.set({
      pendingReload: false,
    });

    await chrome.storage.sync.set({
      allowedNumberOfTabs: syncCookieStore.tabMode,
      isUsingCDP: syncCookieStore.globalIsUsingCDP,
    });

    const tabs = await chrome.tabs.query({});
    const targets = await chrome.debugger.getTargets();
    await Promise.all(
      tabs.map(async ({ id }) => {
        if (!id) {
          return;
        }

        if (syncCookieStore.tabMode === 'unlimited') {
          syncCookieStore.initialiseVariablesForNewTab(id.toString());

          const currentTab = targets.filter(
            ({ tabId }) => tabId && id && tabId === id
          );
          syncCookieStore?.addTabData(id);
          syncCookieStore?.updateParentChildFrameAssociation(
            id,
            currentTab[0].id,
            '0'
          );
        }
        try {
          if (syncCookieStore.globalIsUsingCDP) {
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

    await chrome.runtime.sendMessage({
      type: SERVICE_WORKER_RELOAD_MESSAGE,
    });
  }

  if (!request?.payload?.tabId) {
    return;
  }

  const incomingMessageTabId = request.payload.tabId;

  if ('GET_REST_DATA_FROM_URL' === incomingMessageType) {
    let allCookies: CookieData[] = [];
    await Promise.all(
      Object.entries(
        syncCookieStore.frameIdToResourceMap[incomingMessageTabId] ?? {}
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
            syncCookieStore?.getTabUrl(incomingMessageTabId) ?? '',
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

    syncCookieStore?.update(Number(incomingMessageTabId), allCookies);
  }

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string | boolean } = {};
    dataToSend['tabMode'] = syncCookieStore.tabMode;

    if (syncCookieStore.tabMode === 'single') {
      dataToSend['tabToRead'] = syncCookieStore.tabToRead;
    }

    if (
      !syncCookieStore?.tabs[incomingMessageTabId] &&
      syncCookieStore.tabMode === 'unlimited'
    ) {
      const currentTab = await getTab(incomingMessageTabId);
      dataToSend['psatOpenedAfterPageLoad'] = request.payload.doNotReReload
        ? false
        : true;
      syncCookieStore?.addTabData(incomingMessageTabId);
      syncCookieStore?.updateUrl(incomingMessageTabId, currentTab?.url || '');
    }

    chrome.runtime.sendMessage({
      type: INITIAL_SYNC,
      payload: dataToSend,
    });

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
    dataToSend['tabMode'] = syncCookieStore.tabMode;

    if (syncCookieStore.tabMode === 'single') {
      dataToSend['tabToRead'] = syncCookieStore.tabToRead;
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
    syncCookieStore.tabMode = changes.allowedNumberOfTabs.newValue;

    const tabs = await chrome.tabs.query({});

    if (changes?.allowedNumberOfTabs?.newValue === 'single') {
      syncCookieStore.tabToRead = '';
      try {
        await chrome.runtime.sendMessage({
          type: INITIAL_SYNC,
          payload: {
            tabMode: syncCookieStore.tabMode,
            tabToRead: syncCookieStore.tabToRead,
          },
        });
      } catch (error) {
        //Fail silently
      }

      tabs.map((tab) => {
        if (!tab?.id) {
          return tab;
        }

        resetCookieBadgeText(tab.id);

        syncCookieStore?.removeTabData(tab.id);

        return tab;
      });
    } else {
      try {
        await chrome.runtime.sendMessage({
          type: INITIAL_SYNC,
          payload: {
            tabMode: syncCookieStore.tabMode,
            tabToRead: syncCookieStore.tabToRead,
          },
        });
      } catch (error) {
        //Fail silently
      }

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

    syncCookieStore.globalIsUsingCDP = changes?.isUsingCDP?.newValue;

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
    } else {
      tabs.forEach(({ id }) => {
        if (!id) {
          return;
        }

        syncCookieStore?.sendUpdatedDataToPopupAndDevTools(id);
      });
    }
  }
);
