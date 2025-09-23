/*
 * Copyright 2025 Google LLC
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
import React, { useEffect, useState } from 'react';
import { CirclePieChart, PillToggle } from '@google-psat/design-system';
import classnames from 'classnames';

type StatItem = {
  title: string;
  centerCount: number;
  color?: string;
  onClick?: () => void;
  data?: { count: number; color: string }[];
  tooltipText?: string;
};

export type Stats = {
  site: StatItem[];
  global: StatItem[];
};

interface StatsHeaderProps {
  stats: Stats;
  setPillState: React.Dispatch<React.SetStateAction<string | null>>;
}

const StatsHeader = ({ stats, setPillState }: StatsHeaderProps) => {
  const [pillToggle, setPillToggle] = useState<string | null>('Site');
  const [highlightOption, setHighlightOption] = useState<string>('Site');

  useEffect(() => {
    setPillState(pillToggle);
  }, [pillToggle, setPillState]);

  const renderPieCharts = (items: StatItem[]) => (
    <>
      {items.map(
        ({ title, centerCount, color, onClick, data, tooltipText }, index) => (
          <button
            key={index}
            className={classnames('group text-center w-20 p-2 h-full', {
              'active:opacity-50 hover:scale-95 transition-all duration-300 ease-in-out':
                onClick,
            })}
            style={{ cursor: !onClick ? 'default' : 'pointer' }}
            onClick={() => {
              onClick?.();
            }}
          >
            <CirclePieChart
              key={title}
              title={title}
              centerCount={centerCount}
              data={data ?? [{ count: 10, color: color ?? '' }]}
              infoIconClassName="absolute -right-3"
              bottomTitleExtraClasses="min-w-[150px]"
              tooltipText={tooltipText}
              centerTitleExtraClasses={classnames({
                'group-hover:scale-125 transition-all duration-300 ease-in-out':
                  onClick,
              })}
              pieChartExtraClasses={classnames({
                'group-hover:scale-[1.15] transition-all duration-200 ease-in-out group-hover:bg-[#f3f3f3] dark:group-hover:bg-[#191919] rounded-full':
                  onClick,
              })}
            />
          </button>
        )
      )}
    </>
  );

  const sitePieCharts = renderPieCharts(stats.site);
  const globalPieCharts = renderPieCharts(stats.global);

  const pillToggleButtons = (
    <PillToggle
      options={['Site', 'Session']}
      pillToggle={pillToggle}
      setPillToggle={setPillToggle}
      eeAnimatedTab={true}
      highlightOption={highlightOption}
      setHighlightOption={setHighlightOption}
      persistenceKey="statsHeaderPillToggle"
    />
  );

  return (
    <div className="flex flex-col flex-row w-full py-2">
      <div className="flex-shrink-0 px-2 py-1">{pillToggleButtons}</div>
      <div className="flex flex-1 justify-center">
        <div className="flex flex-row items-center gap-8 w-full justify-center">
          {pillToggle === 'Site' ? sitePieCharts : globalPieCharts}
        </div>
      </div>
      <div className="flex-shrink-0 px-2 py-1 invisible">
        {pillToggleButtons}
      </div>{' '}
      {/*Work around to center the circles div without using position absolute that would break the responsive design or hardcoding px values.*/}
    </div>
  );
};

export default StatsHeader;
