/*
 * Copyright 2025 Google LLC
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

/**
 * Internal dependencies.
 */
import { initializeCanvas } from '../canvas';
import { useStore } from '../store';
import { getSessionStorage } from '@google-psat/common';

const SequenceDiagram = () => {
  const { setCanvas } = useStore(({ actions }) => ({
    setCanvas: actions.setCanvas,
  }));
  const componentContainerRef = useRef<HTMLDivElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [coordinates, _setCoordinates] = useState<{
    [id: string]: { x: number; y: number };
  } | null>(null);

  const setCoordinates = useCallback((id: string, x: number, y: number) => {
    _setCoordinates((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(async () => {
      const data = await getSessionStorage(
        'fedcm-explorable-explanation-state'
      );

      const { currentScenarioKey, currentStep } = data || {};
      const idToLoad =
        currentScenarioKey && currentStep && currentStep > -1
          ? `${currentScenarioKey}-${currentStep}`
          : undefined;

      if (
        messageContainerRef.current &&
        parentContainerRef.current &&
        componentContainerRef.current
      ) {
        const canvas = initializeCanvas(
          componentContainerRef.current,
          messageContainerRef.current,
          setCoordinates,
          idToLoad
        );
        setCanvas(canvas);
      }
    }, 100);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [setCanvas, setCoordinates]);

  useEffect(() => {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { dispatchId, type } = customEvent.detail;

      if (type === 'previousCheckpoint') {
        parentContainerRef.current?.scrollTo({
          top: 0,
          behavior: 'smooth',
        });

        return;
      }

      if (!dispatchId) {
        return;
      }

      const [scenarioKey, stepIndex] = (dispatchId as string)
        .split('-')
        .slice(-2);

      const { y } = coordinates?.[`${scenarioKey}-${stepIndex}`] || {
        y: 0,
      };

      if (
        parentContainerRef.current &&
        y + 180 > parentContainerRef.current.clientHeight
      ) {
        parentContainerRef.current.scrollTo({
          top: y - parentContainerRef.current.clientHeight + 180,
          behavior: 'smooth',
        });
      }
    };

    const animatorListener = () => {
      parentContainerRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    document.addEventListener('ee:dispatchId', listener);
    document.addEventListener('ee:animatorDraw', animatorListener);

    return () => {
      document.removeEventListener('ee:dispatchId', listener);
      document.removeEventListener('ee:animatorDraw', animatorListener);
    };
  }, [coordinates]);

  return (
    <div
      id="sequence-diagram"
      className="relative w-fit h-fit flex justify-center items-start bg-white border border-[#ccc] shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-lg"
    >
      <div
        className="overflow-y-auto min-w-[860px] max-h-[340px] mt-[110px]"
        ref={parentContainerRef}
      >
        <div
          className="absolute top-0 left-0 w-[800px] h-full"
          ref={componentContainerRef}
        />
        <div
          id="message-container"
          ref={messageContainerRef}
          className="relative w-[800px] h-[1400px]"
        />
      </div>
    </div>
  );
};

export default SequenceDiagram;
