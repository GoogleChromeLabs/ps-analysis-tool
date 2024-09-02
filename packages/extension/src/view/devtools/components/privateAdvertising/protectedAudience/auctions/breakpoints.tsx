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
import React from 'react';
import { BreakpointIcon } from '@google-psat/design-system';

const Breakpoints = () => {
  return (
    <div className="flex gap-4 text-raisin-black dark:text-bright-gray p-4">
      <div className="flex gap-2 justify-center items-center">
        <BreakpointIcon className="fill-granite-gray" />
        Ad Worklet Breakpoints
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="checkbox" />
        Bidder Bidding Phase Start
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="checkbox" />
        Bidder Reporting Phase Start
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="checkbox" />
        Seller Scoring Phase Start
      </div>
      <div className="flex gap-2 justify-center items-center">
        <input type="checkbox" />
        Seller Reporting Phase Start
      </div>
    </div>
  );
};

export default Breakpoints;
