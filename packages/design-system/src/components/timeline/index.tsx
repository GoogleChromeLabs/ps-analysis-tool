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
import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  findMaximumBidderDuration,
  formatDuration,
  type Bidder,
  BidderType,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import { HammerIcon } from '../../icons';

const INITIAL_TIME = 50;
const TIME_DURATION = 50;
const BAR_HEIGHT = 50;

const BAR_COLORS: Record<BidderType, string> = {
  [BidderType.BID]: '#7CACF8',
  [BidderType.NO_BID]: '#EC7159',
  [BidderType.WON]: '#5CC971',
  [BidderType.TIMED_OUT]: '#FC2D04',
};

interface TimelineProps {
  auctionTimeout: number;
  auctionId: string;
  auctionStartTime: string;
  auctionTime: string;
  bidders: Bidder[];
  zoomLevel?: number;
  setSelectedRow: (row: any) => void;
  navigateToAuction: (auctionId: string) => void;
}

const Timeline = ({
  auctionTimeout,
  auctionId,
  auctionStartTime,
  auctionTime,
  bidders,
  zoomLevel = 2,
  setSelectedRow,
  navigateToAuction,
}: TimelineProps) => {
  const [animate, setAnimate] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => {
    const maxDuration = Math.max(
      findMaximumBidderDuration(bidders),
      auctionTimeout
    );
    const extraLines = 4;

    return maxDuration / TIME_DURATION + extraLines;
  }, [bidders, auctionTimeout]);

  const zoom = zoomLevel < 1 ? 1 : zoomLevel;
  const lines = Array.from({ length: lineCount });
  const timeoutBlockWidth = scrollWidth - auctionTimeout * zoom;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      setScrollWidth(containerRef.current.scrollWidth);
    }
  }, [containerRef, bidders, auctionTimeout]);

  return (
    <div>
      <header className="flex justify-between text-sm font-semibold">
        <p>Auction Start: {auctionStartTime}</p>
        <p>Auction Time: {auctionTime}ms</p>
      </header>
      <div
        ref={containerRef}
        className="m-h-[200px] border-pale-cornflower-blue border-1 mt-2 relative overflow-auto"
        style={{ height: bidders.length * BAR_HEIGHT }}
      >
        {/*Vertical Columns*/}
        <div className="flex h-full">
          {lines.map((_, index) => {
            return (
              <div
                className="border-pale-cornflower-blue border-r-1 h-full shrink-[0] grow-[0] relative transition-all duration-300 ease-out"
                style={{ flexBasis: `${TIME_DURATION * zoom}px` }}
                key={index}
              >
                <span className="absolute right-0 pr-2 block text-xs mt-1">
                  {INITIAL_TIME + index * TIME_DURATION}ms
                </span>
              </div>
            );
          })}
        </div>

        {/*Timeout block*/}
        <div className="absolute flex w-fit h-full top-0">
          <div
            style={{ width: `${auctionTimeout * zoom}px` }}
            className="h-full"
          ></div>
          <div
            className="h-full relative flex-1"
            style={{ width: `${timeoutBlockWidth}px` }}
          >
            <div className="bg-[#E90303] opacity-[9%] w-full h-full"></div>
            <span className="absolute left-[-35px] top-20 rotate-[270deg] text-xs text-[#828282]">
              Timeout: {auctionTimeout}ms
            </span>
          </div>
        </div>

        {/*Bars Block*/}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative">
            {bidders.map((bidder, index) => {
              const fullWidth = parseFloat(bidder.duration) * zoom;
              return (
                <div key={index} className="relative group ">
                  {/*Bar*/}
                  <div
                    className="absolute h-[10px] transition-all duration-300 ease-out group-hover:scale-101 group-hover:border group-hover:border-grey transform origin-left cursor-pointer"
                    role="button"
                    onClick={() => setSelectedRow(bidder?.data)}
                    style={{
                      width: animate ? `${fullWidth}px` : `0px`,
                      backgroundColor: BAR_COLORS[bidder.type],
                      top: `${(index + 1) * 40}px`,
                      left: `${
                        bidder.startTime ? bidder.startTime * zoom : 0
                      }px`,
                    }}
                  >
                    {/*Metadata*/}
                    <div className="absolute left-0 bottom-[-20px] w-full flex justify-between px-1 min-w-[180px]">
                      <span className="pr-2 text-xs flex">
                        {String(bidder.name)}
                        <span className="text-granite-gray ml-1">
                          {bidder.type === BidderType.NO_BID && ' (no bid)'}
                          {bidder.type === BidderType.TIMED_OUT &&
                            ' (timed out)'}
                        </span>
                        {bidder.type === BidderType.WON && (
                          <span className="flex text-granite-gray ">
                            <span>(won)</span>
                            <span>
                              <HammerIcon />
                            </span>
                          </span>
                        )}
                      </span>
                      <span className="text-xs">
                        {formatDuration(bidder.duration)}ms
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <footer>
        <p className="text-sm text-right mt-1">
          Auction ID:{' '}
          <a
            onClick={(event) => {
              event.preventDefault();
              navigateToAuction(auctionId);
            }}
            className="underline"
            href="#"
          >
            {auctionId}
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Timeline;
