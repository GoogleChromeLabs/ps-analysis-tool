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
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from '../store';
import { scenarios } from '../scenarios';

/**
 *
 */
export default function SequenceDiagram() {
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
      const container = messageContainerRef.current!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const fromRect = document
        ?.getElementById(fromEntity)
        ?.getBoundingClientRect()!;
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      const toRect = document
        ?.getElementById(toEntity)
        ?.getBoundingClientRect()!;

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
            className="message self-message"
            style={{ left: `${leftPosition}px`, width: `${width}px`, top }}
          >
            <div className="self-message-loop">
              <div className="loop-segment loop-segment-1"></div>
              <div className="loop-segment loop-segment-2"></div>
              <div className="loop-segment loop-segment-3">
                <div className="loop-arrow"></div>
              </div>
              <div className="message-label">{text}</div>
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
            className={`message ${isReversed ? 'reverse' : ''}`}
            style={{ left: `${leftPosition}px`, width: `${width}px`, top }}
          >
            <div className="message-line">
              <div className="message-arrow"></div>
            </div>
            <div className="message-label">{text}</div>
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
    <div id="sequence-diagram">
      <div className="entity" id="user-entity">
        <div className="entity-label">User</div>
        <div className="entity-lifeline"></div>
      </div>
      <div className="entity" id="browser-entity">
        <div className="entity-label">Browser</div>
        <div className="entity-lifeline"></div>
      </div>
      <div className="entity" id="rp-entity">
        <div className="entity-label">RP</div>
        <div className="entity-lifeline"></div>
      </div>
      <div className="entity" id="idp-entity">
        <div className="entity-label">IdP</div>
        <div className="entity-lifeline"></div>
      </div>
      <div id="message-container" ref={messageContainerRef}>
        {messageElements.map((element, index) => (
          <div key={index}>{element}</div>
        ))}
      </div>
    </div>
  );
}
