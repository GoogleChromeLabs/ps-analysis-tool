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
import React, { useEffect, useRef, useCallback } from 'react';

/**
 * Internal dependencies.
 */
import { WEBPAGE_PORT_NAME } from '../../../constants';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import { useFilterManagementStore } from '../stateProviders/filterManagementStore';

interface Response {
  attributes: { src: React.SetStateAction<string | null> };
}

const getPayload = (filteredCookies, isInspecting, selectedFrame) => {
  const thirdPartyCookies = filteredCookies
    ? filteredCookies.filter((cookie) => !cookie.isFirstParty)
    : [];
  const firstPartyCookies = filteredCookies
    ? filteredCookies.filter((cookie) => cookie.isFirstParty)
    : [];

  return {
    selectedFrame,
    thirdPartyCookies: thirdPartyCookies.length,
    firstPartyCookies: firstPartyCookies.length,
    isInspecting,
  };
};

const useFrameOverlay = () => {
  const portRef = useRef<chrome.runtime.Port | null>(null);

  const {
    isInspecting,
    setSelectedFrame,
    inspectedFrame,
    selectedFrame,
    setInspectedFrame,
  } = useCookieStore(({ state, actions }) => ({
    setSelectedFrame: actions.setSelectedFrame,
    isInspecting: state.isInspecting,
    inspectedFrame: state.inspectedFrame,
    setInspectedFrame: actions.setInspectedFrame,
    selectedFrame: state.selectedFrame,
  }));

  const { filteredCookies } = useFilterManagementStore(({ state }) => ({
    filteredCookies: state.filteredCookies,
  }));

  const onConnect = useCallback(
    (port) => {
      if (port.name !== WEBPAGE_PORT_NAME) {
        return;
      }

      portRef.current = port;

      // eslint-disable-next-line no-console
      console.log('Web port connected.');

      portRef.current.onMessage.addListener((response: Response) => {
        if (response?.attributes?.src) {
          // eslint-disable-next-line no-console
          console.log(response.attributes.src);
          setInspectedFrame(response.attributes.src);
        }
      });

      portRef.current.onDisconnect.addListener(() => {
        portRef.current = null;
        // eslint-disable-next-line no-console
        console.log('Web port disconnected.');
      });
    },
    [setInspectedFrame]
  );

  useEffect(() => {
    chrome.runtime.onConnect.addListener(onConnect);
  }, [onConnect]);

  useEffect(() => {
    if (!portRef.current) {
      return;
    }

    portRef.current.postMessage({
      isInspecting,
    });
  }, [isInspecting]);

  useEffect(() => {
    if (selectedFrame && portRef.current) {
      const payload = getPayload(filteredCookies, isInspecting, selectedFrame);

      portRef.current.postMessage(payload);
    }
  }, [selectedFrame, filteredCookies, isInspecting]);

  useEffect(() => {
    setSelectedFrame(inspectedFrame);
  }, [inspectedFrame, setSelectedFrame]);
};

export default useFrameOverlay;
