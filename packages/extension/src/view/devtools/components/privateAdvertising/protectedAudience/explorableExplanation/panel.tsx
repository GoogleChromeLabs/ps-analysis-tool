/*
 * Copyright 2024 Google LLC
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
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import {
  app,
  userSketch,
  interestGroupSketch,
  sketch,
} from '@google-psat/explorable-explanations';
import { ReactP5Wrapper } from '@p5-wrapper/react';
import { NextIcon, PreviousIcon } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

const Panel = () => {
  const [play, setPlay] = useState(true);
  const [sliderStep, setSliderStep] = useState(1);
  const [interactiveMode, _setInteractiveMode] = useState(false);
  const historyCount = 8;
  const divRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedBubbleWidth, setBubbleWidth] = useState(0);
  const [expandedBubbleX, setExpandedBubbleX] = useState(0);
  const [expandedBubbleY, setExpandedBubbleY] = useState(0);

  const setPlaying = useCallback(() => {
    setPlay((prevState) => {
      if (!prevState) {
        app.play(true);
      } else {
        app.pause();
      }
      return !prevState;
    });
  }, []);

  const setInteractiveMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      _setInteractiveMode(event.target.checked);
      app.toggleInteractiveMode();
    },
    []
  );
  const handleResizeCallback = useMemo(() => {
    return new ResizeObserver(() => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;
        const newSize = Math.min(containerWidth, containerHeight) / 2;
        const centerX = (containerWidth - newSize) / 4;
        const centerY = (containerHeight - newSize) / 4;

        setBubbleWidth(newSize);
        setExpandedBubbleX(centerX);
        setExpandedBubbleY(centerY);
      }
    });
  }, []);

  useEffect(() => {
    if (divRef.current) {
      const divRect = divRef.current.getBoundingClientRect();
      const visibleWidth = Math.max(
        0,
        Math.min(divRect.right, window.innerWidth) - Math.max(divRect.left, 0)
      );
      const visibleHeight = Math.max(
        0,
        Math.min(divRect.bottom, window.innerHeight) - Math.max(divRect.top, 0)
      );

      const newSize = Math.min(visibleWidth, visibleHeight) / 2;
      const centerX = (visibleWidth - newSize) / 4;
      const centerY = (visibleHeight - newSize) / 4;

      setBubbleWidth(newSize);
      setExpandedBubbleX(centerX);
      setExpandedBubbleY(centerY);
    }
    if (containerRef.current) {
      handleResizeCallback.observe(containerRef.current);
    }
    const containerRefCopy = containerRef;
    return () => {
      app.reset(true);
      if (containerRefCopy.current) {
        handleResizeCallback.unobserve(containerRefCopy.current);
      }
    };
  }, [handleResizeCallback]);

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          type="checkbox"
          checked={interactiveMode}
          onChange={setInteractiveMode}
          className="hover:cursor-pointer"
        />
        Interactive Mode
      </label>
      <div className="flex gap-0.5">
        <button
          id="prevButton"
          title="Previous Node"
          onClick={app.handlePrevButton}
          className="disabled:opacity-50 disabled:pointer-events-none"
        >
          <PreviousIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
        </button>
        <button
          onClick={app.handleNextButton}
          id="nextButton"
          title="Next Node"
          className="disabled:opacity-50 disabled:pointer-events-none"
        >
          <NextIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{
        '--expandedBubbleWidth': `${expandedBubbleWidth}px`,
        '--expandedBubbleX': `${expandedBubbleX}px`,
        '--expandedBubbleY': `${expandedBubbleY}px`,
      }}
    >
      <Header
        play={play}
        setPlay={setPlaying}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={historyCount}
        reset={app.reset}
        extraInterface={extraInterface}
      />
      <div className="w-full h-full">
        <main className="h-full w-full overflow-auto relative" ref={divRef}>
          <div id="ps-canvas">
            <div id="canvas-container" />
          </div>
          <div id="interest-canvas"></div>
          <div
            id="bubble-container-div"
            className="bubble-container"
            ref={containerRef}
          >
            <div
              id="minified-bubble-container"
              className="minified-bubble-container"
            >
              <span id="count-display"></span>
            </div>
            <div id="open-button" style={{ color: 'black' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#808080"
              >
                <path d="M200-200v-240h80v160h160v80H200Zm480-320v-160H520v-80h240v240h-80Z" />
              </svg>
            </div>
            <div id="close-button" style={{ color: 'black' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M440-440v240h-80v-160H200v-80h240Zm160-320v160h160v80H520v-240h80Z" />
              </svg>
            </div>
          </div>
          <div id="user-canvas"></div>
        </main>
      </div>
      <ReactP5Wrapper sketch={sketch} />
      <ReactP5Wrapper
        sketch={interestGroupSketch}
        // eslint-disable-next-line no-console
        onClick={() => console.log('dole shole')}
        expandedBubbleX={expandedBubbleX}
        expandedBubbleY={expandedBubbleY}
        expandedBubbleWidth={expandedBubbleWidth}
      />
      <ReactP5Wrapper sketch={userSketch} />
    </div>
  );
};

export default Panel;
