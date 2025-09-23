/*
 * Copyright 2023 Google LLC
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
import React, { useState } from 'react';
import { VictoryPie } from 'victory-pie';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import EmptyCirclePieChart from './emptyCirclePieChart';

interface CirclePieChartProps {
  centerCount: number;
  data: { count: number; color: string }[];
  title?: string;
  fallbackText?: string;
  infoIconClassName?: string;
  centerTitleExtraClasses?: string;
  bottomTitleExtraClasses?: string;
  pieChartExtraClasses?: string;
  tooltipText?: string;
}

export const MAX_COUNT = 999;

const CirclePieChart = ({
  centerCount,
  data,
  title,
  centerTitleExtraClasses = '',
  bottomTitleExtraClasses = '',
  pieChartExtraClasses = '',
  tooltipText = '',
}: CirclePieChartProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const centerTitleClasses = centerCount <= MAX_COUNT ? 'text-2xl' : 'text-l';

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-start"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="inline-block align-bottom w-16 relative">
        {centerCount <= 0 ? (
          <EmptyCirclePieChart />
        ) : (
          <div className={`w-full h-full relative ${pieChartExtraClasses}`}>
            <VictoryPie
              padding={0}
              innerRadius={175}
              data={data.map(({ count }) => ({ x: '', y: count }))}
              labels={() => ''}
              colorScale={data.map(({ color }) => color)}
            />
            <p
              className={classNames(
                'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-regular dark:text-bright-gray',
                centerTitleClasses,
                centerTitleExtraClasses
              )}
            >
              {centerCount <= MAX_COUNT ? centerCount : MAX_COUNT + '+'}
            </p>
            {tooltipText && showTooltip && (
              <div
                className="
                absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[110%]
                bg-black/80 text-white text-xs rounded px-2 py-1 shadow-lg
                animate-fadeIn z-10 pointer-events-none text-center
                max-w-xs min-w-[80px] w-max whitespace-pre-line transition-opacity duration-300
              "
              >
                {tooltipText}
              </div>
            )}
          </div>
        )}
      </div>
      {title && (
        <div
          className={`flex items-center justify-center gap-1 mt-2 relative ${bottomTitleExtraClasses}`}
        >
          <p className="text-xs text-center font-semibold leading-relaxed dark:text-bright-gray">
            {title}
          </p>
        </div>
      )}
    </div>
  );
};

export default CirclePieChart;
