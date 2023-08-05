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
import { CirclePieChart } from '../../../../../../design-system/components';

interface DataMapping {
  title: string;
  count: number;
  data: {
    count: number;
    color: string;
  }[];
}

interface LandingHeaderProps {
  dataMapping: DataMapping[];
}

const LandingHeader = ({ dataMapping }: LandingHeaderProps) => {
  return (
    <div className="flex justify-center pt-20 pb-[35px] border-b border-hex-gray">
      <div className="flex gap-[35px]">
        {dataMapping.map((circleData, index) => {
          return (
            <div key={index} className="text-center w-16">
              <CirclePieChart
                title={circleData.title}
                centerCount={circleData.count}
                data={circleData.data}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingHeader;
