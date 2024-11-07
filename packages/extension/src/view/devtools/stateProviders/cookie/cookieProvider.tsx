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
import { type TabCookies } from '@google-psat/common';
import { isEqual } from 'lodash-es';

/**
 * Internal dependencies.
 */
import {
  ALLOWED_NUMBER_OF_TABS,
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  GET_JS_COOKIES,
  INITIAL_SYNC,
  NEW_COOKIE_DATA,
  SERVICE_WORKER_RELOAD_MESSAGE,
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

  const { allowedNumberOfTabs, setSettingsChanged, isUsingCDP } = useSettings(
    ({ state, actions }) => ({
      allowedNumberOfTabs: state.allowedNumberOfTabs,
      setSettingsChanged: actions.setSettingsChanged,
      isUsingCDP: state.isUsingCDP,
    })
  );

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

        if (isEqual(prevState ?? {}, updatedTabFrames)) {
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
  const frameHasCookies = useCallback(() => {
    if (!tabCookies) {
      return null;
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

  const messagePassingListener = useCallback(
    // eslint-disable-next-line complexity
    async (message: {
      type: string;
      payload: {
        tabId?: number;
        cookieData?: TabCookies;
        tabToRead?: string;
        tabMode?: string;
        extraData?: {
          extraFrameData?: Record<string, string[]>;
        };
        psatOpenedAfterPageLoad?: boolean;
        actionsPerformed: {
          allowedNumberOfTabs: number;
        };
      };
    }) => {
      if (!message.type) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;

      if (incomingMessageType === 'SERVICE_WORKER_SLEPT') {
        setContextInvalidated(true);
        localStorage.setItem('contextInvalidated', 'true');
      }

      if (SET_TAB_TO_READ === incomingMessageType) {
        const tab = await getTab(tabId?.toString() || '');
        setTabUrl(tab?.url ?? '');
        isCurrentTabBeingListenedToRef.current =
          tabId === message?.payload?.tabId;
        setTabToRead(message?.payload?.tabId?.toString() || null);
        setTabFrames(null);
        setLoading(false);
        setCanStartInspecting(false);
      }

      if (INITIAL_SYNC === incomingMessageType && message?.payload?.tabMode) {
        if (message.payload.tabMode === 'unlimited') {
          isCurrentTabBeingListenedToRef.current = true;
          if (
            Object.keys(message.payload).includes('psatOpenedAfterPageLoad') &&
            message.payload.psatOpenedAfterPageLoad
          ) {
            setContextInvalidated(true);
            localStorage.setItem('psatOpenedAfterPageLoad', 'true');
          }
          setTabToRead(null);
        } else {
          if (tabId.toString() !== message?.payload?.tabToRead) {
            setTabFrames(null);
          }

          isCurrentTabBeingListenedToRef.current =
            tabId.toString() === message?.payload?.tabToRead;
          setTabToRead(message?.payload?.tabToRead || null);
        }
      }

      if (
        NEW_COOKIE_DATA === incomingMessageType &&
        message?.payload?.tabId &&
        message?.payload?.cookieData
      ) {
        const data = message.payload.cookieData;
        const frameData = message.payload.extraData?.extraFrameData ?? {};

        if (tabId.toString() === message.payload.tabId.toString()) {
          if (isCurrentTabBeingListenedToRef.current) {
            setTabToRead(tabId.toString());
            setTabCookies((prevState) => {
              if (Object.keys(data).length > 0) {
                if (isEqual(prevState ?? {}, data)) {
                  return prevState;
                }
                return data;
              }
              return null;
            });
            await getAllFramesForCurrentTab(frameData);
          } else {
            setTabFrames(null);
          }
        }
      }

      if (message.type === SERVICE_WORKER_RELOAD_MESSAGE) {
        setSettingsChanged(false);
        if (message?.payload?.actionsPerformed?.allowedNumberOfTabs === 1) {
          isCurrentTabBeingListenedToRef.current = false;
          setTabFrames(null);
        }
      }
    },
    [getAllFramesForCurrentTab, setSettingsChanged]
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(messagePassingListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messagePassingListener);
    };
  }, [messagePassingListener]);

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
    chrome.tabs.onRemoved.addListener(tabRemovedListener);
    return () => {
      chrome.tabs.onRemoved.removeListener(tabRemovedListener);
    };
  }, [tabRemovedListener]);

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
        frameHasCookies: frameHasCookies(),
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
