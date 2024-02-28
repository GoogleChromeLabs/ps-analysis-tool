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
import React, { useCallback } from 'react';
import { CirclePieChart } from '@ps-analysis-tool/design-system';
import classnames from 'classnames';

export interface DataMapping {
  title: string;
  count: number;
  data: {
    count: number;
    color: string;
  }[];
  accessorKey?: string;
  accessorValue?: string;
}

interface LandingHeaderProps {
  dataMapping?: DataMapping[];
  onClick?: (query: string) => void;
}

const LandingHeader = ({ dataMapping = [], onClick }: LandingHeaderProps) => {
  const handleClick = useCallback(
    (title?: string, accessorKey?: string) => {
      const query =
        accessorKey && title
          ? JSON.stringify({
              [accessorKey]: [title],
            })
          : '';

      onClick?.(query);
    },
    [onClick]
  );

  return (
    <div
      className={
        'flex justify-center border-hex-gray pt-5 pb-5 dark:border-quartz border-t'
      }
      data-testid="cookies-landing-header"
    >
      <div className="lg:max-w-[729px] flex gap-9 px-4">
        {dataMapping.map((circleData, index) => {
          return (
            <button
              key={index}
              className={classnames('text-center w-16', {
                'hover:opacity-70 active:opacity-50': onClick,
                'cursor-default': !onClick,
              })}
              onClick={() => {
                handleClick(circleData?.accessorValue, circleData?.accessorKey);
              }}
            >
              <CirclePieChart
                title={circleData.title}
                centerCount={circleData.count}
                data={circleData.data}
                infoIconClassName="absolute -right-3"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LandingHeader;
