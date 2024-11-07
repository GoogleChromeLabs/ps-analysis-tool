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
import React, { useState } from 'react';
import { Resizable } from 're-resizable';
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import Header from '../../../explorableExplanation/header';
import Tray from './tray';

const ExplorableExplanation = () => {
  const [play, setPlay] = useState(false);
  const [sliderStep, setSliderStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [interactiveMode, setInteractiveMode] = useState(false);
  const [multiSeller, setMultiSeller] = useState(false);
  const historyCount = 10;

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
        setPlay={setPlay}
        sliderStep={sliderStep}
        setSliderStep={setSliderStep}
        historyCount={historyCount}
        reset={noop}
        extraInterface={extraInterface}
      />
      <div className="flex-1" />
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
