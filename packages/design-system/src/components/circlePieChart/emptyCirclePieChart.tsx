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
/**
 * Internal dependencies
 */
import { COLOR_MAP } from '../../theme/colors';

const EmptyCirclePieChart = () => {
  return (
    <div className="w-full h-full relative">
      <VictoryPie
        padding={0}
        innerRadius={0}
        colorScale={[COLOR_MAP.brightGray.color]}
        data={[{ x: '', y: 100 }]}
      />
      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-40 text-2xl leading-4'">
        0
      </p>
    </div>
  );
};

export default EmptyCirclePieChart;
