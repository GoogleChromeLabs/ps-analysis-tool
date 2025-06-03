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
import React, { useEffect, useMemo } from 'react';

/**
 * Internal dependencies.
 */
import Panel from '../panel';
import { timelines } from '../dummy';
import { useProtectedAudience } from '../../../../../stateProviders';
import extractAuctionTimeline from '../utils/extractAuctionTimeline';

const formatTimestampToIST = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short',
  });
};

interface PrebidBidsPanelProps {
  storage?: string[];
  setStorage?: (data: string, index: number) => void;
  eeAnimatedTab?: boolean;
}

const PrebidBidsPanel = ({ storage, setStorage }: PrebidBidsPanelProps) => {
  const { prebidResponse } = useProtectedAudience(({ state }) => ({
    isMultiSeller: state.isMultiSellerAuction,
    prebidResponse: state.prebidResponse,
  }));

  const allTimelines = useMemo(() => {
    const _timelines = [];

    if (!prebidResponse?.auctionEvents) {
      return _timelines;
    }

    Object.entries(prebidResponse.auctionEvents).forEach(
      ([auctionId, auctionEvent]) => {
        const auctionEnd = auctionEvent.find(
          (event) => event.eventType === 'auctionEnd'
        );

        if (!auctionEnd) {
          return;
        }

        _timelines.push({
          auctionTimeout: auctionEnd.timeout,
          auctionId,
          auctionStartTime: formatTimestampToIST(auctionEnd.timestamp),
          auctionTime: auctionEnd.auctionEnd - auctionEnd.timestamp,
          bidders: timelines[0].bidders,
          zoomLevel: 2,
          adUnitCodes: auctionEnd.adUnitCodes,
        });
      }
    );

    return _timelines;
  }, [prebidResponse]);

  useEffect(() => {
    console.log(prebidResponse, 'prebidResponse');
  }, []);

  return (
    <Panel storage={storage} setStorage={setStorage} timelines={allTimelines} />
  );
};

export default PrebidBidsPanel;
