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
import { createContext } from 'use-context-selector';
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { noop } from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import useContextSelector from '../../../../utils/useContextSelector';
import { CookieStore, type CookieData } from '../../../../localStore';
import { getCurrentTabId } from '../../../../utils/getCurrentTabId';
import { ALLOWED_NUMBER_OF_TABS } from '../../../../constants';
import setDocumentCookies from '../../../../utils/setDocumentCookies';
import isOnRWS from '../../../../contentScript/utils/isOnRWS';
import getValueForLocalStorageAndCookieSet from '../../../../utils/getValueForLocalStorageAndCookieSet';

export interface CookieStoreContext {
  state: {
    tabCookies: TabCookies | null;
    tabUrl: string | null;
    loading: boolean;
    tabFrames: TabFrames | null;
    selectedFrame: string | null;
    returningToSingleTab: boolean;
    isCurrentTabBeingListenedTo: boolean;
    allowedNumberOfTabs: string | null;
    isInspecting: boolean;
    contextInvalidated: boolean;
    canStartInspecting: boolean;
  };
  actions: {
    deleteCookie: (cookieName: string) => void;
    deleteAllCookies: () => void;
    modifyCookie: (
      cookieName: string,
      keyToChange: string,
      changedValue: string | boolean,
      previousValue: string | null
    ) => boolean | Promise<boolean | null>;
    setSelectedFrame: (key: string | null) => void;
    setIsInspecting: React.Dispatch<React.SetStateAction<boolean>>;
    changeListeningToThisTab: () => void;
    getCookiesSetByJavascript: () => void;
    setContextInvalidated: React.Dispatch<React.SetStateAction<boolean>>;
    setCanStartInspecting: React.Dispatch<React.SetStateAction<boolean>>;
  };
}

const initialState: CookieStoreContext = {
  state: {
    tabCookies: null,
    tabUrl: null,
    tabFrames: null,
    selectedFrame: null,
    loading: true,
    isCurrentTabBeingListenedTo: false,
    returningToSingleTab: false,
    allowedNumberOfTabs: null,
    isInspecting: false,
    contextInvalidated: false,
    canStartInspecting: false,
  },
  actions: {
    setSelectedFrame: noop,
    changeListeningToThisTab: noop,
    deleteCookie: noop,
    modifyCookie: () => Promise.resolve(true),
    deleteAllCookies: noop,
    setIsInspecting: noop,
    getCookiesSetByJavascript: noop,
    setContextInvalidated: noop,
    setCanStartInspecting: noop,
  },
};

export const Context = createContext<CookieStoreContext>(initialState);

