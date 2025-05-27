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
import React, { useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import { BidderType } from './types';

const LINE_COUNT = 12;
const INITIAL_TIME = 50;
const TIME_DURATION = 50;

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
  bidders: { name: string; duration: string; type: BidderType }[];
}

const Timeline = ({
  auctionTimeout,
  auctionId,
  auctionStartTime,
  auctionTime,
  bidders,
}: TimelineProps) => {
  const [animate, setAnimate] = useState(false);
  const lines = Array.from({ length: LINE_COUNT });
  const [scrollWidth, setScrollWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
  }, [containerRef]);

  return (
    <div>
      <header className="flex justify-between text-sm">
        <p>Auction Start: {auctionStartTime}</p>
        <p>Auction Time: {auctionTime}ms</p>
      </header>
      <div
        ref={containerRef}
        className="m-h-[200px] border-pale-cornflower-blue border-1 mt-2 relative overflow-auto"
        style={{ height: bidders.length * 50 }}
      >
        {/*Bars block*/}
        <div className="flex h-full">
          {lines.map((_, index) => {
            const verticalLineClasses = `border-pale-cornflower-blue border-r-1 h-full shrink-[0] grow-[0] basis-[100px] relative`;
            return (
              <div className={verticalLineClasses} key={index}>
                <span className="absolute right-0 pr-2 block text-xs mt-1">
                  {INITIAL_TIME + index * TIME_DURATION}ms
                </span>
              </div>
            );
          })}
        </div>

        {/*Timeout block*/}
        <div className="absolute flex w-fit h-full top-0">
          <div className="w-[840px] h-full"></div>
          <div
            className="h-full relative flex-1"
            style={{ width: `${scrollWidth - 840}px` }}
          >
            <div className="bg-[#E90303] opacity-[9%] w-full h-full"></div>
            <span className="absolute left-[-35px] top-20 rotate-[270deg] text-xs text-[#828282]">
              Timeout: {auctionTimeout}ms
            </span>
          </div>
        </div>

        {/*Metadata block*/}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative">
            {bidders.map((bidder, index) => {
              const fullWidth = parseFloat(bidder.duration) * 2;
              return (
                <div key={index} className="relative group ">
                  <div
                    className="absolute left-0 h-[10px] transition-all duration-300 ease-out group-hover:scale-101 group-hover:border group-hover:border-grey transform origin-left cursor-pointer"
                    style={{
                      width: animate ? `${fullWidth}px` : `0px`,
                      backgroundColor: BAR_COLORS[bidder.type],
                      top: `${(index + 1) * 40}px`,
                    }}
                  >
                    <div className="absolute left-0 bottom-[-20px] w-full flex justify-between px-1">
                      <span className="pr-2 block text-xs">{bidder.name}</span>
                      <span className="text-xs">{bidder.duration}ms</span>
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
          <a className="underline" href="#">
            {auctionId}
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Timeline;
