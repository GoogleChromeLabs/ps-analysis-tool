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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { CirclePieChart } from '../../../../../../design-system/components';
import { COLOR_MAP } from '../../../../../../design-system/theme/colors';

interface DataMapping {
  title: string;
  count: number;
  data: {
    count: number;
    color: string;
  }[];
}

interface LandingHeaderProps {
  isSticky?: boolean;
}

const LandingHeader = ({ isSticky = false }: LandingHeaderProps) => {
  const dataMapping: DataMapping[] = [
    {
      title: 'Total cookies',
      count: 20,
      data: [
        { count: 5, color: COLOR_MAP.functional },
        { count: 7, color: COLOR_MAP.marketing },
        { count: 7, color: COLOR_MAP.analytics },
        { count: 3, color: COLOR_MAP.uncategorised },
      ],
    },
    {
      title: '1st party cookies',
      count: 10,
      data: [
        { count: 7, color: COLOR_MAP.functional },
        { count: 3, color: COLOR_MAP.marketing },
        { count: 10, color: COLOR_MAP.analytics },
      ],
    },
    {
      title: '3rd party cookies',
      count: 10,
      data: [
        { count: 5, color: COLOR_MAP.functional },
        { count: 10, color: COLOR_MAP.marketing },
      ],
    },
  ];

  const containerClassNames = classNames(
    'flex justify-center border-b border-hex-gray',
    {
      'pt-5 pb-[20px]': !isSticky,
      'py-4': isSticky,
    }
  );
  const wrapperClassNames = classNames('flex', {
    'gap-[35px]': !isSticky,
    'gap-[15px]': isSticky,
  });
  const circleContainerClassNames = classNames('text-center', {
    'w-16': !isSticky,
    'w-8': isSticky,
  });

  return (
    <div className={containerClassNames}>
      <div className={wrapperClassNames}>
        {dataMapping.map((circleData, index) => {
          return (
            <div key={index} className={circleContainerClassNames}>
              <CirclePieChart
                title={!isSticky ? circleData.title : ''}
                centerCount={circleData.count}
                data={circleData.data}
                isPrimary={!isSticky}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LandingHeader;
