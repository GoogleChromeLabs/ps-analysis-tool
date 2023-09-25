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
import type { CookieStatsComponents } from './type';
import type { CookiesCount } from '@cookie-analysis-tool/common';

interface DataMapping {
  title: string;
  count: number;
  data: {
    count: number;
    color: string;
  }[];
}

interface LandingHeaderProps {
  cookieStats: CookiesCount;
  cookiesStatsComponents: CookieStatsComponents;
}

const LandingHeader = ({
  cookieStats,
  cookiesStatsComponents,
}: LandingHeaderProps) => {
  const dataMapping: DataMapping[] = [
    {
      title: 'Total cookies',
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
    },
    {
      title: '1st party cookies',
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
    },
    {
      title: '3rd party cookies',
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
    },
  ];

  return (
    <div
      className="flex justify-center border-b border-hex-gray pt-5 pb-5 dark:border-quartz"
      data-testid="cookies-landing-header"
    >
      <div className="lg:max-w-[729px] flex gap-9 px-4">
        {dataMapping.map((circleData, index) => {
          return (
            <div key={index} className="text-center w-16">
              <CirclePieChart
                title={circleData.title}
                centerCount={circleData.count}
                data={circleData.data}
                infoIconClassName="absolute -right-3"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingHeader;
