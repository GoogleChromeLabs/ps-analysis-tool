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

const prepareTimelineData = (auctionEvent) => {
  const auctionEnd = auctionEvent.find(
    (item) => item.eventType === 'auctionEnd'
  );

  let timeline = {};

  if (!auctionEnd) {
    return timeline;
  }

  const bidders = [];

  auctionEvent.forEach((event) => {
    if (event.eventType === 'bid') {
      bidders.push({
        name: event.bidder,
        startTime: event.timestamp - auctionEnd.timestamp,
        duration: (event.bidResponseTime || 0) / 1000, // Convert to seconds
        type: 'BID',
      });
    } else if (event.eventType === 'noBid') {
      bidders.push({
        name: event.bidder,
        startTime: event.timestamp - auctionEnd.timestamp,
        duration: (event.noBidResponseTime || 0) / 1000, // Convert to seconds
        type: 'NO_BID',
      });
    } else if (event.eventType === 'bidWon') {
      bidders.push({
        name: event.bidder,
        duration: (event.bidResponseTime || 0) / 1000, // Convert to seconds
        type: 'WON',
      });
    }
  });

  timeline = {
    auctionTimeout: auctionEnd.timeout,
    auctionId: auctionEnd.auctionId,
    auctionStartTime: formatTimestampToIST(auctionEnd.timestamp),
    auctionTime: auctionEnd.auctionEnd - auctionEnd.timestamp,
    bidders: bidders,
    zoomLevel: 2,
    adUnitCodes: auctionEnd.adUnitCodes,
  };

  console.log(auctionEnd, 'auctionEnd');

  console.log(timeline, 'timeline');
};

export default prepareTimelineData;
