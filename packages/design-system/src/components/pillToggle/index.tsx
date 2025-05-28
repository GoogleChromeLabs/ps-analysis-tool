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
import React, { useRef } from 'react';

interface PillToggleProps {
  options: string[];
  pillToggle: string;
  setPillToggle: (value: string) => void;
  eeAnimatedTab: boolean;
  width?: string;
}

const PillToggle = ({
  options,
  pillToggle,
  setPillToggle,
  eeAnimatedTab,
  width = 'w-max',
}: PillToggleProps) => {
  const selectedIndexRef = useRef<number | null>(null);

  options.forEach((option, index) => {
    if (pillToggle === option) {
      selectedIndexRef.current = index;
    }
  });

  return (
    <div className="h-8 border rounded-full w-max border-gray-300 dark:border-quartz text-sm">
      {options.map((option, index) => {
        return (
          <button
            key={option}
            className={classNames(
              `px-5 h-full border-r border-gray-silver dark:border-quartz text-raisin-black dark:text-bright-gray`,
              width,
              {
                'bg-anti-flash-white dark:bg-gray-500 ': pillToggle === option,
                'bg-white dark:bg-raisin-black backdrop-opacity-1':
                  selectedIndexRef.current && index < selectedIndexRef.current,
                'bg-transparent':
                  selectedIndexRef.current && index > selectedIndexRef.current,
                'text-xs': eeAnimatedTab,
                'rounded-r-full -ml-[10px]': index > 0,
                'rounded-full': index === 0,
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
