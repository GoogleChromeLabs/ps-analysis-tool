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
import { InfoIcon } from '../../../../icons';

interface EmptyCirclePieChartProps {
  fallbackText?: string;
  title?: string;
  isPrimary?: boolean;
  infoIconClassName?: string;
}

const EmptyCirclePieChart = ({
  fallbackText,
  title,
  isPrimary = true,
  infoIconClassName = '',
}: EmptyCirclePieChartProps) => {
  const containerWidthClass = isPrimary ? 'w-16' : 'w-8';
  const centerTitleClasses = isPrimary
    ? 'text-xs leading-4'
    : 'text-[7px] leading-[7px]'; // Font size and line height are added as an exception to handle edge case.

  return (
    <>
      <div
        className={classNames(
          'max-w-xs inline-block align-bottom',
          containerWidthClass
        )}
      >
        <div className="w-full h-full relative">
          <VictoryPie
            padding={0}
            innerRadius={0}
            colorScale={[COLOR_MAP.brightGray]}
            data={[{ x: '', y: 100 }]}
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
        <div className="flex items-center justify-center gap-1 mt-2 relative">
          <p className="text-xs text-center font-semibold mt-2 leading-relaxed dark:text-bright-gray">
            {title}
          </p>
          {title.toLocaleLowerCase() === '3rd party cookies' && (
            <p
              className={infoIconClassName}
              title="An active ad-blocker or other cookie extensions may affect the results."
            >
              <InfoIcon />
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default EmptyCirclePieChart;
