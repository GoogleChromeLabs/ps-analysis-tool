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

/**
 * Internal dependencies.
 */
// eslint-disable-next-line import/no-unresolved
import screenshot from '../../../../../../../images/ad-auction-worklet-breakpoints.png';

const WorkletBreakpoints = () => {
  return (
    <div className="p-4 text-sm">
      <p>
        Use event listener breakpoints to pause on an event listener code that
        runs after an event is fired for an ad auction. It can be used for the
        following events from &quot;Sources&quot; tab in DevTools under
        &quot;Event Listener Breakpoints&quot;:
      </p>
      <ul className="mt-2 list-disc ml-3">
        <li>
          <p>
            <strong>Bidder Bidding Phase Start: </strong>
            refers to the moment when a participating advertiser (bidder) is
            signaled by the browser to begin calculating and submitting their
            bid for an ad impression, all happening directly on the user&apos;s
            device during a privacy-focused auction process, where user data is
            protected and not shared across websites
          </p>
        </li>
        <li>
          <p>
            <strong>Bidder Reporting Phase Start: </strong>
            refers to the point in an online ad auction where the winning bidder
            is determined and the relevant information about the auction
            results, such as the winning bid and other details, are sent back to
            the participating buyers (bidders) as a report, all while
            maintaining user privacy within the Privacy Sandbox framework
          </p>
        </li>
        <li>
          <p>
            <strong>Seller Scoring Phase Start: </strong>
            refers to the point in an online ad auction where all the bidders
            have bid for an adSpace and the seller has now started scoring the
            bids according to the criteria&apos;s set by the seller.
          </p>
        </li>
        <li>
          <p>
            <strong>Seller Reporting Phase Start: </strong>
            refers to the point in an online ad auction where all the bidders
            have bid for an adSpace and the seller has scored and found a
            winning bids now all the bidders are reported the results of the
            auctions.
          </p>
        </li>
      </ul>
      <div className="flex justify-center">
        <img src={screenshot} alt="Ad Auction Worklet Breakpoint" />
      </div>
      <p className="mb-5 italic">
        <strong>Note</strong> that currently, these breakpoints are only
        informational in PSAT, pointing users to use them via the DevTools
        interface. They may become functional in the upcoming PSAT versions.
      </p>
    </div>
  );
};

export default WorkletBreakpoints;
