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
import { COLOR_MAP } from '../../theme/colors';

interface EmptyCirclePieChartProps {
  fallbackText?: string;
  title?: string;
  isSmall?: boolean;
}

const EmptyCirclePieChart = ({
  fallbackText,
  title,
  isSmall = false,
}: EmptyCirclePieChartProps) => {
  const containerWidthClass = isSmall ? 'w-8' : 'w-16';
  const centerTitleClasses = isSmall
    ? 'text-[7px] leading-[7px]' // Font size and line height are added as an exception to handle edge case.
    : 'text-xs leading-4';

  return (
    <>
      <div
        className={classNames(
          'h-full max-w-xs inline-block align-bottom',
          containerWidthClass
        )}
      >
        <div className="w-full h-full relative">
          <VictoryPie
            padding={0}
            innerRadius={0}
            colorScale={[COLOR_MAP.brightGray]}
          />
          <p
            className={classNames(
              'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-raisin-black opacity-40',
              centerTitleClasses
            )}
          >
            {fallbackText || 'Not Found'}
          </p>
        </div>
      </div>
      {title && (
        <p className="text-xs text-center font-semibold mt-2">{title}</p>
      )}
    </>
  );
};

export default EmptyCirclePieChart;
