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
import React from 'react';
import { VictoryPie } from 'victory';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import EmptyCirclePieChart from './emptyCirclePieChart';
import { InfoIcon } from '@ps-analysis-tool/design-system';

interface CirclePieChartProps {
  centerCount: number;
  data: { count: number; color: string }[];
  title?: string;
  fallbackText?: string;
  infoIconClassName?: string;
  centerTitleExtraClasses?: string;
  pieChartExtraClasses?: string;
}

export const MAX_COUNT = 999;

const CirclePieChart = ({
  centerCount,
  data,
  title,
  infoIconClassName = '',
  centerTitleExtraClasses = '',
  pieChartExtraClasses = '',
}: CirclePieChartProps) => {
  const centerTitleClasses = centerCount <= MAX_COUNT ? 'text-2xl' : 'text-l';

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="inline-block align-bottom w-16">
        {centerCount <= 0 ? (
          <EmptyCirclePieChart />
        ) : (
          <div className={`w-full h-full relative ${pieChartExtraClasses}`}>
            <VictoryPie
              padding={0}
              innerRadius={175}
              animate={{ duration: 400 }}
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
          </div>
        )}
      </div>
      {title && (
        <div className="flex items-center justify-center gap-1 mt-2 relative">
          <p className="text-xs text-center font-semibold leading-relaxed dark:text-bright-gray">
            {title}
          </p>
          {title === '3rd Party Cookies' && (
            <p
              className={infoIconClassName}
              title="Cookies must be analyzed on a new, clean Chrome profile for an accurate report"
            >
              <InfoIcon className="fill-granite-gray" />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CirclePieChart;
