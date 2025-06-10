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
import { PrebidEvents, PrebidAuctionEventType } from '../../prebid.types';
import {
  AuctionEndEvent,
  BidRequestedEvent,
  BidResponse,
  NoBid,
} from '../../prebidGlobal.types';
import { Bidder, BidderType } from './types';

const formatTimestampToIST = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
};

export const prepareTimelineData = (
  auctionEvents: PrebidEvents['auctionEvents']
) => {
  const auctions: any = {};

  Object.entries(auctionEvents).forEach(([auctionId, events]) => {
    const bidders: Partial<Bidder>[] = [];
    auctions[auctionId] = {};

    const auctionEnd: AuctionEndEvent = events.find(
      (item: PrebidAuctionEventType) => item.eventType === 'auctionEnd'
    ) as AuctionEndEvent;
    console.log(auctionEnd);
    if (!auctionEnd) {
      return;
    }

    const bidderRequests = auctionEnd.bidderRequests.sort(
      (a, b) => a.start - b.start
    ) as BidRequestedEvent[];

    const receivedBids = events.filter(
      (event: any) => event.eventType === 'BidResponse'
    ) as BidResponse[];

    const noBids = events.filter(
      (event: any) => event.eventType === 'noBid'
    ) as NoBid[];

    bidderRequests.forEach((bidderRequest: BidRequestedEvent) => {
      console.log(receivedBids, bidderRequests);
      const bid = receivedBids.find(
        (_bid) =>
          _bid.auctionId === bidderRequest?.auctionId &&
          (_bid.bidderCode === bidderRequest.bidderCode ||
            _bid.bidder === bidderRequest.bidderCode)
      );

      if (!bid) {
        return;
      }

      bidders.push({
        name: bid.bidder,
        startTime: (bid.requestTimestamp as number) - auctionEnd.timestamp,
        endTime: (bid.responseTimestamp as number) - auctionEnd.timestamp,
        duration: `${
          (bid?.responseTimestamp ?? 0) - (bid?.requestTimestamp ?? 0)
        }`,
        type: BidderType.BID,
        data: bidderRequest,
      });
    });

    bidderRequests.forEach((bidderRequest: BidRequestedEvent) => {
      const bid = noBids.find(
        (_bid) =>
          _bid.auctionId === bidderRequest?.auctionId &&
          (_bid.bidderCode === bidderRequest.bidderCode ||
            _bid.bidder === bidderRequest.bidderCode)
      );

      if (!bid) {
        return;
      }

      const bidder: Partial<Bidder> = {
        name: bid.bidder,
        type: BidderType.NO_BID,
        adUnitCode: bid.adUnitCode,
        data: bid,
      };

      bidder.startTime = bidderRequest.start - auctionEnd.timestamp;
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
        auctionEnd.timestamp;
      bidder.duration = `${(bidder?.endTime ?? 0) - (bidder?.startTime ?? 0)}`;

      bidders.push(bidder);
    });

    events.forEach((event: any) => {
      if (event.eventType === 'bidWon') {
        bidders.push({
          name: event.bidder,
          type: BidderType.WON,
          startTime: event.requestTimestamp - auctionEnd.timestamp,
          endTime: event.responseTimestamp - auctionEnd.timestamp,
          duration: `${event.responseTimestamp - event.requestTimestamp}`,
        });
      }
    });

    auctions[auctionId] = {
      bidders,
      auctionTimeout: auctionEnd.timeout,
      auctionId: auctionEnd.auctionId,
      auctionStartTime: auctionEnd.timestamp,
      auctionStartTimeFormatted: formatTimestampToIST(
        `${auctionEnd.timestamp}`
      ),
      auctionTime: auctionEnd.auctionEnd - auctionEnd.timestamp,
      zoomLevel: 2,
      adUnitCodes: auctionEnd.adUnitCodes,
    };
  });

  return auctions;
};
