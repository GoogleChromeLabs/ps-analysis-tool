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
import { PauseIcon, PlayIcon, RestartIcon } from '@google-psat/design-system';
import React from 'react';

/**
 * Internal dependencies.
 */
import Slider from './slider';

interface HeaderProps {
  play: boolean;
  setPlay: () => void;
  reset: () => void;
  historyCount: number;
  sliderStep: number;
  setSliderStep: React.Dispatch<React.SetStateAction<number>>;
  extraInterface?: React.ReactNode;
}

const Header = ({
  play,
  setPlay,
  reset,
  historyCount,
  sliderStep,
  setSliderStep,
  extraInterface,
}: HeaderProps) => {
  return (
    <div className="w-full px-2 flex items-center justify-between border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green h-[26px]">
      <div className="flex items-center divide-x divide-gray-300 dark:divide-bright-gray text-slate-700 dark:text-bright-gray">
        <button
          className="pr-2"
          onClick={setPlay}
          title={play ? 'Pause' : 'Play'}
        >
          {play ? (
            <PauseIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
          ) : (
            <PlayIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
          )}
        </button>
        <button className="px-2" onClick={reset} title="Restart">
          <RestartIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
        </button>
        <div className="px-2">
          <Slider sliderStep={sliderStep} setSliderStep={setSliderStep} />
        </div>
        {extraInterface && <div className="px-2">{extraInterface}</div>}
      </div>
      <p className="text-raisin-black dark:text-bright-gray">
        History count: {historyCount}
      </p>
    </div>
  );
};

export default Header;
