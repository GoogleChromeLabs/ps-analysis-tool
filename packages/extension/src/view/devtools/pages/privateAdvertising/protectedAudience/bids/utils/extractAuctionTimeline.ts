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
const extractAuctionTimeline = (events) => {
  const timeline = {
    bidders: [],
    noBids: [],
    timeoutBids: [],
    won: null,
    auctionTimeout: 0,
  };

  const auctionEndEvent = events.find((e) => e.eventType === 'auctionEnd');
  const bidWonEvent = events.find((e) => e.eventType === 'bidWon');
  const bidTimeoutEvent = events.find((e) => e.eventType === 'bidTimeout');

  if (!auctionEndEvent) {
    return timeline;
  }

  const {
    auctionEnd,
    timestamp: auctionStartTime,
    bidderRequests = [],
    noBids = [],
  } = auctionEndEvent.args;

  const timeoutBids = bidTimeoutEvent?.args || [];

  timeline.auctionTimeout = auctionEnd - auctionStartTime;

  // Helper: create enriched bidder object
  const createBidderInfo = (bid) => {
    const bidderCode = bid.bidder;
    const bidderRequest = bidderRequests.find(
      (br) =>
        br.bidderCode === bidderCode &&
        br.bids.some((b) => b.bidId === bid.bidId)
    );

    const bidStartTime = bidderRequest?.start || auctionStartTime;

    const topics = [];
    bid?.ortb2Imp?.ext?.data?.pbadslot &&
      topics.push(bid.ortb2Imp.ext.data.pbadslot);
    bid?.ortb2Imp?.ext?.gpid && topics.push(bid.ortb2Imp.ext.gpid);

    return {
      bidder: bidderCode,
      bidStartTime,
      auctionStartTime,
      timeTaken: auctionEnd - bidStartTime,
      bidderRequest,
      topics,
    };
  };

  // Build list of all bid-level objects from all bidderRequests
  const allBids = bidderRequests.flatMap((br) =>
    br.bids.map((bid) => ({
      ...bid,
      bidderRequest: br,
      startTime: br.start || auctionStartTime,
    }))
  );

  // === 1. bidders (exclude noBids + timeout)
  const noBidIds = new Set(noBids.map((b) => b.bidId));
  const timeoutIds = new Set(timeoutBids.map((b) => b.bidId));
  timeline.bidders = allBids
    .filter((b) => !noBidIds.has(b.bidId) && !timeoutIds.has(b.bidId))
    .map((b) => createBidderInfo(b));

  // === 2. noBids
  timeline.noBids = noBids.map((b) => createBidderInfo(b)).filter(Boolean);

  // === 3. timeouts
  timeline.timeoutBids = timeoutBids
    .map((b) => createBidderInfo(b))
    .filter(Boolean);

  // === 4. won
  if (bidWonEvent?.args?.bidder) {
    timeline.won = createBidderInfo(bidWonEvent.args);
  }

  return timeline;
};

export default extractAuctionTimeline;
