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
import resetCookieBadgeText from '../store/utils/resetCookieBadgeText';
import parseNetworkCookies from '../utils/parseNetworkCookies';

let cookieDB: CookieDatabase | null = null;
let syncCookieStore: SynchnorousCookieStore | undefined;

const requestIdToCDPURLMapping: {
  [tabId: string]: {
    [requestId: string]: {
      frameId: string;
      url: string;
      finalFrameId: string;
    };
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

const frameIdToResourceMap: {
  [tabId: string]: {
    [frameId: string]: Set<string>;
  };
} = {};

let tabMode: 'single' | 'unlimited' = 'single';
let tabToRead = '';
let globalIsUsingCDP = true;

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
 * This function will initialise variables for given tab.
 * @param {string} tabId The tab whose data has to be initialised.
 */
function initialiseVariablesForNewTab(tabId: string) {
  unParsedRequestHeaders[tabId] = {};
  unParsedResponseHeaders[tabId] = {};
  requestIdToCDPURLMapping[tabId] = {};
  frameIdToResourceMap[tabId] = {};
  //@ts-ignore
  globalThis.PSATAdditionalData = {
    unParsedRequestHeaders,
    unParsedResponseHeaders,
    requestIdToCDPURLMapping,
    frameIdToResourceMap,
  };
}

/**
 * This function will deinitialise variables for given tab.
 * @param {string} tabId The tab whose data has to be deinitialised.
 */
function deinitialiseVariablesForTab(tabId: string) {
  delete unParsedRequestHeaders[tabId];
  delete unParsedResponseHeaders[tabId];
  delete requestIdToCDPURLMapping[tabId];
  delete frameIdToResourceMap[tabId];
}

/**
 * This function will deinitialise variables for given tab.
 * @param {string} tabId The tab whose data has to be deinitialised.
 * @param frameId The tab whose data has to be deinitialised.
 * @param targetSet The tab whose data has to be deinitialised.
 * @returns {string | null} The first ancestor frameId.
 */
function findFirstAncestorFrameId(
  tabId: string,
  frameId: string,
  targetSet: Set<string>
) {
  if (targetSet.has(frameId)) {
    return frameId;
  } else {
    if (
      syncCookieStore?.tabs[Number(tabId)]?.parentChildFrameAssociation[frameId]
    ) {
      return findFirstAncestorFrameId(
        tabId,
        syncCookieStore?.tabs[Number(tabId)]?.parentChildFrameAssociation[
          frameId
        ],
        targetSet
      );
    }
    return null;
  }
}
/**
 * Fires when a tab is created.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onCreated
 */
chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.id) {
    return;
  }

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

    initialiseVariablesForNewTab(tab.id.toString());

    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    syncCookieStore.updateParentChildFrameAssociation(
      tab.id,
      currentTab[0].id,
      '0'
    );
  } else {
    syncCookieStore?.addTabData(tab.id);
    const currentTab = targets.filter(
      ({ tabId }) => tabId && tab.id && tabId === tab.id
    );

    initialiseVariablesForNewTab(tab.id.toString());

    syncCookieStore.updateParentChildFrameAssociation(
      tab.id,
      currentTab[0].id,
      '0'
    );
  }
});

/**
 * Fires when a tab is closed.
 * @see https://developer.chrome.com/docs/extensions/reference/api/tabs#event-onRemoved
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  deinitialiseVariablesForTab(tabId.toString());

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

  if (!cookieDB) {
    cookieDB = await fetchDictionary();
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
    deinitialiseVariablesForTab(tabId.toString());
    initialiseVariablesForNewTab(tabId.toString());

    syncCookieStore?.updateParentChildFrameAssociation(
      tabId,
      (await chrome.debugger.getTargets()).filter(
        (target) => target.tabId && target.tabId === tabId
      )[0].id,
      '0'
    );
  }
  try {
    if (globalIsUsingCDP) {
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

/**
 * Fires when a window is removed (closed).
 * @see https://developer.chrome.com/docs/extensions/reference/api/windows#event-onRemoved
 */
