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

// eslint-disable-next-line consistent-return
const prepareTimelineData = (prebidResponse: any) => {
  console.clear();
  // console.log(prebidResponse, 'prebidResponse');

  const auctions: any = {};

  Object.entries(prebidResponse.auctionEvents).forEach(
    ([auctionId, events]) => {
      const bidders = [];
      auctions[auctionId] = {};

      events.forEach((event: any) => {
        if (event.eventType === 'bidRequested') {
          console.log(event, 'bidRequested');
        }
      });

      const auctionEnd = events.find(
        (item: any) => item.eventType === 'auctionEnd'
      );

      auctionEnd.bidsReceived.forEach((bid: any) => {
        bidders.push({
          name: bid.bidder,
          startTime: bid.requestTimestamp,
          endTime: bid.responseTimestamp,
          duration: bid.responseTimestamp - bid.requestTimestamp,
          type: 'BID',
          data: bid,
        });
      });

      auctionEnd.noBids.forEach((item: any) => {
        const bid = {
          name: item.bidder,
          type: 'NO_BID',
          adUnitCode: item.adUnitCode,
          data: item,
        };

        auctionEnd.bidderRequests.forEach((bidderRequest) => {
          if (bidderRequest.bidderRequestId === item.bidderRequestId) {
            bid.startTime = bidderRequest.start;
            bid.serverResponseTimeMs = bidderRequest.serverResponseTimeMs;
          }
        });

        bidders.push(bid);
      });

      events.forEach((event: any) => {
        if (event.eventType === 'bidWon') {
          bidders.push({
            name: event.bidder,
            type: 'WON',
          });
        }
      });

      auctions[auctionId] = {
        bidders,
        auctionTimeout: auctionEnd.timeout,
        auctionId: auctionEnd.auctionId,
        auctionStartTime: auctionEnd.timestamp,
        auctionStartTimeFormatted: formatTimestampToIST(auctionEnd.timestamp),
        auctionTime: auctionEnd.auctionEnd - auctionEnd.timestamp,
        zoomLevel: 2,
        adUnitCodes: auctionEnd.adUnitCodes,
      };
    }
  );

  console.log(auctions, 'auctions');
};

export default prepareTimelineData;
