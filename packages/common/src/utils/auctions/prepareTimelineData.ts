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
import { AuctionEventsType } from '../../protectedAudience.types';
import isValidURL from '../isValidURL';
import {
  formNoBidData,
  formReceivedBidData,
  formTimedOutBids,
} from './bidderCreator';
import { formatTimestamp } from './formatTimestamp';
import { Bidder, BidderType } from './types';

type PrebidTimeoutEvent = PrebidAuctionEventType & {
  timeoutBid: BidTimeoutEvent;
};

const preparePrebidTimelineData = (
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
      (event: PrebidAuctionEventType) => event.eventType === 'bidResponse'
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
          ?.map((event) => (event as PrebidTimeoutEvent).timeoutBid) ?? [],
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
      auctionStartTimeFormatted: formatTimestamp(Number(auctionEnd.timestamp)),
      auctionEndDuration: auctionEnd.auctionEnd - auctionEnd.timestamp,
      auctionTime: auctionEnd.auctionEnd - auctionEnd.timestamp,
      zoomLevel: 2,
      adUnitCodes: auctionEnd.adUnitCodes,
    };
  });

  return auctions;
};

const prepareProtectedAudienceTimelineData = (
  auctionEvents: AuctionEventsType
) => {
  const auctions: any = {};

  Object.entries(auctionEvents as AuctionEventsType).forEach(
    ([adUnit, timedAuctionEvents]) => {
      Object.entries(timedAuctionEvents).forEach(
        ([, sellerUrlAuctionEvents]) => {
          Object.entries(sellerUrlAuctionEvents).forEach(
            ([, auctionHostUrlEvents]) => {
              Object.entries(auctionHostUrlEvents).forEach(([, events]) => {
                const auctionId = events[0].uniqueAuctionId;
                const bidsEvent = events.filter(
                  (event) =>
                    event?.type === 'bid' || event?.type === 'topLevelBid'
                );
                const winEvent = events.filter(
                  (event) => event?.type === 'win'
                )?.[0];

                const isTopLevelBid =
                  events.filter((event) => event?.type === 'topLevelBid')
                    ?.length > 0;

                const { time: auctionEndTime, formattedTime } =
                  events[events.length - 1];

                let bidders: Partial<Bidder>[] = [];

                if (!auctionId) {
                  return;
                }

                bidsEvent.forEach((bid) => {
                  if (!bid.ownerOrigin) {
                    return;
                  }

                  if (isTopLevelBid) {
                    bidders.push({
                      name: isValidURL(bid.ownerOrigin)
                        ? new URL(bid.ownerOrigin).hostname
                        : '',
                      startTime: Number(
                        events[0].formattedTime
                          .toString()
                          .slice(
                            0,
                            events[0].formattedTime.toString().length - 2
                          )
                      ),
                      endTime:
                        ((bid.time * 1000) as number) - events[0].time * 1000,
                      duration: `${bid.time * 1000 - events[0].time * 1000}`,
                      type: BidderType.BID,
                      data: bid,
                    });
                  }

                  if (winEvent) {
                    bidders = bidders.map((bidder) => {
                      const winnerHostname =
                        winEvent.ownerOrigin &&
                        isValidURL(winEvent.ownerOrigin ?? '')
                          ? new URL(winEvent.ownerOrigin).hostname
                          : '';

                      if (
                        winnerHostname &&
                        winnerHostname === bidder.name &&
                        winEvent.name === bidder.data?.name
                      ) {
                        bidder.type = BidderType.WON;
                      }
                      return bidder;
                    });
                  }

                  const loadedEvent = events.find(
                    (event) =>
                      event.type === 'loaded' &&
                      event.ownerOrigin === bid.ownerOrigin
                  );

                  if (!loadedEvent) {
                    return;
                  }

                  const bidEvent = events.find((event) => {
                    return (
                      (event.type === 'bid' || event.type === 'topLevelBid') &&
                      event.ownerOrigin === loadedEvent.ownerOrigin
                    );
                  });

                  if (!bidEvent || !bidEvent?.ownerOrigin) {
                    return;
                  }

                  bidders.push({
                    name: isValidURL(bidEvent?.ownerOrigin)
                      ? new URL(bidEvent.ownerOrigin).hostname
                      : '',
                    startTime:
                      auctionEndTime * 1000 -
                      ((loadedEvent.time * 1000) as number),
                    endTime:
                      auctionEndTime * 1000 -
                      ((bidEvent?.time * 1000) as number),
                    duration: `${
                      bidEvent?.time * 1000 - loadedEvent?.time * 1000
                    }`,
                    type: BidderType.BID,
                    data: bidEvent,
                  });
                });
                // see https://github.com/google/ads-privacy/blob/master/proposals/fledge-multiple-seller-testing/README.md#faq
                //@todo once seller and buyer timeouts are in place calculate the auction timeout.
                auctions[auctionId] = {
                  bidders,
                  auctionTimeout: 5000,
                  auctionId: auctionId,
                  auctionStartTime: Math.round(auctionEndTime * 1000),
                  auctionStartTimeFormatted: formatTimestamp(
                    Number(auctionEndTime)
                  ),
                  auctionTime: Math.round(
                    Number(
                      formattedTime
                        .toString()
                        .slice(0, formattedTime.toString().length - 3)
                    )
                  ),
                  zoomLevel: 2,
                  adUnitCodes: adUnit,
                };
              });
            }
          );
        }
      );
    }
  );

  return auctions;
};

export const prepareTimelineData = (
  auctionEvents: PrebidEvents['auctionEvents'] | AuctionEventsType,
  isPrebid: boolean
) => {
  if (isPrebid) {
    return preparePrebidTimelineData(
      auctionEvents as PrebidEvents['auctionEvents']
    );
  }

  return prepareProtectedAudienceTimelineData(
    auctionEvents as AuctionEventsType
  );
};
