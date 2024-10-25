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
import React, { useState } from 'react';
import Slider from './slider';

const Header = () => {
  const [play, setPlay] = useState(false);

  return (
    <div className="w-full px-2 flex items-center justify-between border-american-silver dark:border-quartz bg-anti-flash-white dark:bg-charleston-green h-[26px]">
      <div className="flex items-center divide-x divide-gray-300 text-slate-700 text-sm">
        <button
          className="pr-2 hover:opacity-70 active:opacity-50"
          onClick={() => setPlay(!play)}
        >
          {play ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
        </button>
        <button className="px-2 hover:opacity-70 active:opacity-50">
          <RestartIcon className="h-5 w-5" />
        </button>
        <div className="px-2">
          <Slider />
        </div>
      </div>
      <p>History count: 0</p>
    </div>
  );
};

export default Header;
