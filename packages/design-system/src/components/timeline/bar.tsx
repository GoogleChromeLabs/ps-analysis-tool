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
 * External dependencies
 */
import React, { useCallback, useState } from 'react';
import { Bidder, BidderType, formatDuration } from '@google-psat/common';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import { HammerIcon } from '../../icons';
import { BAR_COLORS } from './constants';

interface BarProps {
  bidder: Bidder;
  index: number;
  zoom: number;
  bidderType: BidderType;
  fullWidth: number;
  animate: boolean;
  setSelectedRow: (row: Bidder | null) => void;
}

const Bar = ({
  bidder,
  index,
  zoom,
  bidderType,
  fullWidth,
  animate,
  setSelectedRow,
}: BarProps) => {
  const [isBarHovered, setIsBarHovered] = useState(false);

  const handleBarHover = useCallback(() => {
    setIsBarHovered(true);
  }, []);

  const handleBarLeave = useCallback(() => {
    setIsBarHovered(false);
  }, []);

  return (
    <div
      key={index}
      className="relative group"
      onMouseEnter={handleBarHover}
      onMouseLeave={handleBarLeave}
    >
      <div
        className="absolute h-[10px] transition-all duration-300 ease-out group-hover:scale-101 group-hover:border group-hover:border-grey transform origin-left cursor-pointer"
        role="button"
        onClick={() => setSelectedRow(bidder?.data)}
        style={{
          width: animate ? `${fullWidth.toFixed(0)}px` : `0px`,
          backgroundColor: BAR_COLORS[bidderType],
          top: `${(index + 1) * 40}px`,
          left: `${
            bidder.startTime ? (bidder.startTime * zoom).toFixed(0) : 0
          }px`,
        }}
      >
        {/*Metadata*/}
        <div
          className={classNames(
            'absolute left-0 bottom-[-20px] w-full flex justify-between px-1 min-w-[180px]',
            {
              hidden:
                (zoom < 1 || Number(fullWidth.toFixed(0)) < 200) &&
                !isBarHovered,
              block:
                (zoom < 1 || Number(fullWidth.toFixed(0)) < 200) &&
                isBarHovered,
            }
          )}
        >
          <span className="pr-2 text-xs dark:text-bright-gray flex">
            {String(bidder.name)}
            <span className="text-granite-gray dark:text-bright-gray ml-1">
              {bidder.type === BidderType.NO_BID && ' (no bid)'}
              {bidder.type === BidderType.BID && ' (received bid)'}
              {bidder.type === BidderType.TIMED_OUT && ' (timed out)'}
            </span>
            {bidder.type === BidderType.WON && (
              <span className="flex text-granite-gray dark:text-bright-gray ">
                <span>(won)</span>
                <span>
                  <HammerIcon height="18" />
                </span>
              </span>
            )}
          </span>
          <span className="text-xs dark:text-bright-gray">
            {formatDuration(bidder.duration)}ms
          </span>
        </div>
      </div>
    </div>
  );
};

export default Bar;
