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
 * External dependencies.
 */
import {
  type PrebidEvents,
  type AuctionEndEvent,
  PrebidAuctionEventType,
  BidResponse,
  NoBid,
} from '@google-psat/common';
/**
 * Internal dependencies.
 */
import { Bidder, BidderType } from '../types';

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

const prepareTimelineData = (prebidResponse: PrebidEvents) => {
  const auctions: any = {};

  Object.entries(prebidResponse.auctionEvents).forEach(
    ([auctionId, events]) => {
      const bidders: Partial<Bidder>[] = [];
      auctions[auctionId] = {};

      events.forEach((event: any) => {
        if (event.eventType === 'bidRequested') {
          console.log(event, 'bidRequested');
        }
      });

      const auctionEnd: AuctionEndEvent = events.find(
        (item: PrebidAuctionEventType) => item.eventType === 'auctionEnd'
      ) as AuctionEndEvent;

      if (!auctionEnd) {
        return;
      }

      auctionEnd.bidsReceived.forEach((bid: BidResponse) => {
        bidders.push({
          name: bid.bidder,
          startTime: bid.requestTimestamp as number,
          endTime: bid.responseTimestamp as number,
          duration: `${
            (bid?.responseTimestamp ?? 0) - (bid?.requestTimestamp ?? 0)
          }`,
          type: BidderType.BID,
          data: bid,
        });
      });

      auctionEnd.noBids.forEach((item: NoBid) => {
        const bid: Partial<Bidder> = {
          name: item.bidder,
          type: BidderType.NO_BID,
          adUnitCode: item.adUnitCode,
          data: item,
        };

        auctionEnd.bidderRequests.forEach((bidderRequest) => {
          if (bidderRequest.bidderRequestId === item.bidderRequestId) {
            bid.startTime = bidderRequest.start;
            bid.serverResponseTimeMs = bidderRequest?.serverResponseTimeMs;
            const noBidElapsedTime =
              events.find(
                (event) =>
                  event.eventType === 'noBid' &&
                  //@ts-ignore
                  event.bidderRequestId === item.bidderRequestId
              )?.elapsedTime ?? 0;

            const bidRequestedElapsedTime =
              events.find(
                (event) =>
                  event.eventType === 'bidRequested' &&
                  //@ts-ignore
                  event.bidderRequestId === item.bidderRequestId
              )?.elapsedTime ?? 0;
            bid.endTime =
              bidderRequest.start + noBidElapsedTime - bidRequestedElapsedTime;
          }
        });

        bidders.push(bid);
      });

      events.forEach((event: any) => {
        if (event.eventType === 'bidWon') {
          bidders.push({
            name: event.bidder,
            type: BidderType.WON,
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
    }
  );
  return auctions;
};

export default prepareTimelineData;
