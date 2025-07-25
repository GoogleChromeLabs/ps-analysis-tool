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
import { type DataMapping } from '@google-psat/common';
import classnames from 'classnames';

/**
 * Internal depenencies.
 */
import CirclePieChart from '../../circlePieChart';
interface LandingHeaderProps {
  dataMapping?: DataMapping[];
  extraClasses?: string;
}

const LandingHeader = ({
  dataMapping = [],
  extraClasses = '',
}: LandingHeaderProps) => {
  return (
    <div
      className={classnames(
        'flex justify-center border-hex-gray pt-5 dark:border-quartz border-t',
        {
          [extraClasses]: Boolean(extraClasses),
        }
      )}
      data-testid="cookies-landing-header"
    >
      <div className="lg:max-w-[729px] flex gap-9">
        {dataMapping.map((circleData, index) => {
          return (
            <div key={index} className="text-center w-fit h-fit">
              <button
                key={index}
                className={classnames('group text-center w-20 p-2 h-full', {
                  'active:opacity-50 hover:scale-95 transition-all duration-300 ease-in-out cursor-pointer ':
                    circleData.onClick,
                  'cursor-default': !circleData.onClick,
                })}
                onClick={() => {
                  circleData.onClick?.();
                }}
              >
                <CirclePieChart
                  title={circleData.title}
                  centerCount={circleData.count}
                  data={circleData.data}
                  infoIconClassName="absolute -right-3"
                  centerTitleExtraClasses={classnames({
                    'group-hover:scale-125 transition-all duration-300 ease-in-out':
                      circleData.onClick,
                  })}
                  pieChartExtraClasses={classnames({
                    'group-hover:scale-[1.15] transition-all duration-200 ease-in-out group-hover:bg-[#f3f3f3] dark:group-hover:bg-[#191919] rounded-full':
                      circleData.onClick,
                  })}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingHeader;
