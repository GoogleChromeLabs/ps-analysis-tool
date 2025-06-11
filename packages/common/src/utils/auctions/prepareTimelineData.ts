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
  BidTimeoutEvent,
  NoBid,
} from '../../prebidGlobal.types';
import {
  formNoBidData,
  formReceivedBidData,
  formTimedOutBids,
} from './bidderCreator';
import { Bidder, BidderType } from './types';

type PrebidTimeoutEvent = PrebidAuctionEventType & {
  bids: BidTimeoutEvent;
};

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
    let bidders: Partial<Bidder>[] = [];
    auctions[auctionId] = {};

    const auctionEnd: AuctionEndEvent = events.find(
      (item: PrebidAuctionEventType) => item.eventType === 'auctionEnd'
    ) as AuctionEndEvent;

    if (!auctionEnd) {
      return;
    }

    const bidderRequests = auctionEnd.bidderRequests.sort(
      (a, b) => a.start - b.start
    ) as BidRequestedEvent[];

    const receivedBids = events.filter(
      (event: PrebidAuctionEventType) => event.eventType === 'BidResponse'
    ) as BidResponse[];

    const noBids = events.filter(
      (event: PrebidAuctionEventType) => event.eventType === 'noBid'
    ) as NoBid[];

    bidderRequests.forEach((bidderRequest: BidRequestedEvent) => {
      const receivedBid = formReceivedBidData(
        receivedBids,
        bidderRequest,
        auctionEnd.timestamp
      );

      if (receivedBid) {
        bidders.push(receivedBid);
        return;
      }

      const noBid = formNoBidData(
        noBids,
        bidderRequest,
        auctionEnd.timestamp,
        events
      );

      if (noBid) {
        bidders.push(noBid);
        return;
      }

      const timedOutBid = formTimedOutBids(
        events
          .filter((event) => event.eventType === 'bidTimeout')
          ?.map((event) => (event as PrebidTimeoutEvent).bids) ?? [],
        bidderRequest,
        auctionEnd.timestamp,
        events
      );

      if (timedOutBid) {
        bidders.push(timedOutBid);
        return;
      }
    });

    events.forEach((event: any) => {
      if (event.eventType === 'bidWon') {
        bidders = bidders.map((bidder) => {
          if (bidder.type === BidderType.BID && bidder.name === event.bidder) {
            bidder.type = BidderType.WON;
          }
          return bidder;
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
