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
import { BreakpointIcon, InfoIcon } from '@google-psat/design-system';
import { noop } from '@google-psat/common';

/**
 * Internal dependencies.
 */
// eslint-disable-next-line import/no-unresolved
import screenshot from '../../../../../../../images/ad-auction-worklet-breakpoints.png';

export interface InfoState {
  title?: string;
  info?: string | React.ReactElement;
}

interface BreakpointsProps {
  setInfo: React.Dispatch<React.SetStateAction<InfoState>>;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Breakpoints = ({ setInfo, setIsCollapsed = noop }: BreakpointsProps) => {
  const breakpointInfo = (
    <>
      <p>
        Use event listener breakpoints when you want to pause on the event
        listener code that runs after an event is fired.
      </p>
      <p>
        It can be used for the following events from Sources tab in DevTools
        under &quot;Event Listener Breakpoints&quot;:
      </p>
      <ul className="mt-2 list-disc ml-3">
        <li>Bidder Bidding Phase Start</li>
        <li>Bidder Reporting Phase Start</li>
        <li>Seller Scoring Phase Start</li>
        <li>Seller Reporting Phase Start</li>
      </ul>
      <img src={screenshot} alt="" />
    </>
  );

  return (
    <div className="flex gap-4 text-raisin-black dark:text-bright-gray p-4">
      <div className="flex gap-2 justify-center items-center">
        <BreakpointIcon className="fill-granite-gray" />
        Ad Worklet Breakpoints{' '}
        <InfoIcon
          className="cursor-pointer"
          onClick={() => {
            setIsCollapsed(false);
            setInfo({
              title: 'Ad Worklet Breakpoints',
              info: breakpointInfo,
            });
          }}
        />
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
