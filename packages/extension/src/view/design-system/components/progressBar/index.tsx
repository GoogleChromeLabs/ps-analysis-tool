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

interface ProgressBarProps {
  intervalCounter: number;
  initialProcessed?: boolean;
  totalProcessed?: number;
}
const ProgressBar = ({
  intervalCounter,
  initialProcessed,
  totalProcessed,
}: ProgressBarProps) => {
  return (
    <div className="w-96 min-h-[20rem] flex items-center justify-center flex-col gap-2 relative">
      <p className="mb-6 text-center text-comet-black text-sm font-bold ml-2">
        Analyzing previous tabs, please wait...
      </p>
      <div className="mb-6 h-1 w-full bg-gainsboro dark:bg-neutral-600">
        <div
          className="h-1 bg-royal-blue absolute left-0"
          style={{ width: `${intervalCounter}px` }}
        ></div>
        {intervalCounter >= 50 && !initialProcessed && (
          <div
            className="h-1 bg-royal-blue absolute left-12"
            style={{ width: `${totalProcessed}%` }}
          ></div>
        )}
      </div>
      <p className="mt-7 text-center text-comet-black text-xxxs ml-2">
        This tool works best with maximum 2 tabs.
      </p>
    </div>
  );
};

export default ProgressBar;
