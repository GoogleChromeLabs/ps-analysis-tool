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
import { useStore } from '../store';
import { scenarios } from '../store/scenarios';

const SequenceDiagram = () => {
  const { messageCount, incrementMessageCount, currentScenario, currentStep } =
    useStore(({ state, actions }) => ({
      messageCount: state.messageCount,
      incrementMessageCount: actions.incrementMessageCount,
      currentScenario: state.currentScenario,
      currentStep: state.currentStep,
    }));

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [messageElements, setMessageElements] = useState<
    Array<React.JSX.Element>
  >([]);
  const messageCountRef = useRef(messageCount);

  useEffect(() => {
    messageCountRef.current = messageCount;
  }, [messageCount]);

  const addMessage = useCallback(
    (
      fromEntity: string,
      toEntity: string,
      text: string,
      selfMessage = false
    ) => {
      const container = messageContainerRef.current;
      const fromRect = document
        ?.getElementById(fromEntity)
        ?.getBoundingClientRect();
      const toRect = document
        ?.getElementById(toEntity)
        ?.getBoundingClientRect();

      if (!fromRect || !toRect || !container) {
        return;
      }

      const containerRect = container.getBoundingClientRect();
      const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
      const toX = toRect.left + toRect.width / 2 - containerRect.left;

      const isReversed = fromX > toX;

      let leftPosition, width;

      if (selfMessage) {
        leftPosition = fromX - 40;
        width = 80;

        const containerHeight = containerRect.height;
        const spacing = Math.min(40, Math.max(30, containerHeight / 12));
        const top = `${50 + messageCountRef.current * spacing}px`;

        const messageElement = (
          <div
            className="message self-message absolute"
            style={{ left: `${leftPosition}px`, width: `${width}px`, top }}
          >
            <div className="self-message-loop relative w-[80%] h-[30px] ml-[35px]">
              <div className="loop-segment loop-segment-1 absolute bg-gray-800 h-[2px] w-[35px] top-[15px] left-0"></div>
              <div className="loop-segment loop-segment-2 absolute bg-gray-800 w-[2px] h-[20px] top-[15px] left-[35px]"></div>
              <div className="loop-segment loop-segment-3 absolute bg-gray-800 h-[2px] w-[35px] top-[35px] left-0">
                <div className="loop-arrow absolute top-[-4px] left-[-4px] w-0 h-0 border-t-[5px] border-b-[5px] border-b-transparent border-t-transparent border-r-[8px] border-r-gray-800"></div>
              </div>
              <div className="message-label absolute top-[-10px] w-[90%] text-center px-2 py-1 bg-white/80 rounded text-xs">
                {text}
              </div>
            </div>
          </div>
        );

        setMessageElements((prev) => [...prev, messageElement]);
        incrementMessageCount();
      } else {
        // Normal message between entities
        leftPosition = isReversed ? toX : fromX;
        width = Math.abs(toX - fromX);

        const containerHeight = containerRect.height;
        const spacing = Math.min(40, Math.max(30, containerHeight / 12));
        const top = `${50 + messageCountRef.current * spacing}px`;

        const messageElement = (
          <div
            className={`message ${isReversed ? 'reverse' : ''} absolute`}
            style={{ left: `${leftPosition}px`, width: `${width}px`, top }}
          >
            <div className="message-line h-[2px] bg-gray-800 relative flex-grow">
              <div className="message-arrow absolute right-[-1px] top-[-4px] w-0 h-0 border-t-[5px] border-b-[5px] border-b-transparent border-t-transparent border-l-[8px] border-l-gray-800"></div>
            </div>
            <div className="message-label absolute px-2 py-1 bg-white/80 rounded text-xs top-[-25px] left-1/2 -translate-x-1/2 whitespace-nowrap">
              {text}
            </div>
          </div>
        );

        setMessageElements((prev) => [...prev, messageElement]);
      }

      incrementMessageCount();

      // Auto-scroll message container to bottom when new arrows/messages are added
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    [incrementMessageCount]
  );

  useEffect(() => {
    const action = scenarios[currentScenario].steps[currentStep]?.action?.();

    if (action?.addMessage?.length) {
      addMessage(...action.addMessage);
    }
  }, [addMessage, currentScenario, currentStep]);

  useEffect(() => {
    if (currentStep === -1) {
      setMessageElements([]);
    }
  }, [currentStep]);

  return (
    <div
      id="sequence-diagram"
      className="flex flex-row justify-between items-stretch w-[600px] min-w-[600px] min-h-[400px] p-5 bg-white border border-gray-200 rounded-lg shadow-md max-h-[550px]"
    >
      <div className="entity flex flex-col items-center w-[120px] h-full">
        <div className="entity-label px-3 py-2 bg-blue-50 border border-blue-100 rounded text-center w-full text-sm font-medium text-blue-900 mb-2">
          User
        </div>
        <div className="entity-lifeline w-[2px] bg-blue-100 flex-grow mt-2"></div>
      </div>
      <div className="entity flex flex-col items-center w-[120px] h-full">
        <div className="entity-label px-3 py-2 bg-blue-50 border border-blue-100 rounded text-center w-full text-sm font-medium text-blue-900 mb-2">
          Browser
        </div>
        <div className="entity-lifeline w-[2px] bg-blue-100 flex-grow mt-2"></div>
      </div>
      <div className="entity flex flex-col items-center w-[120px] h-full">
        <div className="entity-label px-3 py-2 bg-blue-50 border border-blue-100 rounded text-center w-full text-sm font-medium text-blue-900 mb-2">
          RP
        </div>
        <div className="entity-lifeline w-[2px] bg-blue-100 flex-grow mt-2"></div>
      </div>
      <div className="entity flex flex-col items-center w-[120px] h-full">
        <div className="entity-label px-3 py-2 bg-blue-50 border border-blue-100 rounded text-center w-full text-sm font-medium text-blue-900 mb-2">
          IdP
        </div>
        <div className="entity-lifeline w-[2px] bg-blue-100 flex-grow mt-2"></div>
      </div>
      <div
        id="message-container"
        ref={messageContainerRef}
        className="absolute left-0 right-0 top-[60px] overflow-y-auto overflow-x-visible z-20"
      >
        {messageElements.map((element, index) => (
          <div key={index}>{element}</div>
        ))}
      </div>
    </div>
  );
};

export default SequenceDiagram;
