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
import React, { useEffect, useRef } from 'react';

/**
 * Internal dependencies.
 */
import { WEBPAGE_PORT_NAME } from '../../../constants';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import { useFilterManagementStore } from '../stateProviders/filterManagementStore';
import { getCurrentTabId } from '../../../utils/getCurrentTabId';

interface Response {
  attributes: { iframeOrigin: React.SetStateAction<string | null> };
}

const useFrameOverlay = () => {
  const portRef = useRef<chrome.runtime.Port | null>(null);

  const {
    isInspecting,
    setIsInspecting,
    setSelectedFrame,
    setContextInvalidated,
    selectedFrame,
    isCurrentTabBeingListenedTo,
    allowedNumberOfTabs,
  } = useCookieStore(({ state, actions }) => ({
    setContextInvalidated: actions.setContextInvalidated,
    isInspecting: state.isInspecting,
    setSelectedFrame: actions.setSelectedFrame,
    setIsInspecting: actions.setIsInspecting,
    selectedFrame: state.selectedFrame,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  const { filteredCookies } = useFilterManagementStore(({ state }) => ({
    filteredCookies: state.filteredCookies,
  }));

  // When inspect button is clicked.
  useEffect(() => {
    (async () => {
      // Indicates that the context was invalidated.
      if (!chrome.runtime?.id && setContextInvalidated) {
        setContextInvalidated(true);
        return;
      }

      if (!isInspecting) {
        if (portRef.current) {
          portRef.current.disconnect();
          portRef.current = null;
        }

        return;
      }

      const tabId = await getCurrentTabId();

      if (!tabId) {
        return;
      }

      const portName = `${WEBPAGE_PORT_NAME}-${tabId}`;

      portRef.current = chrome.tabs.connect(Number(tabId), {
        name: portName,
      });

      portRef.current.onMessage.addListener((response: Response) => {
        setSelectedFrame(response.attributes.iframeOrigin || '');
      });

      portRef.current.onDisconnect.addListener(() => {
        setIsInspecting(false);
      });

      // For the first time.
      portRef.current.postMessage({
        isInspecting: true,
      });
    })();
  }, [isInspecting, setSelectedFrame, setIsInspecting, setContextInvalidated]);

  useEffect(() => {
    if (
      allowedNumberOfTabs === 'single' &&
      !isCurrentTabBeingListenedTo &&
      chrome.runtime?.id &&
      portRef.current
    ) {
      portRef.current.disconnect();
      portRef.current = null;
    }
  }, [allowedNumberOfTabs, isCurrentTabBeingListenedTo]);

  useEffect(() => {
    if (isInspecting && portRef.current) {
      const thirdPartyCookies = filteredCookies
        ? filteredCookies.filter((cookie) => !cookie.isFirstParty)
        : [];
      const firstPartyCookies = filteredCookies
        ? filteredCookies.filter((cookie) => cookie.isFirstParty)
        : [];

      portRef.current.postMessage({
        selectedFrame,
        thirdPartyCookies: thirdPartyCookies.length,
        firstPartyCookies: firstPartyCookies.length,
        isInspecting,
      });
    }
  }, [selectedFrame, filteredCookies, isInspecting]);
};

export default useFrameOverlay;
