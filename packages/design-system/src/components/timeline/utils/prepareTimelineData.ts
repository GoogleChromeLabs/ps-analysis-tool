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
const prepareTimelineData = (auctionEvent: any) => {
  const auctionEnd = auctionEvent.find(
    (item: any) => item.eventType === 'auctionEnd'
  );

  console.clear();

  let timeline = {};

  if (!auctionEnd) {
    return timeline;
  }

  const bidders: any = [];

  auctionEvent.forEach((event: any) => {
    if (event.eventType === 'bidWon') {
      bidders.push({
        name: event.bidder,
        type: 'WON',
      });
    }
  });

  auctionEnd.bidsReceived.forEach((item: any) => {
    bidders.push({
      name: item.bidder,
      type: 'BID',
    });
  });

  auctionEnd.noBids.forEach((item: any) => {
    bidders.push({
      name: item.bidder,
      type: 'NO_BID',
    });
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

  console.log(auctionEvent, 'auctionEvent');
  console.log(auctionEnd, 'auctionEnd');
  console.log(timeline, 'timeline');
};

export default prepareTimelineData;
