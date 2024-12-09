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
 * External dependencies
 */
import type { singleAuctionEvent } from '@google-psat/common';
import type Protocol from 'devtools-protocol';

/**
 * This function parses the auction events to get interest group details wherever applicable.
 * @param auctionEventsToBeParsed The auction events to be parsed to get the Interest Group Details.
 * @returns The Interest group details for each event.
 */
function computeInterestGroupDetails(
  auctionEventsToBeParsed: singleAuctionEvent[]
) {
  if (!auctionEventsToBeParsed) {
    return [];
  }

  return Promise.all(
    auctionEventsToBeParsed
      .filter((event) => event.eventType === 'interestGroupAccessed')
      .map(async (event) => {
        if (!event?.name && !event?.ownerOrigin) {
          return {
            ...event,
            details: {},
          };
        }
        let result;
        try {
          result = (await chrome.debugger.sendCommand(
            { tabId: chrome.devtools.inspectedWindow.tabId },
            'Storage.getInterestGroupDetails',
            {
              name: event?.name,
              ownerOrigin: event?.ownerOrigin,
            }
          )) as Protocol.Storage.GetInterestGroupDetailsResponse;

          return {
            ...event,
            details: {
              ...result.details,
            },
          };
        } catch (error) {
          //Fail silently.
          return {
            ...event,
            details: {},
          };
        }
      })
  );
}
export default computeInterestGroupDetails;
