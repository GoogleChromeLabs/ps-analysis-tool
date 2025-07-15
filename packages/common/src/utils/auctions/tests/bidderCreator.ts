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
import { BidderType } from '../types';
import {
  formReceivedBidData,
  formNoBidData,
  formTimedOutBids,
} from '../bidderCreator';

describe('bidderCreator', () => {
  const mockAuctionEndTimestamp = 1000;
  const mockBidderRequest = {
    auctionId: 'auction123',
    bidderCode: 'bidder1',
    bidder: 'bidder1',
    start: 500,
    serverResponseTimeMs: 100,
  };

  describe('formReceivedBidData', () => {
    it('should return null if no matching bid is found', () => {
      const result = formReceivedBidData(
        [],
        mockBidderRequest,
        mockAuctionEndTimestamp
      );
      expect(result).toBeNull();
    });

    it('should form received bid data correctly', () => {
      const mockReceivedBids = [
        {
          auctionId: 'auction123',
          bidder: 'bidder1',
          bidderCode: 'bidder1',
          requestTimestamp: 500,
          responseTimestamp: 600,
        },
      ];

      const result = formReceivedBidData(
        mockReceivedBids,
        mockBidderRequest,
        mockAuctionEndTimestamp
      );

      expect(result).toEqual({
        name: 'bidder1',
        startTime: -500,
        endTime: -400,
        duration: '100',
        type: BidderType.BID,
        data: mockBidderRequest,
      });
    });
  });

  describe('formNoBidData', () => {
    it('should return null if no matching bid is found', () => {
      const result = formNoBidData(
        [],
        mockBidderRequest,
        mockAuctionEndTimestamp,
        []
      );
      expect(result).toBeNull();
    });

    it('should form no bid data correctly', () => {
      const mockNoBids = [
        {
          auctionId: 'auction123',
          bidder: 'bidder1',
          bidderCode: 'bidder1',
          adUnitCode: 'ad1',
          bidderRequestId: 'req1',
        },
      ];

      const mockEvents = [
        {
          eventType: 'noBid',
          bidderRequestId: 'req1',
          elapsedTime: 100,
        },
      ];

      const result = formNoBidData(
        mockNoBids,
        mockBidderRequest,
        mockAuctionEndTimestamp,
        mockEvents
      );

      expect(result).toMatchObject({
        name: 'bidder1',
        type: BidderType.NO_BID,
        adUnitCode: 'ad1',
        serverResponseTimeMs: 100,
      });
    });
  });

  describe('formTimedOutBids', () => {
    it('should return null if no matching bid is found', () => {
      const result = formTimedOutBids(
        [],
        mockBidderRequest,
        mockAuctionEndTimestamp,
        []
      );
      expect(result).toBeNull();
    });

    it('should form timed out bid data correctly', () => {
      const mockTimeoutBids = [
        {
          auctionId: 'auction123',
          bidder: 'bidder1',
          adUnitCode: 'ad1',
          bidderRequestId: 'req1',
        },
      ];

      const mockEvents = [
        {
          eventType: 'bidRequested',
          bidderRequestId: 'req1',
          elapsedTime: 50,
        },
      ];

      const result = formTimedOutBids(
        mockTimeoutBids,
        mockBidderRequest,
        mockAuctionEndTimestamp,
        mockEvents
      );
      expect(result).toMatchObject({
        name: 'bidder1',
        type: BidderType.TIMED_OUT,
        adUnitCode: 'ad1',
        serverResponseTimeMs: 100,
      });
    });
  });
});