chrome.windows.onRemoved.addListener((windowId) => {
  chrome.tabs.query({ windowId }, (tabs) => {
    tabs.map((tab) => {
      if (tab.id) {
        deinitialiseVariablesForTab(tab.id.toString());
      }
      return tab;
    });
  });

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

  if (!cookieDB) {
    cookieDB = await fetchDictionary();
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

  if (details.reason === 'install') {
    await chrome.storage.sync.clear();
    await chrome.storage.sync.set({
      allowedNumberOfTabs: 'single',
      isUsingCDP: true,
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

        initialiseVariablesForNewTab(tab.id.toString());

        const currentTab = targets.filter(
          ({ tabId }) => tabId && tab.id && tabId === tab.id
        );
        syncCookieStore?.addTabData(tab.id);
        syncCookieStore?.updateParentChildFrameAssociation(
          tab.id,
          currentTab[0].id,
          '0'
        );
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
      isUsingCDP: true,
    });
  }
});

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

      targets.map(async ({ id, url }) => {
        if (url.startsWith('http')) {
          await attachCDP({ targetId: id });
        }
      });

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

      if (tabMode !== 'unlimited' && tabToRead !== tabId) {
        return;
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
          !frameIdToResourceMap[tabId][finalFrameId]
        ) {
          frameIdToResourceMap[tabId][finalFrameId] = new Set();
          attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          frameIdToResourceMap[tabId][finalFrameId]?.add(requestUrl);
        } else {
          const ancestorFrameId = findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            frameIdToResourceMap[tabId][finalFrameId]?.add(requestUrl);
            finalFrameId = ancestorFrameId;
          }
        }

        if (!requestIdToCDPURLMapping[tabId]) {
          requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              frameId,
              finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          requestIdToCDPURLMapping[tabId] = {
            ...requestIdToCDPURLMapping[tabId],
            [requestId]: {
              finalFrameId,
              frameId,
              url: requestUrl,
            },
          };
        }

        if (unParsedRequestHeaders[tabId][requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            unParsedRequestHeaders[tabId][requestId].associatedCookies,
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
          delete unParsedRequestHeaders[tabId][requestId];
        }
        return;
      }

      if (method === 'Network.requestWillBeSentExtraInfo') {
        const { associatedCookies, requestId } =
          params as Protocol.Network.RequestWillBeSentExtraInfoEvent;

        if (associatedCookies.length === 0) {
          return;
        }

        if (requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseRequestWillBeSentExtraInfo(
            associatedCookies,
            cookieDB ?? {},
            requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
            url ?? '',
            Array.from(
              new Set([
                requestIdToCDPURLMapping[tabId][requestId]?.finalFrameId,
                requestIdToCDPURLMapping[tabId][requestId]?.frameId,
              ])
            ),
            requestId
          );

          if (cookies.length === 0) {
            return;
          }

          syncCookieStore?.update(Number(tabId), cookies);
          delete unParsedRequestHeaders[tabId][requestId];
        } else {
          unParsedRequestHeaders[tabId][requestId] =
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
          !frameIdToResourceMap[tabId][finalFrameId]
        ) {
          frameIdToResourceMap[tabId][finalFrameId] = new Set();
          attachCDP({ targetId: finalFrameId });
        }

        if (setTargets.has(finalFrameId)) {
          frameIdToResourceMap[tabId][finalFrameId]?.add(requestUrl);
        } else {
          const ancestorFrameId = findFirstAncestorFrameId(
            tabId,
            finalFrameId,
            setTargets
          );

          if (ancestorFrameId) {
            frameIdToResourceMap[tabId][finalFrameId]?.add(requestUrl);
            finalFrameId = ancestorFrameId;
          }
        }

        if (!requestIdToCDPURLMapping[tabId]) {
          requestIdToCDPURLMapping[tabId] = {
            [requestId]: {
              ...requestIdToCDPURLMapping[tabId][requestId],
              frameId: finalFrameId,
              url: requestUrl,
            },
          };
        } else {
          requestIdToCDPURLMapping[tabId] = {
            ...requestIdToCDPURLMapping[tabId],
            [requestId]: {
              ...requestIdToCDPURLMapping[tabId][requestId],
              frameId: finalFrameId,
              url: requestUrl,
            },
          };
        }

        if (unParsedResponseHeaders[tabId][requestId]) {
          const {
            headers,
            blockedCookies,
            cookiePartitionKey = '',
            exemptedCookies,
          } = unParsedResponseHeaders[tabId][requestId];

          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            requestIdToCDPURLMapping[tabId][requestId]?.url ?? '',
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                requestIdToCDPURLMapping[tabId][requestId]?.finalFrameId,
                requestIdToCDPURLMapping[tabId][requestId]?.frameId,
              ])
            ),
            requestId
          );
          syncCookieStore?.update(Number(tabId), cookies);

          delete unParsedResponseHeaders[tabId][requestId];
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

        if (requestIdToCDPURLMapping[tabId]?.[requestId]) {
          const cookies: CookieData[] = parseResponseReceivedExtraInfo(
            headers,
            blockedCookies,
            exemptedCookies,
            cookiePartitionKey,
            requestIdToCDPURLMapping[tabId][requestId]?.url,
            url ?? '',
            cookieDB ?? {},
            Array.from(
              new Set([
                requestIdToCDPURLMapping[tabId][requestId]?.finalFrameId,
                requestIdToCDPURLMapping[tabId][requestId]?.frameId,
              ])
            ),
            requestId
          );

          syncCookieStore?.update(Number(tabId), cookies);
          delete unParsedResponseHeaders[tabId][requestId];
        } else {
          unParsedResponseHeaders[tabId][requestId] =
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
          requestIdToCDPURLMapping[tabId][requestId]?.url,
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

  initialiseVariablesForNewTab(newTabId);

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
          initialiseVariablesForNewTab(id.toString());

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
          if (globalIsUsingCDP) {
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
      Object.entries(frameIdToResourceMap[incomingMessageTabId]).map(
        async ([key, value]) => {
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
        }
      )
    );

    syncCookieStore?.update(Number(incomingMessageTabId), allCookies);
  }

  if (DEVTOOLS_OPEN === incomingMessageType) {
    const dataToSend: { [key: string]: string | boolean } = {};
    dataToSend['tabMode'] = tabMode;

    if (tabMode === 'single') {
      dataToSend['tabToRead'] = tabToRead;
    }

    if (
      !syncCookieStore?.tabs[incomingMessageTabId] &&
      tabMode === 'unlimited'
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
      try {
        await chrome.runtime.sendMessage({
          type: INITIAL_SYNC,
          payload: {
            tabMode,
            tabToRead: tabToRead,
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
            tabMode,
            tabToRead: tabToRead,
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
