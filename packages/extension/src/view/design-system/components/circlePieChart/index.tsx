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

interface CirclePieChartProps {
  centerCount: number;
  data: { count: number; color: string }[];
  title?: string;
  isSmall?: boolean;
  fallbackText?: string;
}

export const MAX_COUNT = 999;

const CirclePieChart = ({
  centerCount,
  data,
  title,
  isSmall = false,
  fallbackText,
}: CirclePieChartProps) => {
  let centerTitleClasses = centerCount <= MAX_COUNT ? 'text-2xl' : 'text-l';
  const containerWidthClass = isSmall ? 'w-8' : 'w-16';

  if (isSmall) {
    centerTitleClasses = centerCount <= MAX_COUNT ? 'text-xs' : 'text-xxxs';
  }

  if (centerCount <= 0) {
    return (
      <EmptyCirclePieChart
        title={title}
        isSmall={isSmall}
        fallbackText={fallbackText}
      />
    );
  }

  return (
    <>
      <div
        className={classNames(
          'h-full inline-block align-bottom',
          containerWidthClass
        )}
      >
        <div className="w-full h-full relative">
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
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium',
              centerTitleClasses
            )}
          >
            {centerCount <= MAX_COUNT ? centerCount : MAX_COUNT + '+'}
          </p>
        </div>
      </div>
      {title && (
        <p className="text-xs text-center font-semibold mt-2">{title}</p>
      )}
    </>
  );
};

export default CirclePieChart;
