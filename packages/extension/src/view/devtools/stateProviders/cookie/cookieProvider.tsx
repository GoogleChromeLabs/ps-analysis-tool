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
import React, {
  type PropsWithChildren,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import isEqual from 'lodash/isEqual';

/**
 * Internal dependencies.
 */
import {
  ALLOWED_NUMBER_OF_TABS,
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  GET_JS_COOKIES,
  SET_TAB_TO_READ,
} from '../../../../constants';
import { useSettings } from '../settings';
import { getTab } from '../../../../utils/getTab';
import getFramesForCurrentTab from '../../../../utils/getFramesForCurrentTab';
import Context, { type CookieStoreContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState<boolean>(true);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tabToRead, setTabToRead] = useState<string | null>(null);
  const [contextInvalidated, setContextInvalidated] = useState<boolean>(false);

  const [returningToSingleTab, setReturningToSingleTab] =
    useState<CookieStoreContext['state']['returningToSingleTab']>(false);

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

  // This was converted to useRef because setting state was creating a race condition in rerendering the provider.
  const isCurrentTabBeingListenedToRef = useRef(false);

  const { allowedNumberOfTabs, isUsingCDP } = useSettings(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
    isUsingCDP: state.isUsingCDP,
  }));

  /**
   * Set tab frames state for frame ids and frame URLs from using chrome.webNavigation.getAllFrames
   */
  const getAllFramesForCurrentTab = useCallback(
    async (extraFrameData?: Record<string, string[]>) => {
      const currentTabFrames = await chrome.webNavigation.getAllFrames({
        tabId: chrome.devtools.inspectedWindow.tabId,
      });

      const currentTargets = await chrome.debugger.getTargets();

      setTabFrames((prevState) => {
        const updatedTabFrames = getFramesForCurrentTab(
          prevState,
          currentTabFrames,
          currentTargets,
          extraFrameData ?? {},
          isUsingCDP
        );

        if (isEqual(prevState, updatedTabFrames)) {
          return prevState;
        }

        return updatedTabFrames;
      });
    },
    [isUsingCDP]
  );

  /**
   * Stores object with frame URLs as keys and boolean values indicating if the frame contains cookies.
   */
  const frameHasCookies = useMemo(() => {
    if (!tabCookies) {
      return {};
    }

    const tabFramesIdsWithURL = Object.entries(tabFrames || {}).reduce<
      Record<string, string>
    >((acc, [url, frame]) => {
      frame.frameIds?.forEach((id) => {
        if (!id) {
          return;
        }
        acc[id] = url;
      });

      return acc;
    }, {});

    const _frameHasCookies = Object.values(tabCookies).reduce<
      Record<string, boolean>
    >((acc, cookie) => {
      cookie.frameIdList?.forEach((frameId) => {
        const url = tabFramesIdsWithURL[frameId];

        if (url) {
          acc[url] = true;
        }
      });

      return acc;
    }, {});

    return _frameHasCookies;
  }, [tabCookies, tabFrames]);

  /**
   * Sets current frames for sidebar, detected if the current tab is to be analysed,
   * parses data currently in store, set current tab URL.
   */
  const intitialSync = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const { globalEvents } = await chrome.storage.session.get('globalEvents');
    const { cookieAnalysis } = await chrome.storage.session.get(
      'cookieAnalysis'
    );

    if (globalEvents.allowedNumberOfTabs === 'unlimited') {
      isCurrentTabBeingListenedToRef.current = true;
      setTabToRead(null);
      setTabCookies(cookieAnalysis[tabId]?.cookieData ?? {});
      await getAllFramesForCurrentTab(cookieAnalysis[tabId]?.extraFrameData);
    }

    if (
      globalEvents.allowedNumberOfTabs === 'single' &&
      globalEvents.tabToRead === tabId.toString()
    ) {
      isCurrentTabBeingListenedToRef.current = true;
      setTabToRead(globalEvents.tabToRead);
      setTabCookies(cookieAnalysis[tabId]?.cookieData ?? {});
      await getAllFramesForCurrentTab(cookieAnalysis[tabId]?.extraFrameData);
    }

    if (isCurrentTabBeingListenedToRef.current) {
      await getAllFramesForCurrentTab();
    }

    const tab = await getTab(tabId);

    if (chrome.devtools.inspectedWindow.tabId && canStartInspecting) {
      await chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
        payload: {
          type: GET_JS_COOKIES,
          tabId: chrome.devtools.inspectedWindow.tabId,
        },
      });
    }

    if (tab?.url) {
      setTabUrl(tab?.url);
    } else {
      chrome.devtools.inspectedWindow.eval(
        'window.location.href',
        (result, isException) => {
          if (!isException && typeof result === 'string') {
            setTabUrl(result);
          }
        }
      );
    }

    setLoading(false);
  }, [getAllFramesForCurrentTab, canStartInspecting]);

  const getCookiesSetByJavascript = useCallback(async () => {
    if (chrome.devtools.inspectedWindow.tabId) {
      await chrome.tabs.sendMessage(chrome.devtools.inspectedWindow.tabId, {
        payload: {
          type: GET_JS_COOKIES,
          tabId: chrome.devtools.inspectedWindow.tabId,
        },
      });
    }
  }, []);

  const changeListeningToThisTab = useCallback(() => {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    if (!tabId) {
      return;
    }
    chrome.runtime.sendMessage({
      type: SET_TAB_TO_READ,
      payload: {
        tabId,
      },
    });
    setTabToRead(tabId.toString());
  }, []);

  useEffect(() => {
    if (
      !isCurrentTabBeingListenedToRef.current &&
      allowedNumberOfTabs === 'single' &&
      tabFrames &&
      Object.keys(tabFrames).length > 0
    ) {
      setTabFrames(null);
    }
  }, [allowedNumberOfTabs, tabFrames]);

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: 'GET_REST_DATA_FROM_URL',
      payload: {
        tabId: chrome.devtools.inspectedWindow.tabId,
        selectedFrame,
      },
    });
  }, [selectedFrame]);

  const sessionStorageListener = useCallback(
    // eslint-disable-next-line complexity
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (!changes) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (changes?.cookieAnalysis?.newValue) {
        const data = changes?.cookieAnalysis?.newValue[tabId]?.cookieData;
        const frameData =
          changes?.cookieAnalysis?.newValue[tabId]?.extraFrameData ?? {};

        if (allowedNumberOfTabs === 'unlimited') {
          setTabCookies((prevState) => {
            if (data && Object.keys(data).length > 0) {
              if (isEqual(data, prevState)) {
                return prevState;
              }

              return data;
            }
            return prevState;
          });
          await getAllFramesForCurrentTab(frameData);
        } else {
          if (tabToRead !== tabId.toString()) {
            setTabFrames(null);
            isCurrentTabBeingListenedToRef.current = false;
            return;
          }
          isCurrentTabBeingListenedToRef.current = true;
          setTabCookies((prevState) => {
            if (data && Object.keys(data).length > 0) {
              if (isEqual(data, prevState)) {
                return prevState;
              }

              return data;
            }
            return prevState;
          });
          await getAllFramesForCurrentTab(frameData);
        }
      }

      if (changes?.globalEvents?.newValue) {
        const newValue = changes?.globalEvents?.newValue;

        const {
          allowedNumberOfTabs: _allowedNumberOfTabs,
          tabToRead: _tabToRead,
          psatOpenedAfterPageLoad = false,
        } = newValue;

        if (_allowedNumberOfTabs === 'single' && _tabToRead) {
          setTabToRead(_tabToRead);
          isCurrentTabBeingListenedToRef.current =
            tabToRead === tabId.toString();

          setTabFrames(null);
          setLoading(false);
          setCanStartInspecting(false);
          const tab = await getTab(tabId?.toString() || '');
          setTabUrl(tab?.url ?? '');
        }

        if (_allowedNumberOfTabs === 'unlimited') {
          setTabToRead(null);
          isCurrentTabBeingListenedToRef.current = true;
        }

        if (psatOpenedAfterPageLoad) {
          setContextInvalidated(true);
          localStorage.setItem('psatOpenedAfterPageLoad', 'true');
        }
      }
    },
    [allowedNumberOfTabs, getAllFramesForCurrentTab, tabToRead]
  );

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(sessionStorageListener);

    return () => {
      chrome.storage.session.onChanged.removeListener(sessionStorageListener);
    };
  }, [sessionStorageListener]);

  const tabUpdateListener = useCallback(
    async (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      const tabId = chrome.devtools.inspectedWindow.tabId;
      if (tabId === _tabId && changeInfo.url) {
        setIsInspecting(false);
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
          await getAllFramesForCurrentTab();
        }
      }
    },
    [tabUrl, getAllFramesForCurrentTab, selectedFrame]
  );

  const tabRemovedListener = useCallback(async () => {
    try {
      const availableTabs = await chrome.tabs.query({});

      if (
        availableTabs.length === ALLOWED_NUMBER_OF_TABS &&
        availableTabs.filter(
          (processingTab) => processingTab.id?.toString() === tabToRead
        )
      ) {
        setReturningToSingleTab(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
  }, [tabToRead]);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(tabUpdateListener);
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.tabs.onUpdated.removeListener(tabUpdateListener);
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
    };
  }, [tabUpdateListener, tabRemovedListener]);

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

  useEffect(() => {
    const doNotReReload =
      localStorage.getItem('contextInvalidated') &&
      !localStorage.getItem('psatOpenedAfterPageLoad');
    chrome.runtime.sendMessage({
      type: DEVTOOLS_OPEN,
      payload: {
        tabId: chrome.devtools.inspectedWindow.tabId,
        doNotReReload,
      },
    });

    return () => {
      chrome.runtime.sendMessage({
        type: DEVTOOLS_CLOSE,
        payload: {
          tabId: chrome.devtools.inspectedWindow.tabId,
        },
      });
    };
  }, []);

  const memoisedValue = useMemo(() => {
    return {
      state: {
        tabCookies,
        tabUrl,
        tabFrames,
        loading,
        selectedFrame,
        isCurrentTabBeingListenedTo: isCurrentTabBeingListenedToRef.current,
        returningToSingleTab,
        contextInvalidated,
        isInspecting,
        canStartInspecting,
        tabToRead,
        frameHasCookies,
      },
      actions: {
        setSelectedFrame,
        changeListeningToThisTab,
        getCookiesSetByJavascript,
        setIsInspecting,
        setContextInvalidated,
        setCanStartInspecting,
      },
    };
  }, [
    canStartInspecting,
    changeListeningToThisTab,
    contextInvalidated,
    frameHasCookies,
    getCookiesSetByJavascript,
    isInspecting,
    loading,
    returningToSingleTab,
    selectedFrame,
    tabCookies,
    tabFrames,
    tabToRead,
    tabUrl,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
