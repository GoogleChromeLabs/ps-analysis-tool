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
  DEVTOOLS_CLOSE,
  DEVTOOLS_OPEN,
  INITIAL_SYNC,
  NEW_COOKIE_DATA,
  SERVICE_WORKER_RELOAD_MESSAGE,
  TABID_STORAGE,
} from '../../../../constants';
import { useSettings } from '../settings';
import { getTab } from '../../../../utils/getTab';
import getFramesForCurrentTab from '../../../../utils/getFramesForCurrentTab';
import Context, { type CookieStoreContext } from './context';

const Provider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState<boolean>(true);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [contextInvalidated, setContextInvalidated] = useState<boolean>(false);

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

  const { isUsingCDP } = useSettings(({ state }) => ({
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

  const getCookiesSetByJavascript = useCallback(async () => {
    if (chrome.devtools.inspectedWindow.tabId) {
      const frames = await chrome.webNavigation.getAllFrames({
        tabId: chrome.devtools.inspectedWindow.tabId,
      });

      if (!frames) {
        return;
      }

      await Promise.all(
        frames.map(async (frame) => {
          try {
            await chrome.tabs.sendMessage(
              chrome.devtools.inspectedWindow.tabId,
              {
                tabId: chrome.devtools.inspectedWindow.tabId,
                payload: {
                  type: TABID_STORAGE,
                  tabId: chrome.devtools.inspectedWindow.tabId,
                  frameId: frame.frameId,
                },
              },
              {
                frameId: frame.frameId,
              }
            );
          } catch (error) {
            // Fail silently since the contentscript might not have been set.
          }
        })
      );
    }
  }, []);

  /**
   * Sets current frames for sidebar, detected if the current tab is to be analysed,
   * parses data currently in store, set current tab URL.
   */
  const intitialSync = useCallback(async () => {
    const tabId = chrome.devtools.inspectedWindow.tabId;

    await getAllFramesForCurrentTab();

    const tab = await getTab(tabId);

    if (chrome.devtools.inspectedWindow.tabId && canStartInspecting) {
      await getCookiesSetByJavascript();
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
  }, [
    getAllFramesForCurrentTab,
    canStartInspecting,
    getCookiesSetByJavascript,
  ]);

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
        exceedingLimitations?: boolean;
        extraData?: {
          extraFrameData?: Record<string, string[]>;
        };
        psatOpenedAfterPageLoad?: boolean;
      };
    }) => {
      if (!message.type) {
        return;
      }

      if (
        ![
          'SERVICE_WORKER_SLEPT',
          INITIAL_SYNC,
          NEW_COOKIE_DATA,
          SERVICE_WORKER_RELOAD_MESSAGE,
        ].includes(message.type)
      ) {
        return;
      }

      const tabId = chrome.devtools.inspectedWindow.tabId;
      const incomingMessageType = message.type;

      if (incomingMessageType === 'SERVICE_WORKER_SLEPT') {
        setContextInvalidated(true);
        localStorage.setItem('contextInvalidated', 'true');
      }

      if (INITIAL_SYNC === incomingMessageType) {
        if (
          Object.keys(message.payload).includes('psatOpenedAfterPageLoad') &&
          message.payload.psatOpenedAfterPageLoad
        ) {
          setContextInvalidated(true);
          localStorage.setItem('psatOpenedAfterPageLoad', 'true');
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
        }
      }
    },
    [getAllFramesForCurrentTab]
  );

  const onCommittedNavigationListener = useCallback(
    async ({
      frameId,
      frameType,
      url,
      tabId,
    }: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
      if (
        chrome.devtools.inspectedWindow.tabId === tabId &&
        url &&
        frameType === 'outermost_frame' &&
        frameId === 0
      ) {
        setIsInspecting(false);
        setTabFrames(null);
        setTabUrl(url);
        await getAllFramesForCurrentTab({});
      }
    },
    [getAllFramesForCurrentTab]
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(messagePassingListener);
    chrome.webNavigation.onCommitted.addListener(onCommittedNavigationListener);
    return () => {
      chrome.runtime?.onMessage?.removeListener(messagePassingListener);
      chrome.webNavigation.onCommitted.removeListener(
        onCommittedNavigationListener
      );
    };
  }, [messagePassingListener, onCommittedNavigationListener]);

  useEffect(() => {
    intitialSync();
  }, [intitialSync]);

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
        contextInvalidated,
        isInspecting,
        canStartInspecting,
        frameHasCookies: frameHasCookies(),
      },
      actions: {
        setSelectedFrame,
        getCookiesSetByJavascript,
        setIsInspecting,
        setContextInvalidated,
        setCanStartInspecting,
      },
    };
  }, [
    canStartInspecting,
    contextInvalidated,
    frameHasCookies,
    getCookiesSetByJavascript,
    isInspecting,
    loading,
    selectedFrame,
    tabCookies,
    tabFrames,
    tabUrl,
  ]);

  return <Context.Provider value={memoisedValue}>{children}</Context.Provider>;
};

export default Provider;
