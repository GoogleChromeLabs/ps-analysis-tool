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
import type { CookieTableData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { WEBPAGE_PORT_NAME } from '../../../constants';
import { useCookie, usePrebid, useProtectedAudience } from '../stateProviders';
import { isOnRWS } from '../../../contentScript/utils';

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
    tabFrames,
    setCanStartInspecting,
    canStartInspecting,
  } = useCookie(({ state, actions }) => ({
    setContextInvalidated: actions.setContextInvalidated,
    isInspecting: state.isInspecting,
    setIsInspecting: actions.setIsInspecting,
    selectedFrame: state.selectedFrame,
    tabFrames: state.tabFrames,
    setCanStartInspecting: actions.setCanStartInspecting,
    canStartInspecting: state.canStartInspecting,
  }));

  const { selectedAdUnit, adsAndBidders } = useProtectedAudience(
    ({ state }) => ({
      selectedAdUnit: state.selectedAdUnit,
      adsAndBidders: state.adsAndBidders,
    })
  );

  const { prebidAdUnits } = usePrebid(({ state }) => ({
    prebidAdUnits: state.prebidData?.adUnits,
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

  const connectToPort = useCallback(() => {
    const tabId = chrome.devtools.inspectedWindow.tabId;

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
      if (selectedAdUnit) {
        return;
      }
      setSelectedFrame(response.attributes.iframeOrigin, true);
    });

    portRef.current.onDisconnect.addListener(() => {
      setIsInspecting(false);
    });

    // For the first time.
    portRef.current.postMessage({
      isInspecting: true,
    });

    setConnectedToPort(true);
  }, [canStartInspecting, setSelectedFrame, setIsInspecting, selectedAdUnit]);

  const listenIfContentScriptSet = useCallback(
    (
      request: { [key: string]: boolean },
      sender: chrome.runtime.MessageSender
    ) => {
      const tabId = chrome.devtools.inspectedWindow.tabId;

      if (request.setInPage && tabId === sender?.tab?.id) {
        setCanStartInspecting(true);
      }
    },
    [setCanStartInspecting]
  );

  useEffect(() => {
    chrome.runtime?.onMessage?.addListener(listenIfContentScriptSet);

    return () => {
      chrome.runtime?.onMessage?.removeListener(listenIfContentScriptSet);
    };
  }, [listenIfContentScriptSet]);

  const sessionStoreChangedListener = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      try {
        const currentTabId = chrome.devtools.inspectedWindow.tabId;

        if (!currentTabId) {
          return;
        }

        const privacySandboxPanelVisibleKey = `${currentTabId}-privacySandboxPanelVisible`;

        if (
          changes &&
          Object.keys(changes).includes(privacySandboxPanelVisibleKey)
        ) {
          const privacySandboxPanelVisible =
            changes[privacySandboxPanelVisibleKey].newValue;

          if (!privacySandboxPanelVisible && portRef.current) {
            setIsInspecting(false);
          }

          if (!privacySandboxPanelVisible) {
            chrome.tabs?.sendMessage(
              chrome.devtools.inspectedWindow.tabId,
              {
                PSATDevToolsHidden: true,
                tabId: chrome.devtools.inspectedWindow.tabId,
              },
              () => {
                if (chrome.runtime.lastError) {
                  // eslint-disable-next-line no-console
                  console.log(chrome.runtime.lastError);
                }
              }
            );
          }
          if (privacySandboxPanelVisible) {
            chrome.tabs?.sendMessage(
              chrome.devtools.inspectedWindow.tabId,
              {
                PSATDevToolsHidden: false,
                tabId: chrome.devtools.inspectedWindow.tabId,
              },
              () => {
                if (chrome.runtime.lastError) {
                  // eslint-disable-next-line no-console
                  console.log(chrome.runtime.lastError);
                }
              }
            );
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
    try {
      chrome.tabs?.sendMessage(
        chrome.devtools.inspectedWindow.tabId,
        { status: 'set?', tabId: chrome.devtools.inspectedWindow.tabId },
        (res) => {
          if (!chrome.runtime.lastError) {
            if (res) {
              setCanStartInspecting(res.setInPagePrebidInterface);
            }
          }
        }
      );
    } catch (error) {
      // Fail silently.
    }
  }, [setCanStartInspecting]);

  // When inspect button is clicked.
  useEffect(() => {
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

      connectToPort();
    } catch (error) {
      // fail silently
    }
  }, [connectToPort, isInspecting, setContextInvalidated]);

  useEffect(() => {
    chrome.storage?.session?.onChanged?.addListener(
      sessionStoreChangedListener
    );
    return () => {
      try {
        chrome.storage?.session?.onChanged?.removeListener(
          sessionStoreChangedListener
        );
      } catch (error) {
        //Silently fail
      }
    };
  }, [sessionStoreChangedListener]);

  useEffect(() => {
    if (chrome.runtime?.id && portRef.current) {
      portRef.current.disconnect();
      portRef.current = null;
      setIsInspecting(false);
      setConnectedToPort(false);
    }
  }, [setIsInspecting]);

  // eslint-disable-next-line complexity
  useEffect(() => {
    try {
      if (selectedFrame) {
        return;
      }

      if (!selectedAdUnit) {
        return;
      }

      if (!connectedToPort && !canStartInspecting) {
        connectToPort();
      }

      if (!isInspecting && portRef.current && canStartInspecting) {
        portRef.current.postMessage({
          isInspecting: false,
        });

        return;
      }

      if (chrome.runtime?.id && portRef.current && canStartInspecting) {
        portRef.current?.postMessage({
          isForProtectedAudience: true,
          selectedAdUnit,
          numberOfBidders:
            adsAndBidders[selectedAdUnit]?.bidders?.length ??
            prebidAdUnits[selectedAdUnit]?.bidders?.length ??
            0,
          bidders:
            adsAndBidders[selectedAdUnit]?.bidders ??
            prebidAdUnits[selectedAdUnit]?.bidders ??
            [],
          winningBid:
            adsAndBidders[selectedAdUnit]?.winningBid ??
            prebidAdUnits[selectedAdUnit]?.winningBid ??
            null,
          bidCurrency:
            adsAndBidders[selectedAdUnit]?.bidCurrency ??
            prebidAdUnits[selectedAdUnit]?.bidCurrency ??
            null,
          winningBidder:
            adsAndBidders[selectedAdUnit]?.winningBidder ??
            prebidAdUnits[selectedAdUnit]?.winningBidder ??
            null,
          isInspecting,
        });
      }
    } catch (error) {
      // Silently fail.
    }
  }, [
    canStartInspecting,
    connectToPort,
    connectedToPort,
    isInspecting,
    selectedFrame,
    selectedAdUnit,
    adsAndBidders,
    prebidAdUnits,
  ]);

  useEffect(() => {
    (async () => {
      try {
        if (!connectedToPort && !canStartInspecting) {
          connectToPort();
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

          const isFrameOnRWS = selectedFrame
            ? await isOnRWS(selectedFrame)
            : false;

          portRef.current?.postMessage({
            selectedFrame,
            removeAllFramePopovers: isFrameSelectedFromDevTool,
            thirdPartyCookies: thirdPartyCookies.length,
            firstPartyCookies: firstPartyCookies.length,
            blockedCookies: blockedCookies.length,
            blockedReasons: blockedReasons.join(', '),
            isInspecting,
            isForProtectedAudience: Boolean(selectedAdUnit),
            isOnRWS: isFrameOnRWS,
          });
        }
      } catch (error) {
        // Silently fail.
      }
    })();
  }, [
    selectedAdUnit,
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
