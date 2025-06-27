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
import { getSessionStorage, updateSessionStorage } from '@google-psat/common';
import classNames from 'classnames';
import React, { useEffect } from 'react';

interface PillToggleProps {
  options: string[];
  pillToggle: string;
  setPillToggle: (value: string) => void;
  eeAnimatedTab: boolean;
  width?: string;
  highlightOption?: string;
  setHighlightOption?: (value: string) => void;
  persistenceKey?: string;
}

const PillToggle = ({
  options,
  pillToggle,
  setPillToggle,
  eeAnimatedTab,
  width = 'w-max',
  highlightOption,
  setHighlightOption,
  persistenceKey,
}: PillToggleProps) => {
  useEffect(() => {
    if (pillToggle === highlightOption) {
      setHighlightOption?.('');
    }
  }, [highlightOption, pillToggle, setHighlightOption]);

  useEffect(() => {
    if (!persistenceKey) {
      return;
    }

    (async () => {
      const sessionStorage = await getSessionStorage('pillToggle');

      if (sessionStorage?.[persistenceKey]?.value) {
        setPillToggle(sessionStorage[persistenceKey].value);
      }
    })();
  }, [persistenceKey, setPillToggle]);

  useEffect(() => {
    if (!persistenceKey) {
      return;
    }

    (async () => {
      await updateSessionStorage(
        {
          [persistenceKey]: {
            value: pillToggle,
          },
        },
        'pillToggle'
      );
    })();
  }, [persistenceKey, pillToggle]);

  return (
    <div className="h-8 border rounded-full w-max border-gray-300 dark:border-quartz text-sm">
      {options.map((option, index) => {
        return (
          <button
            key={option}
            style={{ zIndex: options.length - index }}
            className={classNames(
              `px-5 h-full border-r border-gray-silver dark:border-quartz text-raisin-black dark:text-bright-gray relative`,
              width,
              {
                'dark:bg-raisin-black bg-white': pillToggle === option,
                'bg-anti-flash-white dark:bg-gray-500 ': pillToggle !== option,
                'text-xs': eeAnimatedTab,
                'rounded-r-full -ml-[10px]': index > 0,
                'rounded-full': index === 0,
                underline: highlightOption === option,
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
