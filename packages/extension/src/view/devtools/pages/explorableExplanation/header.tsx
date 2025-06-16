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
import {
  PauseIcon,
  PlayIcon,
  RestartIcon,
  NextIcon,
  PreviousIcon,
  Slider,
} from '@google-psat/design-system';
// @ts-ignore package does not have types
import { app } from '@google-psat/explorable-explanations';
import React from 'react';
import classNames from 'classnames';
interface HeaderProps {
  play: boolean;
  setPlay: () => void;
  reset: () => void;
  historyCount: number;
  sliderStep: number;
  setSliderStep:
    | React.Dispatch<React.SetStateAction<number>>
    | ((step: number) => void);
  showNextPrevButtons: boolean;
  extraInterface?: React.ReactNode;
  disablePlayButton?: boolean;
}

const Header = ({
  play,
  setPlay,
  reset,
  historyCount,
  sliderStep,
  setSliderStep,
  showNextPrevButtons,
  extraInterface,
  disablePlayButton = false,
}: HeaderProps) => {
  return (
    <div className="w-full px-2 flex items-center justify-between border-b border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green h-[26px] min-w-[900px]">
      <div className="flex items-center divide-x divide-gray-300 dark:divide-bright-gray text-slate-700 dark:text-bright-gray">
        <button
          className={classNames('pr-2', {
            'hover:opacity-70 active:opacity-50': !disablePlayButton,
            'opacity-50 pointer-events-none': disablePlayButton,
          })}
          onClick={setPlay}
          title={play ? 'Pause' : 'Play'}
          disabled={disablePlayButton}
        >
          {play ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
        {showNextPrevButtons && (
          <div className="flex gap-1 px-2">
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
        )}
        <button className="px-2" onClick={reset} title="Restart">
          <RestartIcon className="h-5 w-5 hover:opacity-70 active:opacity-50" />
        </button>
        <div className="px-2">
          <Slider sliderStep={sliderStep} setSliderStep={setSliderStep} />
        </div>
        {extraInterface && <div className="px-2">{extraInterface}</div>}
      </div>
      <p className="text-raisin-black dark:text-bright-gray whitespace-nowrap">
        History count: {historyCount}
      </p>
    </div>
  );
};

export default Header;
