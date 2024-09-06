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
  firstOption: string;
  secondOption: string;
  pillToggle: string;
  setPillToggle: (value: string) => void;
}

const PillToggle = ({
  firstOption,
  secondOption,
  pillToggle,
  setPillToggle,
}: PillToggleProps) => {
  return (
    <div className="w-80 h-8 rounded-full border border-gray-300 dark:border-quartz text-sm">
      <button
        className={classNames(
          'w-1/2 h-full rounded-full text-raisin-black dark:text-bright-gray',
          {
            'bg-gray-200 dark:bg-gray-500 ': pillToggle === firstOption,
            'bg-transparent': pillToggle !== firstOption,
          }
        )}
        onClick={() => setPillToggle(firstOption)}
      >
        {firstOption}
      </button>
      <button
        className={classNames(
          'w-1/2 h-full rounded-full text-raisin-black dark:text-bright-gray',
          {
            'bg-gray-200 dark:bg-gray-500': pillToggle === secondOption,
            'bg-transparent': pillToggle !== secondOption,
          }
        )}
        onClick={() => setPillToggle(secondOption)}
      >
        {secondOption}
      </button>
    </div>
  );
};

export default PillToggle;
