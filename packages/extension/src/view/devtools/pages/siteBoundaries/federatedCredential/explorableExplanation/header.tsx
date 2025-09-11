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
import {
  PauseIcon,
  PlayIcon,
  RestartIcon,
  NextIcon,
  PreviousIcon,
  Slider,
} from '@google-psat/design-system';
import React, { useEffect } from 'react';

/**
 * Internal dependencies.
 */
import { useStore } from './store';

interface HeaderProps {
  historyCount?: number;
}

const Header = ({ historyCount }: HeaderProps) => {
  const { play, speed, setIsPlaying, nextStep, prevStep, reset, setSpeed } =
    useStore(({ state, actions }) => ({
      play: state.play,
      speed: state.speed,
      setIsPlaying: actions.setIsPlaying,
      nextStep: actions.nextStep,
      prevStep: actions.prevStep,
      reset: actions.reset,
      setSpeed: actions.setSpeed,
    }));

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      event.preventDefault();

      if (event.key === ' ') {
        setIsPlaying(!play);
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [play, setIsPlaying]);

  return (
    <div className="w-full px-2 flex items-center justify-between border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green h-[26px] min-w-[900px]">
      <div className="flex items-center divide-x divide-gray-300 dark:divide-bright-gray text-slate-700 dark:text-bright-gray">
        <button
          className="disabled:opacity-50 disabled:pointer-events-none pr-2 outline-none"
          onClick={() => setIsPlaying(!play)}
          title={play ? 'Pause' : 'Play'}
        >
          {play ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>

        <div className="flex gap-1 px-2">
          <button
            id="prevButton"
            title="Previous Node"
            onClick={prevStep}
            className="disabled:opacity-50 disabled:pointer-events-none"
          >
            <PreviousIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
          </button>
          <button
            onClick={nextStep}
            id="nextButton"
            title="Next Node"
            className="disabled:opacity-50 disabled:pointer-events-none"
          >
            <NextIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
          </button>
        </div>

        <button className="px-2" onClick={reset} title="Restart">
          <RestartIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
        </button>
        <div className="px-2">
          <Slider
            sliderStep={speed}
            setSliderStep={setSpeed}
            min={0.5}
            max={4}
            step={0.5}
          />
        </div>
      </div>
      {historyCount !== undefined && (
        <p className="text-raisin-black dark:text-bright-gray whitespace-nowrap">
          History count: {historyCount}
        </p>
      )}
    </div>
  );
};

export default Header;
