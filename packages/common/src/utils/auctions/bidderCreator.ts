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
 * Internal dependencies
 */

import { PrebidAuctionEventType } from '../../prebid.types';
import {
  BidRequestedEvent,
  BidResponse,
  BidTimeoutEvent,
  NoBid,
} from '../../prebidGlobal.types';
import { Bidder, BidderType } from './types';

/**
 * Forms data for received bids in an auction
 * @param receivedBids Array of bid responses received in the auction
 * @param bidderRequest The bidder request event data
 * @param auctionEndTimestamp Timestamp marking the end of the auction
 * @returns {Partial<Bidder> | null} Bidder data object or null if no matching bid is found
 */
export function formReceivedBidData(
  receivedBids: BidResponse[],
  bidderRequest: BidRequestedEvent,
  auctionEndTimestamp: number
) {
  const receivedBid = receivedBids.find(
    (_bid) =>
      _bid.auctionId === bidderRequest?.auctionId &&
      (_bid.bidderCode === bidderRequest.bidderCode ||
        _bid.bidder === bidderRequest.bidderCode)
  );

  if (!receivedBid) {
    return null;
  }

  return {
    name: receivedBid.bidder,
    startTime: (receivedBid.requestTimestamp as number) - auctionEndTimestamp,
    endTime: (receivedBid.responseTimestamp as number) - auctionEndTimestamp,
    duration: `${
      (receivedBid?.responseTimestamp ?? 0) -
      (receivedBid?.requestTimestamp ?? 0)
    }`,
    type: BidderType.BID,
    data: bidderRequest,
  };
}

/**
 * Forms data for bids that received no response
 * @param noBids Array of bid responses that received no bids
 * @param bidderRequest The bidder request event data
 * @param auctionEndTimestamp Timestamp marking the end of the auction
 * @param events Array of Prebid auction events
 * @returns {Partial<Bidder> | null} Bidder data object or null if no matching bid is found
 */
export function formNoBidData(
  noBids: NoBid[],
  bidderRequest: BidRequestedEvent,
  auctionEndTimestamp: number,
  events: PrebidAuctionEventType[]
) {
  const bid = noBids.find(
    (_bid) =>
      _bid.auctionId === bidderRequest?.auctionId &&
      (_bid.bidderCode === bidderRequest.bidderCode ||
        _bid.bidder === bidderRequest.bidderCode)
  );

  if (!bid) {
    return null;
  }

  const bidder: Partial<Bidder> = {
    name: bid.bidder,
    type: BidderType.NO_BID,
    adUnitCode: bid.adUnitCode,
    data: bidderRequest,
  };

  bidder.startTime = bidderRequest.start - auctionEndTimestamp;
  bidder.data = bidderRequest;
  bidder.serverResponseTimeMs = bidderRequest?.serverResponseTimeMs ?? 0;
  const noBidElapsedTime =
    events.find(
      (event) =>
        event.eventType === 'noBid' &&
        //@ts-ignore
        event.bidderRequestId === bid.bidderRequestId
    )?.elapsedTime ?? 0;

  const bidRequestedElapsedTime =
    events.find(
      (event) =>
        event.eventType === 'bidRequested' &&
        //@ts-ignore
        event.bidderRequestId === bid.bidderRequestId
    )?.elapsedTime ?? 0;
  bidder.endTime =
    bidderRequest.start +
    noBidElapsedTime -
    bidRequestedElapsedTime -
    auctionEndTimestamp;
  bidder.duration = `${(bidder?.endTime ?? 0) - (bidder?.startTime ?? 0)}`;

  return bidder;
}

/**
 * Forms data for bids that received no response
 * @param timedOutBids Array of bid responses that received no bids
 * @param bidderRequest The bidder request event data
 * @param auctionEndTimestamp Timestamp marking the end of the auction
 * @param events Array of Prebid auction events
 * @returns {Partial<Bidder> | null} Bidder data object or null if no matching bid is found
 */
export function formTimedOutBids(
  timedOutBids: BidTimeoutEvent[],
  bidderRequest: BidRequestedEvent,
  auctionEndTimestamp: number,
  events: PrebidAuctionEventType[]
) {
  const bid = timedOutBids.find(
    (_bid) =>
      _bid?.auctionId === bidderRequest?.auctionId &&
      _bid.bidder === bidderRequest.bidder
  );

  if (!bid) {
    return null;
  }

  const bidder: Partial<Bidder> = {
    name: bid.bidder,
    type: BidderType.TIMED_OUT,
    adUnitCode: bid.adUnitCode,
    data: bidderRequest,
  };

  bidder.startTime = bidderRequest.start - auctionEndTimestamp;
  bidder.data = bidderRequest;
  bidder.serverResponseTimeMs = bidderRequest?.serverResponseTimeMs ?? 0;
  const noBidElapsedTime =
    events.find(
      (event) =>
        event.eventType === 'noBid' &&
        //@ts-ignore
        event.bidderRequestId === bid.bidderRequestId
    )?.elapsedTime ?? 0;

  const bidRequestedElapsedTime =
    events.find(
      (event) =>
        event.eventType === 'bidRequested' &&
        //@ts-ignore
        event.bidderRequestId === bid.bidderRequestId
    )?.elapsedTime ?? 0;
  bidder.endTime =
    bidderRequest.start +
    noBidElapsedTime -
    bidRequestedElapsedTime -
    auctionEndTimestamp;
  bidder.duration = `${(bidder?.endTime ?? 0) - (bidder?.startTime ?? 0)}`;

  return bidder;
}
