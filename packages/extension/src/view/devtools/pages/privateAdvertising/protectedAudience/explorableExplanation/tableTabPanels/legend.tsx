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
import { Link } from '@google-psat/design-system';

const Legend = () => {
  return (
    <div className="p-3 text-[12.5px] dark:text-bright-gray h-full overflow-y-auto pb-5">
      <p>
        This explorable explanation illustrates the generic flow outlined in the{' '}
        <Link href="https://developers.google.com/display-video/protected-audience/ssp-guide">
          ssp-guide
        </Link>{' '}
        diagrams using synthetic data for both single and multi-seller auctions.
        The timeline follows a user’s journey from visiting advertiser websites,
        where interest groups are added, to publisher websites, where auctions
        take place. Click the info icon on each box to learn more about the
        process. Below is a guide to the different symbols used in the diagram.
      </p>
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex gap-2">
          <div className="bg-yellow-400 w-4 h-4 border border-black" />
          <p className="mt-[-3px]">
            Yellow boxes highlight the minimum required changes for SSPs to
            participate in Protected Audience API workflows. Please refer to{' '}
            <Link href="https://developers.google.com/display-video/protected-audience/ssp-guide">
              ssp-guide
            </Link>{' '}
            for more information.
          </p>
        </div>
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
          <p>Small bubbles represent interest groups.</p>
        </div>
        <div className="mt-2">
          <p>
            <strong>Single-Seller: </strong>A single seller refers to a
            situation where the auction is managed and controlled by one entity,
            typically an SSP (Supply-Side Platform) or the publisher directly.
          </p>
          <p className="mt-1">
            <strong>Multi-Seller: </strong>A multi-seller setup involves
            multiple SSPs or exchanges participating in the auction
            simultaneously.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Legend;
