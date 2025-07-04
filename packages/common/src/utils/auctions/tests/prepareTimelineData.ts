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
 * Internal dependencies.
 */
import { prepareTimelineData } from '../prepareTimelineData';
import { BidderType } from '../types';

describe('prepareTimelineData', () => {
  it('should return empty object if no auction events', () => {
    const result = prepareTimelineData({}, true);
    expect(result).toEqual({});
  });

  it('should parse auction events correctly', () => {
    const mockAuctionEvents = {
      'auction-1': [
        {
          eventType: 'auctionEnd',
          timestamp: 1000,
          auctionEnd: 1500,
          timeout: 3000,
          auctionId: 'auction-1',
          adUnitCodes: ['div-1'],
          bidderRequests: [
            {
              bidder: 'bidder1',
              start: 1100,
              auctionId: 'auction-1',
            },
          ],
        },
        {
          eventType: 'bidResponse',
          bidder: 'bidder1',
          auctionId: 'auction-1',
          responseTimestamp: 1200,
        },
        {
          eventType: 'bidWon',
          bidder: 'bidder1',
          auctionId: 'auction-1',
        },
      ],
    };

    const result = prepareTimelineData(mockAuctionEvents, true);

    expect(result).toHaveProperty('auction-1');
    expect(result['auction-1']).toMatchObject({
      auctionId: 'auction-1',
      auctionTimeout: 3000,
      auctionTime: 500,
      adUnitCodes: ['div-1'],
    });

    expect(result['auction-1'].bidders[0]).toMatchObject({
      name: 'bidder1',
      type: BidderType.WON,
    });
  });

  it('should handle auctions without auctionEnd event', () => {
    const mockAuctionEvents = {
      'auction-1': [
        {
          eventType: 'bidResponse',
          bidder: 'bidder1',
        },
      ],
    };

    const result = prepareTimelineData(mockAuctionEvents, true);
    expect(result['auction-1']).toStrictEqual({});
  });
});
