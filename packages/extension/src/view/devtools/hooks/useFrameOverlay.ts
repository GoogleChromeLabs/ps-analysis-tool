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
import { useCallback, useEffect, useRef, useState } from 'react';
import type { CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { WEBPAGE_PORT_NAME } from '../../../constants';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

interface Response {
  attributes: { iframeOrigin: string | null; setInPage?: boolean };
}

const useFrameOverlay = (
  filteredCookies: CookieTableData[],
  selectedFrameChangeHandler?: (key: string | null) => void
) => {
  const portRef = useRef<chrome.runtime.Port | null>(null);

  const {
    isInspecting,
    setIsInspecting,
    setContextInvalidated,
    selectedFrame,
    isCurrentTabBeingListenedTo,
    allowedNumberOfTabs,
    tabFrames,
    setCanStartInspecting,
    canStartInspecting,
  } = useCookieStore(({ state, actions }) => ({
    setContextInvalidated: actions.setContextInvalidated,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
    selectedFrame: state.selectedFrame,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    allowedNumberOfTabs: state.allowedNumberOfTabs,
    tabFrames: state.tabFrames,
    setCanStartInspecting: actions.setCanStartInspecting,
    canStartInspecting: state.canStartInspecting,
  }));

  const [isFrameSelectedFromDevTool, setIsFrameSelectedFromDevTool] =
    useState(false);

  const setSelectedFrame = useCallback(
    (key: string | null, isHover?: boolean) => {
      selectedFrameChangeHandler?.(key);
      setIsFrameSelectedFromDevTool(!isHover);
    },
    [selectedFrameChangeHandler]
  );

  useEffect(() => {
    if (!isInspecting) {
      setIsFrameSelectedFromDevTool(true);
    }
  }, [isInspecting, setSelectedFrame]);

  const [connectedToPort, setConnectedToPort] = useState(false);

  const connectToPort = useCallback(async () => {
    const tabId = await getCurrentTabId();

    if (!tabId) {
      return;
    }

    if (!canStartInspecting) {
      return;
    }

    const portName = `${WEBPAGE_PORT_NAME}-${tabId}`;

    portRef.current = chrome.tabs.connect(Number(tabId), {
      name: portName,
    });

    portRef.current.onMessage.addListener((response: Response) => {
      setSelectedFrame(response.attributes.iframeOrigin, true);
    });

    portRef.current.onDisconnect.addListener(() => {
      setIsInspecting(false);
      setCanStartInspecting(false);
    });

    // For the first time.
    portRef.current.postMessage({
      isInspecting: true,
    });
    setConnectedToPort(true);
  }, [
    canStartInspecting,
    setSelectedFrame,
    setIsInspecting,
    setCanStartInspecting,
  ]);

  const listenIfContentScriptSet = useCallback(
    async (
      request: { [key: string]: boolean },
      sender: chrome.runtime.MessageSender
    ) => {
      const tabId = await getCurrentTabId();

      if (request.setInPage && tabId === sender?.tab?.id?.toString()) {
        setCanStartInspecting(true);
      }
    },
    [setCanStartInspecting]
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener(listenIfContentScriptSet);

    return () => {
      chrome.runtime.onMessage.removeListener(listenIfContentScriptSet);
    };
  }, [listenIfContentScriptSet]);

  const sessionStoreChangedListener = useCallback(
    async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      try {
        const syncStorage = await chrome.storage.sync.get();
        if (syncStorage.isDev) {
          return;
        }
        const currentTabId = await getCurrentTabId();

        if (!currentTabId) {
          return;
        }

        if (changes && Object.keys(changes).includes(currentTabId.toString())) {
          if (!changes[currentTabId].newValue && portRef.current) {
            setIsInspecting(false);
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    [setIsInspecting]
  );
  useEffect(() => {
    (async () => {
      try {
        const currentTabId = await getCurrentTabId();
        if (!currentTabId) {
          return;
        }

        chrome.tabs.sendMessage(
          Number(currentTabId),
          { status: 'set?' },
          (res) => {
            if (res) {
              setCanStartInspecting(res.setInPage);
            }
          }
        );
      } catch (error) {
        // Fail silently.
      }
    })();
  }, [setCanStartInspecting]);
  // When inspect button is clicked.
  useEffect(() => {
    (async () => {
      try {
        // Indicates that the context was invalidated.
        if (!chrome.runtime?.id && setContextInvalidated) {
          setContextInvalidated(true);
          return;
        }

        if (!isInspecting) {
          if (portRef.current) {
            portRef.current.disconnect();
            portRef.current = null;
            setConnectedToPort(false);
          }

          return;
        }

        await connectToPort();
      } catch (error) {
        // fail silently
      }
    })();
  }, [connectToPort, isInspecting, setContextInvalidated]);

  useEffect(() => {
    chrome.storage.session.onChanged.addListener(sessionStoreChangedListener);
    return () => {
      try {
        chrome.storage.session.onChanged.removeListener(
          sessionStoreChangedListener
        );
      } catch (error) {
        //Silently fail
      }
    };
  }, [sessionStoreChangedListener]);

  useEffect(() => {
    if (
      allowedNumberOfTabs === 'single' &&
      !isCurrentTabBeingListenedTo &&
      chrome.runtime?.id &&
      portRef.current
    ) {
      portRef.current.disconnect();
      portRef.current = null;
      setIsInspecting(false);
      setConnectedToPort(false);
    }
  }, [allowedNumberOfTabs, isCurrentTabBeingListenedTo, setIsInspecting]);

  useEffect(() => {
    (async () => {
      try {
        if (!connectedToPort && !canStartInspecting) {
          await connectToPort();
        }

        if (!isInspecting && portRef.current && canStartInspecting) {
          portRef.current.postMessage({
            isInspecting: false,
          });

          return;
        }
        if (
          chrome.runtime?.id &&
          portRef.current &&
          tabFrames &&
          canStartInspecting
        ) {
          const thirdPartyCookies = filteredCookies
            ? filteredCookies.filter((cookie) => !cookie.isFirstParty)
            : [];
          const firstPartyCookies = filteredCookies
            ? filteredCookies.filter((cookie) => cookie.isFirstParty)
            : [];
          const blockedCookies = filteredCookies
            ? filteredCookies.filter(
                (cookie) =>
                  cookie.isBlocked ||
                  (cookie.blockedReasons?.length !== undefined &&
                    cookie.blockedReasons?.length > 0)
              )
            : [];
          const blockedReasons = filteredCookies
            ? filteredCookies
                .filter((cookie) => cookie.isBlocked)
                .reduce((previousReasons: string[], cookie) => {
                  if (
                    cookie.blockedReasons?.length !== undefined &&
                    cookie.blockedReasons?.length > 0
                  ) {
                    return [
                      ...new Set([
                        ...previousReasons,
                        ...(cookie.blockedReasons || []),
                      ]),
                    ];
                  }
                  return [...new Set([...previousReasons])];
                }, [])
            : [];
          portRef.current.postMessage({
            selectedFrame,
            removeAllFramePopovers: isFrameSelectedFromDevTool,
            thirdPartyCookies: thirdPartyCookies.length,
            firstPartyCookies: firstPartyCookies.length,
            blockedCookies: blockedCookies.length,
            blockedReasons: blockedReasons.join(', '),
            isInspecting,
            isOnRWS: selectedFrame ? tabFrames[selectedFrame]?.isOnRWS : false,
          });
        }
      } catch (error) {
        // Silently fail.
      }
    })();
  }, [
    canStartInspecting,
    connectToPort,
    connectedToPort,
    filteredCookies,
    isFrameSelectedFromDevTool,
    isInspecting,
    selectedFrame,
    tabFrames,
  ]);
};

export default useFrameOverlay;
