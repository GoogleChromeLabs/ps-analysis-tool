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

interface IPieChartProps {
  count: number;
  categoryCountData: {
    countMarketing: number;
    countAnalytics: number;
    countFuntional: number;
    countUnknown: number;
  };
}
const PieChart = ({ count, categoryCountData }: IPieChartProps) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full relative">
        <VictoryPie
          innerRadius={100}
          animate={{ duration: 400 }}
          data={[
            { x: '', y: categoryCountData.countFuntional },
            { x: '', y: categoryCountData.countMarketing },
            { x: '', y: categoryCountData.countAnalytics },
            { x: '', y: categoryCountData.countUnknown },
          ]}
          labels={() => null}
          colorScale={['#5FA569', '#FA752E', '#2e97fa', '#fa2e49']}
        />
        <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-lg">
          {count}
        </p>
      </div>
    </div>
  );
};

export default PieChart;
