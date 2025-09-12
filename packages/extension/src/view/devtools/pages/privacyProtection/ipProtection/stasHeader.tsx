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
import React, { useState } from 'react';
import { CirclePieChart, PillToggle } from '@google-psat/design-system';

const StatsHeader = () => {
  const [pillToggle, setPillToggle] = useState<string | null>('Site');
  const [highlightOption, setHighlightOption] = useState<string>('Site');

  const sitePieCharts = (
    <>
      <CirclePieChart
        title="PRTs with Signals"
        centerCount={4}
        data={[
          {
            count: 9,
            color: '#AF7AA3',
          },
        ]}
        infoIconClassName="absolute -right-3"
      />
      <CirclePieChart
        title="PRTs without Signals"
        centerCount={3}
        data={[
          {
            count: 1,
            color: '#F54021',
          },
        ]}
        infoIconClassName="absolute -right-3"
      />
    </>
  );

  const globalPieCharts = (
    <>
      <CirclePieChart
        title="PRTs with Signals"
        centerCount={2}
        data={[
          {
            count: 10,
            color: '#AF7AA3',
          },
        ]}
        infoIconClassName="absolute -right-3"
      />
      <CirclePieChart
        title="PRTs without Signals"
        centerCount={1}
        data={[
          {
            count: 3,
            color: '#F54021',
          },
        ]}
        infoIconClassName="absolute -right-3"
      />
    </>
  );

  return (
    <div className="flex flex-col flex-row w-full py-2">
      <div className="px-2 py-1">
        <PillToggle
          options={['Site', 'Global']}
          pillToggle={pillToggle}
          setPillToggle={setPillToggle}
          eeAnimatedTab={true}
          highlightOption={highlightOption}
          setHighlightOption={setHighlightOption}
          persistenceKey="statsHeaderPillToggle"
        />
      </div>
      <div className="w-2/5 h-full"></div>
      <div className="flex flex-row items-center gap-2 w-1/5 justify-center">
        {pillToggle === 'Site' ? sitePieCharts : globalPieCharts}
      </div>
      <div className="w-2/5 h-full"></div>
    </div>
  );
};

export default StatsHeader;
