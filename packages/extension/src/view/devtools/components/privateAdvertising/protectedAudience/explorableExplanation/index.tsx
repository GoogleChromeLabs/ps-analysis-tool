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
import React, { useState, useCallback } from 'react';
import { noop } from '@google-psat/common';
import {
  app,
  userSketch,
  interestGroupSketch,
  sketch,
  config,
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

const ExplorableExplanation = () => {
  const [play, setPlay] = useState(true);
  const [sliderStep, setSliderStep] = useState(1);
  //const [activeTab, setActiveTab] = useState(0);
  const [interactiveMode, _setInteractiveMode] = useState(false);
  const [multiSeller, _setMultiSeller] = useState(false);
  const historyCount = 10;

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

  const setMultiSellerMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      _setMultiSeller(event.target.checked);
      app.toggleMultSeller();
    },
    []
  );

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2">
        <input
          type="checkbox"
          checked={interactiveMode}
          onChange={setInteractiveMode}
        />
        Interactive Mode
      </label>
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2">
        <input
          type="checkbox"
          checked={multiSeller}
          onChange={setMultiSellerMode}
        />
        Multi Seller
      </label>
      <button
        id="previous-div"
        disabled
        className="play-pause-button"
        onClick={app.handlePrevButton}
      >
        <PreviousIcon />
      </button>
      <button
        id="next-div"
        className="play-pause-button"
        onClick={app.handleNextButton}
      >
        <NextIcon />
      </button>
    </div>
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{
        '--expandedBubbleWidth': `${config.bubbles.expandedBubbleX - 320}px`,
      }}
    >
      <Header
        play={play}
        setPlay={setPlaying}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={historyCount}
        reset={noop}
        extraInterface={extraInterface}
      />
      <div className="w-full h-full">
        <main className="h-full w-full overflow-auto relative">
          <div id="ps-canvas">
            <div id="canvas-container" />
          </div>
          <div id="interest-canvas"></div>
          <div id="bubble-container-div" className="bubble-container">
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
      />
      <ReactP5Wrapper sketch={userSketch} />
      {/* <Resizable
        defaultSize={{
          width: '100%',
          height: '20%',
        }}
        minHeight="15%"
        maxHeight="95%"
        enable={{
          top: true,
        }}
        className="h-full flex"
      >
        <Tray activeTab={activeTab} setActiveTab={setActiveTab} />
      </Resizable> */}
    </div>
  );
};

export default ExplorableExplanation;
