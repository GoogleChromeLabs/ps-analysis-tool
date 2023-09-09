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
import { useEffect, useRef } from 'react';

interface useFrameOverlayProps {
  selectedFrame: string | null;
}

const useFrameOverlay = ({ selectedFrame }: useFrameOverlayProps) => {
  const portRef = useRef(null);

  useEffect(() => {
    chrome.runtime.onConnect.addListener((port) => {
      console.log('Connected');

      portRef.current = port;

      port.onMessage.addListener(console.log);
    });
  }, []);

  useEffect(() => {
    console.log(selectedFrame, 'selectedFrame');
    console.log(portRef.current);

    if (selectedFrame && portRef.current) {
      portRef.current.postMessage({
        selectedFrame,
      });
    }
  }, [selectedFrame]);
};

export default useFrameOverlay;
