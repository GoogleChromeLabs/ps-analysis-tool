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

interface UseFrameOverlayProps {
  selectedFrame: string | null;
  setInspectedFrame: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Response {
  attributes: { src: React.SetStateAction<string | null> };
}

const useFrameOverlay = ({
  selectedFrame,
  setInspectedFrame,
}: UseFrameOverlayProps) => {
  const portRef = useRef<chrome.runtime.Port | null>(null);

  const { isInspecting } = useCookieStore(({ state }) => ({
    isInspecting: state.isInspecting,
  }));

  useEffect(() => {
    if (!portRef.current) {
      return;
    }

    portRef.current.postMessage({
      FrameInspect: isInspecting ? 'start' : 'stop',
    });
  }, [isInspecting]);

  useEffect(() => {
    chrome.runtime.onConnect.addListener((port) => {
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
    });
  }, [setInspectedFrame]);

  useEffect(() => {
    if (selectedFrame && portRef.current) {
      // eslint-disable-next-line no-console
      console.log(selectedFrame);

      portRef.current.postMessage({
        selectedFrame,
      });
    }
  }, [selectedFrame]);
};

export default useFrameOverlay;