export const Provider = ({ children }: PropsWithChildren) => {
  const [tabId, setTabId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isCurrentTabBeingListenedTo, setIsCurrentTabBeingListenedTo] =
    useState<boolean>(false);
  const [contextInvalidated, setContextInvalidated] = useState<boolean>(false);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

  const [allowedNumberOfTabs, setAllowedNumberOfTabs] = useState<string | null>(
    null
  );

  const [canStartInspecting, setCanStartInspecting] = useState<boolean>(false);

  const [tabCookies, setTabCookies] =
    useState<CookieStoreContext['state']['tabCookies']>(null);

  const [isInspecting, setIsInspecting] =
    useState<CookieStoreContext['state']['isInspecting']>(false);

  const [selectedFrame, setSelectedFrame] =
    useState<CookieStoreContext['state']['selectedFrame']>(null);

  const [tabUrl, setTabUrl] =
    useState<CookieStoreContext['state']['tabUrl']>(null);
  const [tabFrames, setTabFrames] =
    useState<CookieStoreContext['state']['tabFrames']>(null);

  const getAllFramesForCurrentTab = useCallback(
    async (_tabId: number | null) => {
      if (!_tabId) {
        return;
      }

      const regexForFrameUrl =
        /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;

      const currentTabFrames = await chrome.webNavigation.getAllFrames({
        tabId: _tabId,
      });
      const modifiedTabFrames: TabFrames = {};

      currentTabFrames?.forEach(({ url, frameId, frameType }) => {
        if (url && url.includes('http')) {
          const parsedUrl = regexForFrameUrl.exec(url);
          if (parsedUrl && parsedUrl[0]) {
            if (modifiedTabFrames[parsedUrl[0]]) {
              modifiedTabFrames[parsedUrl[0]].frameIds.push(frameId);
            } else {
              modifiedTabFrames[parsedUrl[0]] = {
                frameIds: [frameId],
                frameType,
              };
            }
          }
        }
      });
      await Promise.all(
        Object.keys(modifiedTabFrames).map(async (tabFrame) => {
          modifiedTabFrames[tabFrame].isOnRWS = await isOnRWS(tabFrame);
          return tabFrame;
        })
      );
      setTabFrames(modifiedTabFrames);
    },
    []
  );

  const intitialSync = useCallback(async () => {
    const _tabId = chrome.devtools.inspectedWindow.tabId;

    await getAllFramesForCurrentTab(_tabId);

    setTabId(_tabId);

    const extensionStorage = await chrome.storage.sync.get();
    const _allowedNumberOfTabs =
      extensionStorage?.allowedNumberOfTabs || 'single';

    if (!extensionStorage?.allowedNumberOfTabs) {
      await chrome.storage.sync.clear();
      await chrome.storage.sync.set({
        allowedNumberOfTabs: 'single',
      });
    }

    setAllowedNumberOfTabs(_allowedNumberOfTabs);

    if (_tabId) {
      if (extensionStorage?.allowedNumberOfTabs === 'single') {
        const getTabBeingListenedTo = await chrome.storage.local.get();
        const availableTabs = await chrome.tabs.query({});
        if (
          availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
          availableTabs.filter(
            (processingTab) =>
              processingTab.id?.toString() === getTabBeingListenedTo?.tabToRead
          )
        ) {
          setReturningToSingleTab(true);
        }

        if (
          getTabBeingListenedTo &&
          _tabId.toString() !== getTabBeingListenedTo?.tabToRead
        ) {
          setIsCurrentTabBeingListenedTo(false);
          setLoading(false);
          setSelectedFrame(null);
          setTabFrames(null);
          setCanStartInspecting(false);
          return;
        } else {
          setIsCurrentTabBeingListenedTo(true);
        }
      }
    }
    await setDocumentCookies(_tabId?.toString());
    const tabData = (await chrome.storage.local.get([_tabId.toString()]))[
      _tabId.toString()
    ];
    if (tabData && tabData.cookies) {
      const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
        {};

      Object.entries(tabData.cookies as { [key: string]: CookieData }).map(
        ([key, value]: [string, CookieData]) => {
          const isCookieBlocked = value?.isBlocked ?? false;
          _cookies[key] = {
            ...value,
            isBlocked: isCookieBlocked,
          };
          return [key, value];
        }
      );

      setTabCookies(_cookies);
    }

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabUrl(result);
        }
      }
    );

    setLoading(false);
  }, [getAllFramesForCurrentTab]);

  const storeChangeListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (
        tabId &&
        Object.keys(changes).includes(tabId.toString()) &&
        changes[tabId.toString()]?.newValue?.cookies
      ) {
        const _cookies: NonNullable<CookieStoreContext['state']['tabCookies']> =
          {};

        Object.entries(
          changes[tabId.toString()].newValue.cookies as {
            [key: string]: CookieData;
          }
        ).map(([key, value]) => {
          const isCookieBlocked = value?.isBlocked ?? false;
          _cookies[key] = {
            ...value,
            isBlocked: isCookieBlocked,
          };
          return [key, value];
        });

        await getAllFramesForCurrentTab(tabId);
        setTabCookies(_cookies);
      }

      if (tabId) {
        const extensionStorage = await chrome.storage.sync.get();

        if (extensionStorage?.allowedNumberOfTabs === 'single') {
          const getTabBeingListenedTo = await chrome.storage.local.get();
          const availableTabs = await chrome.tabs.query({});

          if (
            availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
            availableTabs.filter(
              (processingTab) =>
                processingTab.id?.toString() ===
                getTabBeingListenedTo?.tabToRead
            )
          ) {
            setReturningToSingleTab(true);
          }

          if (
            getTabBeingListenedTo &&
            tabId.toString() !== getTabBeingListenedTo?.tabToRead
          ) {
            setIsCurrentTabBeingListenedTo(false);
            setTabFrames(null);
            setSelectedFrame(null);
            setLoading(false);
            setCanStartInspecting(false);
            return;
          } else {
            setIsCurrentTabBeingListenedTo(true);
            chrome.devtools.inspectedWindow.eval(
              'window.location.href',
              (result, isException) => {
                if (!isException && typeof result === 'string') {
                  setTabUrl(result);
                }
              }
            );
          }
        }
      }
      setLoading(false);
    },
    [tabId, getAllFramesForCurrentTab]
  );

  const getCookiesSetByJavascript = useCallback(async () => {
    if (tabId) {
      await setDocumentCookies(tabId.toString());
    }
  }, [tabId]);

  const changeListeningToThisTab = useCallback(async () => {
    let changedTabId = tabId?.toString();

    if (!tabId) {
      changedTabId = await getCurrentTabId();
    }

    if (!changedTabId) {
      return;
    }

    await CookieStore.addTabData(changedTabId);

    const storedTabData = Object.keys(await chrome.storage.local.get());

    // eslint-disable-next-line guard-for-in
    storedTabData.map(async (tabIdToBeDeleted) => {
      if (
        tabIdToBeDeleted !== changedTabId &&
        tabIdToBeDeleted !== 'tabToRead'
      ) {
        await CookieStore.removeTabData(tabIdToBeDeleted);

        if (!Number.isNaN(parseInt(tabIdToBeDeleted))) {
          await chrome.action.setBadgeText({
            tabId: parseInt(tabIdToBeDeleted),
            text: '',
          });
        }
      }
      return Promise.resolve();
    });

    chrome.devtools.inspectedWindow.eval(
      'window.location.href',
      (result, isException) => {
        if (!isException && typeof result === 'string') {
          setTabUrl(result);
        }
      }
    );

    await chrome.tabs.reload(Number(changedTabId));

    setIsCurrentTabBeingListenedTo(true);
    setLoading(false);
    setCanStartInspecting(false);
  }, [tabId]);

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (tabId === _tabId && changeInfo.url) {
        try {
          const nextURL = new URL(changeInfo.url);
          const nextDomain = nextURL?.hostname;
          const currentURL = new URL(tabUrl ?? '');
          const currentDomain = currentURL?.hostname;

          if (selectedFrame && nextDomain === currentDomain) {
            setSelectedFrame(nextURL.origin);
          } else {
            setSelectedFrame(null);
          }

          setTabUrl(changeInfo.url);
        } catch (error) {
          setSelectedFrame(null);
        } finally {
          setTabFrames(null);
          await getAllFramesForCurrentTab(_tabId);
        }
      }
    },
    [tabId, tabUrl, getAllFramesForCurrentTab, selectedFrame]
  );

  const tabRemovedListener = useCallback(async () => {
    const getTabBeingListenedTo = await chrome.storage.local.get();
    const availableTabs = await chrome.tabs.query({});

    if (
      availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
      availableTabs.filter(
        (processingTab) =>
          processingTab.id?.toString() === getTabBeingListenedTo?.tabToRead
      )
    ) {
      setReturningToSingleTab(true);
    }
  }, []);

  const changeSyncStorageListener = useCallback(async () => {
    const extensionStorage = await chrome.storage.sync.get();

    if (extensionStorage?.allowedNumberOfTabs) {
      setAllowedNumberOfTabs(extensionStorage?.allowedNumberOfTabs);
    }
  }, []);

  const deleteCookie = useCallback(
    async (cookieKey: string) => {
      const localStorage = await chrome.storage.local.get();
      if (tabId) {
        const tabData = localStorage[tabId];
        const cookieDetails = tabData.cookies[cookieKey];
        await CookieStore.deleteCookie(cookieKey);
        if (cookieDetails?.parsedCookie?.name && cookieDetails?.url) {
          await chrome.cookies.remove({
            name: cookieDetails?.parsedCookie?.name,
            url: cookieDetails?.url,
          });
        }
      }
    },
    [tabId]
  );

  const modifierForNonNameUpdate = useCallback(
    // eslint-disable-next-line complexity
    async (
      cookieKey: string,
      keyToChange: string,
      changedValue: string | boolean
    ) => {
      if (tabCookies && tabId) {
        let newCookieKey = cookieKey;
        let valueToBeSet: string | boolean | number = changedValue;
        const { [cookieKey]: cookieDetails, ...restOfCookies } = tabCookies;

        if (cookieDetails?.isBlocked) {
          return null;
        }

        if (keyToChange === 'expirationDate') {
          if (
            (valueToBeSet as string).toLowerCase() !== 'session' &&
            valueToBeSet
          ) {
            try {
              valueToBeSet = new Date(valueToBeSet as string).getTime() / 1000;
            } catch (error) {
              return false;
            }
          } else {
            valueToBeSet = 0;
          }
        }

        if (keyToChange === 'domain') {
          newCookieKey =
            cookieDetails.parsedCookie.name +
            changedValue +
            cookieDetails.parsedCookie.path;
        } else if (keyToChange === 'path') {
          newCookieKey =
            cookieDetails.parsedCookie.name +
            cookieDetails.parsedCookie.domain +
            changedValue;
        }

        if (keyToChange === 'sameSite') {
          valueToBeSet = getValueForLocalStorageAndCookieSet(
            keyToChange,
            (changedValue as string).toLowerCase(),
            false
          );
          if (!valueToBeSet) {
            return false;
          }
        }
        const currentCookie = await chrome.cookies.get({
          name: cookieDetails.parsedCookie.name,
          url: cookieDetails.url,
        });

        try {
          if (!currentCookie) {
            return false;
          }

          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            hostOnly = '',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            session = '',
            expirationDate = 0,
            ...otherDetails
          } = currentCookie;

          let isUpdateDone;

          if (keyToChange === 'expirationDate' && valueToBeSet === 0) {
            isUpdateDone = await chrome.cookies.set({
              ...otherDetails,
              url: cookieDetails.url,
            });
          } else {
            isUpdateDone = await chrome.cookies.set({
              ...otherDetails,
              expirationDate,
              [keyToChange]: valueToBeSet,
              url: cookieDetails.url,
            });
            if (keyToChange === 'expirationDate') {
              valueToBeSet = Number(valueToBeSet) * 1000;
            }
          }

          if (
            isUpdateDone[keyToChange] === valueToBeSet ||
            (keyToChange === 'expirationDate' &&
              (isUpdateDone?.session || isUpdateDone?.expirationDate))
          ) {
            const oldData = await chrome.storage.local.get();

            const updatedCookie = {
              [newCookieKey]: {
                ...cookieDetails,
                parsedCookie: {
                  ...cookieDetails.parsedCookie,
                  [keyToChange === 'expirationDate'
                    ? 'expires'
                    : keyToChange.toLowerCase()]:
                    getValueForLocalStorageAndCookieSet(
                      keyToChange,
                      valueToBeSet,
                      true
                    ),
                },
              },
            };

            await chrome.storage.local.set({
              ...oldData,
              [tabId]: {
                ...oldData[tabId],
                cookies: {
                  ...restOfCookies,
                  ...updatedCookie,
                },
              },
            });
          } else {
            return false;
          }
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    },
    [tabCookies, tabId]
  );

  const deleteAllCookies = useCallback(async () => {
    const localStorage = await chrome.storage.local.get();
    if (tabId && tabFrames && selectedFrame) {
      const currentFrame = tabFrames[selectedFrame];
      const newTabData = localStorage[tabId];
      const allCookies: CookieStoreContext['state']['tabCookies'] =
        newTabData.cookies ?? null;
      if (allCookies) {
        const cookieKeys: string[] = [];
        await Promise.all(
          currentFrame.frameIds.map(async (frameId) => {
            await Promise.all(
              Object.keys(allCookies).map(async (key) => {
                if (
                  allCookies[key].frameIdList &&
                  !allCookies[key].frameIdList.includes(frameId)
                ) {
                  return key;
                }
                if (
                  allCookies[key]?.parsedCookie?.name &&
                  allCookies[key]?.url
                ) {
                  await chrome.cookies.remove({
                    name: allCookies[key]?.parsedCookie?.name,
                    url: allCookies[key]?.url,
                  });
                }
                cookieKeys.push(key);
                return key;
              })
            );
            return frameId;
          })
        );
        await CookieStore.deleteSetOfCookie(cookieKeys);
      }
    }
  }, [selectedFrame, tabFrames, tabId]);

  const modifierForNameUpdate = useCallback(
    async (
      cookieKey: string,
      keyToChange: string,
      changedValue: string,
      previousValue: string
    ) => {
      if (tabId && tabCookies) {
        const { [cookieKey]: cookieDetails, ...restOfCookies } = tabCookies;

        if (cookieDetails?.isBlocked) {
          return null;
        }
        const newCookieKey =
          changedValue +
          cookieDetails.parsedCookie.domain +
          cookieDetails.parsedCookie.path;

        const currentCookie = await chrome.cookies.get({
          name: previousValue,
          url: cookieDetails.url,
        });

        try {
          if (!currentCookie) {
            return false;
          }

          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            hostOnly = '',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            session = '',
            ...otherDetails
          } = currentCookie;

          const isUpdateDone = await chrome.cookies.set({
            ...otherDetails,
            [keyToChange]: changedValue,
            url: cookieDetails.url,
          });

          await chrome.cookies.remove({
            name: previousValue,
            url: cookieDetails.url,
          });

          if (isUpdateDone[keyToChange] === changedValue) {
            const oldData = await chrome.storage.local.get();
            const updatedCookie = {
              [newCookieKey]: {
                ...cookieDetails,
                analytics: {
                  ...cookieDetails?.analytics,
                  name: changedValue,
                },
                parsedCookie: {
                  ...cookieDetails.parsedCookie,
                  [keyToChange]: changedValue,
                },
              },
            };

            await chrome.storage.local.set({
              ...oldData,
              [tabId]: {
                ...oldData[tabId],
                cookies: {
                  ...restOfCookies,
                  ...updatedCookie,
                },
              },
            });
          } else {
            return false;
          }
          return true;
        } catch (error) {
          return false;
        }
      } else {
        return false;
      }
    },
    [tabCookies, tabId]
  );

  const modifyCookie = useCallback(
    (
      cookieKey: string,
      keyToChange: string,
      changedValue: string | boolean,
      previousValue: string | null
    ) => {
      if (previousValue) {
        if (!changedValue) {
          return false;
        }
        return modifierForNameUpdate(
          cookieKey,
          keyToChange,
          changedValue as string,
          previousValue
        );
      }
      return modifierForNonNameUpdate(cookieKey, keyToChange, changedValue);
    },
    [modifierForNameUpdate, modifierForNonNameUpdate]
  );

  useEffect(() => {
    intitialSync();
    chrome.storage.local.onChanged.addListener(storeChangeListener);
    chrome.storage.sync.onChanged.addListener(changeSyncStorageListener);
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.storage.local.onChanged.removeListener(storeChangeListener);
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
      chrome.storage.sync.onChanged.removeListener(changeSyncStorageListener);
    };
  }, [
    intitialSync,
    storeChangeListener,
    tabUpdateListener,
    tabRemovedListener,
    changeSyncStorageListener,
  ]);

  useEffect(() => {
    loadingTimeout.current = setTimeout(() => {
      setLoading(false);
    }, 6500);

    return () => {
      if (loadingTimeout.current) {
        clearTimeout(loadingTimeout.current);
      }
    };
  }, []);

  return (
    <Context.Provider
      value={{
        state: {
          tabCookies,
          tabUrl,
          tabFrames,
          loading,
          selectedFrame,
          isCurrentTabBeingListenedTo,
          returningToSingleTab,
          allowedNumberOfTabs,
          contextInvalidated,
          isInspecting,
          canStartInspecting,
        },
        actions: {
          setSelectedFrame,
          changeListeningToThisTab,
          deleteCookie,
          modifyCookie,
          deleteAllCookies,
          getCookiesSetByJavascript,
          setIsInspecting,
          setContextInvalidated,
          setCanStartInspecting,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useCookieStore(): CookieStoreContext;
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T
): T;

/**
 * Cookie store hook.
 * @param selector Selector function to partially select state.
 * @returns selected part of the state
 */
export function useCookieStore<T>(
  selector: (state: CookieStoreContext) => T | CookieStoreContext = (state) =>
    state
) {
  return useContextSelector(Context, selector);
}
