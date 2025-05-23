/*
 * Copyright 2023 Google LLC
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

const LINE_COUNT = 10;
const INITIAL_TIME = 50;
const TIME_DURATION = 50;

const Timeline = () => {
  const lines = Array.from({ length: LINE_COUNT });

  return (
    <div>
      <header className="flex justify-between">
        <p>Auction Start: 12:18:27</p>
        <p>Auction Time: 380ms</p>
      </header>
      <div className="h-[300px] flex justify-evenly border-pale-cornflower-blue border-1 mt-2">
        {lines.map((_, index) => {
          return (
            <div
              className="border-pale-cornflower-blue border-1 h-full relative"
              key={index}
            >
              <span className="absolute right-0 pr-2 block text-xs">
                {INITIAL_TIME + index * TIME_DURATION}ms
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timeline;
