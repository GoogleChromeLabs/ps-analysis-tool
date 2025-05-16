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
import classNames from 'classnames';
import React from 'react';

interface PillToggleProps {
  options: string[];
  pillToggle: string;
  setPillToggle: (value: string) => void;
  eeAnimatedTab: boolean;
}

const PillToggle = ({
  options,
  pillToggle,
  setPillToggle,
  eeAnimatedTab,
}: PillToggleProps) => {
  return (
    <div className="w-96 h-8 rounded-full border border-gray-300 dark:border-quartz text-sm">
      {options.map((option) => {
        return (
          <button
            key={option}
            className={classNames(
              `h-full rounded-full text-raisin-black dark:text-bright-gray w-1/${options.length}`,
              {
                'bg-gray-200 dark:bg-gray-500 ': pillToggle === option,
                'bg-transparent': pillToggle !== option,
                'text-xs': eeAnimatedTab,
              }
            )}
            onClick={() => setPillToggle(option)}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};

export default PillToggle;
