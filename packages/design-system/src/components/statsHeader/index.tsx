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

/**
 * Internal dependencies.
 */
import CirclePieChart from '../circlePieChart';

interface StatsHeaderProps {
  title: string;
}

const StatsHeader = ({ title }: StatsHeaderProps) => {
  return (
    <div className="border border-gray-200">
      {title}
      <div className="flex flex-col flex-row w-full py-0">
        <div className="w-2/5 h-full"></div>
        <div className="flex flex-row items-center gap-2 w-1/5 justify-center">
          <CirclePieChart
            title="PRTs"
            centerCount={10}
            data={[
              {
                count: 1,
                color: '#C5A06A',
              },
              {
                count: 9,
                color: '#AF7AA3',
              },
            ]}
            infoIconClassName="absolute -right-3"
          />
          <CirclePieChart
            title="Script Blocking"
            centerCount={4}
            data={[
              {
                count: 1,
                color: '#F54021',
              },
              {
                count: 3,
                color: '#25ACAD',
              },
            ]}
            infoIconClassName="absolute -right-3"
          />
        </div>
        <div className="w-2/5 h-full"></div>
      </div>
    </div>
  );
};

export default StatsHeader;
