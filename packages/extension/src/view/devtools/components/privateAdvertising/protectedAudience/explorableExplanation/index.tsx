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
import { Resizable } from 're-resizable';
import { noop } from '@google-psat/common';
import {
  app,
  userSketch,
  interestGroupSketch,
  sketch,
} from '@google-psat/explorable-explanations';
import { ReactP5Wrapper } from '@p5-wrapper/react';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Tray from './tray';

const ExplorableExplanation = () => {
  const [play, setPlay] = useState(true);
  const [sliderStep, setSliderStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [multiSeller, setMultiSeller] = useState(false);
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

  const extraInterface = (
    <div className="flex gap-2 items-center">
      <label className="text-raisin-black dark:text-bright-gray text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={interactiveMode}
          onChange={(e) => setInteractiveMode(e.target.checked)}
        />
        Interactive Mode
      </label>
      <label className="text-raisin-black dark:text-bright-gray text-sm flex items-center gap-2">
        <input
          type="checkbox"
          checked={multiSeller}
          onChange={(e) => setMultiSeller(e.target.checked)}
        />
        Multi Seller
      </label>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
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
        <main style={{ position: 'relative', height: '100%' }}>
          <div id="ps-canvas">
            <div id="canvas-container">
              <div className="controls">
                <button
                  id="previous-div"
                  disabled
                  className="play-pause-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#808080"
                  >
                    <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Zm-80-240Zm0 90v-180l-136 90 136 90Z" />
                  </svg>
                </button>
                <button id="next-div" className="play-pause-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="#808080"
                  >
                    <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Zm80-240Zm0 90 136-90-136-90v180Z" />
                  </svg>
                </button>
                <div id="interactive-mode-div">
                  <label htmlFor="interactive-mode">
                    <input
                      type="checkbox"
                      name="interactive-mode"
                      id="interactive-mode"
                    />
                    Interactive Mode
                  </label>
                </div>
                <div id="multi-seller-div">
                  <label htmlFor="multi-seller">
                    <input
                      type="checkbox"
                      name="multi-seller"
                      id="multi-seller"
                    />
                    Multi-Sellers
                  </label>
                </div>
              </div>
            </div>
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
      <ReactP5Wrapper sketch={interestGroupSketch} />
      <ReactP5Wrapper sketch={userSketch} />
      <Resizable
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
      </Resizable>
    </div>
  );
};

export default ExplorableExplanation;
