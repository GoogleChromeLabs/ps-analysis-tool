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
import React, { useEffect, useState } from 'react';

const LINE_COUNT = 12;
const INITIAL_TIME = 50;
const TIME_DURATION = 50;

enum BarType {
  BID = 'bid',
  NO_BID = 'no-bid',
  WON = 'won',
  TIMED_OUT = 'timed-out',
}

const BAR_COLORS: Record<BarType, string> = {
  [BarType.BID]: '#7CACF8',
  [BarType.NO_BID]: '#EC7159',
  [BarType.WON]: '#5CC971',
  [BarType.TIMED_OUT]: '#FC2D04',
};

const bars: { name: string; duration: string; type: BarType }[] = [
  { name: 'Pubmattic', duration: '270.1', type: BarType.BID },
  { name: 'Sharethrough', duration: '210.4', type: BarType.NO_BID },
  { name: 'appnexus', duration: '240.0', type: BarType.NO_BID },
  { name: 'ix', duration: '380.1', type: BarType.NO_BID },
  { name: 'Rubicon', duration: '125.51', type: BarType.WON },
  { name: 'Criteo', duration: '470.05', type: BarType.TIMED_OUT },
];

const Timeline = () => {
  const [animate, setAnimate] = useState(false);
  const lines = Array.from({ length: LINE_COUNT });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimate(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div>
      <header className="flex justify-between">
        <p>Auction Start: 12:18:27</p>
        <p>Auction Time: 380ms</p>
      </header>
      <div className="h-[300px] border-pale-cornflower-blue border-1 mt-2 relative overflow-auto">
        <div className="flex h-full">
          {lines.map((_, index) => {
            const verticalLineClasses = `border-pale-cornflower-blue border-r-1 h-full shrink-[0] grow-[0] basis-[100px] relative`;
            return (
              <div className={verticalLineClasses} key={index}>
                <span className="absolute right-0 pr-2 block text-xs">
                  {INITIAL_TIME + index * TIME_DURATION}ms
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute flex w-full h-full top-0 right-0">
          <div className="w-[840px] h-full"></div>
          <div className="bg-[#E90303] opacity-[9%] h-full relative flex-1">
            <span className="absolute left-0 top-30">Timeout: 420ms</span>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative">
            {bars.map((bar, index) => {
              const fullWidth = parseFloat(bar.duration) * 2;
              return (
                <div
                  key={index}
                  className="absolute left-0 h-[10px] transition-all duration-700 ease-out"
                  style={{
                    width: animate ? `${fullWidth}px` : `0px`,
                    backgroundColor: BAR_COLORS[bar.type],
                    top: `${(index + 1) * 40}px`,
                  }}
                >
                  <div className="absolute left-0 bottom-[-20px] w-full flex justify-between px-1">
                    <span className="pr-2 block text-xs">{bar.name}</span>
                    <span className="text-xs">{bar.duration}ms</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
