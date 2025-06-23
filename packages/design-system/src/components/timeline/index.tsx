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
  BidderType,
  type Bidder,
  type TimelineData,
} from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { BAR_HEIGHT, INITIAL_TIME, TIME_DURATION } from './constants';
import Bar from './bar';

export interface TimelineProps extends TimelineData {
  zoomLevel?: number;
  setSelectedRow: (row: Bidder['data']) => void;
  navigateToAuction: (auctionId: string) => void;
}

const Timeline = ({
  auctionTimeout,
  auctionId,
  auctionStartTimeFormatted,
  auctionTime,
  auctionEndDuration,
  bidders,
  zoomLevel = 2,
  setSelectedRow,
  navigateToAuction,
}: TimelineProps) => {
  const [animate, setAnimate] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeoutBlockWidth, setTimeoutBlockWidth] = useState(0);
  const [auctionEndBlockWidth, setAuctionEndBlockWidth] = useState(0);
  const [zoom, setZoom] = useState(2);

  const lineCount = useMemo(() => {
    const maxDuration = Math.max(
      findMaximumBidderDuration(bidders),
      auctionTimeout
    );
    const extraLines = 4;

    if (maxDuration === 0) {
      return extraLines * 2; // If no bidders, just show the timeout line
    }

    return maxDuration / TIME_DURATION + extraLines;
  }, [bidders, auctionTimeout]);

  const lines = Array.from({ length: lineCount });

  useEffect(() => {
    const _zoom = zoomLevel;
    setZoom(_zoom);
    setTimeoutBlockWidth(scrollWidth - auctionTimeout * _zoom);
    setAuctionEndBlockWidth(scrollWidth - auctionEndDuration * _zoom);
  }, [scrollWidth, auctionTimeout, auctionEndDuration, zoomLevel]);

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

  const childHeight =
    Math.max((bidders?.length ?? 0) * BAR_HEIGHT, 200) + (zoom <= 1 ? 32 : 0);

  return (
    <div className="mb-4">
      <header className="flex justify-between text-sm dark:text-bright-gray font-semibold">
        <p>Auction Start: {auctionStartTimeFormatted}</p>
        <p>Auction Time: {auctionTime}ms</p>
      </header>
      <div
        ref={containerRef}
        className="min-h-[200px] border-pale-cornflower-blue border-1 mt-2 relative overflow-auto"
        style={{ height: bidders ? bidders.length * BAR_HEIGHT : '200px' }}
      >
        {/*Vertical Columns*/}
        <div
          className="flex"
          style={{
            height: childHeight,
          }}
        >
          {lines.map((_, index) => {
            const spanClasses = classNames(
              'absolute right-0 block text-xs dark:text-bright-gray mt-1',
              {
                'pr-2': zoom > 1,
                'rotate-180': zoom <= 1,
              }
            );

            return (
              <div
                className="border-pale-cornflower-blue border-r-1 h-full shrink-[0] grow-[0] relative transition-all duration-300 ease-out"
                style={{ flexBasis: `${TIME_DURATION * zoom}px` }}
                key={index}
              >
                {Array.from({ length: TIME_DURATION / 10 - 1 }).map(
                  (__, subIndex) => {
                    const lineClasses = classNames(
                      'absolute w-[1px] border-r border-dotted h-full transition-all duration-300 ease-out',
                      'border-sky-100 dark:border-gray-800'
                    );
                    return (
                      <div
                        key={subIndex}
                        className={lineClasses}
                        style={{
                          left: `${(subIndex + 1) * (zoom * 10)}px`,
                          top: '0',
                        }}
                      ></div>
                    );
                  }
                )}
                <span
                  className={spanClasses}
                  style={{
                    writingMode: zoom <= 1 ? 'vertical-rl' : undefined,
                  }}
                >
                  {INITIAL_TIME + index * TIME_DURATION}ms
                </span>
              </div>
            );
          })}
        </div>

        {/*Timeout block*/}
        <div
          className="absolute flex w-fit top-0"
          style={{ height: childHeight }}
        >
          <div
            style={{
              width: `${(auctionTimeout * zoom).toFixed(0)}px`,
            }}
          ></div>
          <div
            className="h-full relative flex-1"
            style={{ width: `${timeoutBlockWidth}px` }}
          >
            <div className="bg-[#E90303] opacity-[9%] w-full h-full"></div>
            <span
              className="absolute top-1/2 -translate-y-1/2 rotate-180 text-xs text-[#828282] dark:text-gray h-full flex items-center justify-center"
              style={{ writingMode: 'vertical-rl' }}
            >
              Timeout: {auctionTimeout}ms
            </span>
          </div>
        </div>

        {/*Auction-End block*/}
        <div
          className="absolute flex w-fit top-0"
          style={{
            height: childHeight,
          }}
        >
          <div
            style={{ width: `${(auctionEndDuration * zoom).toFixed(0)}px` }}
            className="h-full"
          ></div>
          <div
            className="h-full relative flex-1"
            style={{ width: `${auctionEndBlockWidth}px` }}
          >
            <div className="bg-[#E90303] opacity-[4%] w-full h-full"></div>
            <span
              className="absolute top-1/2 -translate-y-1/2 rotate-180 text-xs text-[#828282] dark:text-gray h-full flex items-center justify-center"
              style={{ writingMode: 'vertical-rl' }}
            >
              Auction End: {formatDuration(String(auctionEndDuration))}ms
            </span>
          </div>
        </div>

        {/*Bars Block*/}
        <div
          className={classNames('absolute left-0 w-full h-full', {
            'top-8': zoom <= 1,
            'top-0': zoom > 1,
          })}
        >
          <div className="relative">
            {bidders &&
              bidders.map((bidder, index) => {
                const fullWidth = parseFloat(bidder.duration) * zoom;
                const bidderType =
                  bidder.type === BidderType.NO_BID &&
                  Number(bidder.duration) > auctionTimeout
                    ? BidderType.TIMED_OUT
                    : bidder.type;
                return (
                  <React.Fragment key={index}>
                    <Bar
                      bidder={bidder}
                      index={index}
                      zoom={zoom}
                      bidderType={bidderType}
                      fullWidth={fullWidth}
                      animate={animate}
                      setSelectedRow={setSelectedRow}
                    />
                  </React.Fragment>
                );
              })}
          </div>
        </div>
      </div>
      <footer>
        <p className="text-sm text-right my-1 dark:text-bright-gray">
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
