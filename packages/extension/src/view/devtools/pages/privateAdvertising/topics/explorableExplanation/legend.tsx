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
import React from 'react';

const Legend = () => {
  return (
    <div className="p-3 text-[12.5px] text-raisin-black dark:text-bright-gray">
      <p>
        This explorable explanation shows user journeys on the web. Each site
        has topics describing its content, adtech companies extract these topics
        to serve targeted ads.
      </p>
      <p className="pb-2">
        Each epoch represents a week of user activity. The epoch table lists
        topics and the adtechs that accessed them. Click on small colored
        bubbles (when paused) to see associated adtechs being highlighted in the
        epoch table.
      </p>
      <div className="flex gap-2 items-center">
        <div className="w-4 h-4">
          <div className="flex justify-center w-4">
            <div className="rounded-full w-2 h-2 bg-[#4e79a7]"></div>
          </div>
          <div className="flex">
            <div className="rounded-full w-2 h-2 bg-[#e15759]"></div>
            <div className="rounded-full w-2 h-2 bg-[#f28e2c]"></div>
          </div>
        </div>
        <p>Small colored bubbles represent adtech companies.</p>
      </div>
    </div>
  );
};

export default Legend;
