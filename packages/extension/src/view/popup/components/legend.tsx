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

interface LegendIconProps {
  color: string;
}

const LegendIcon = ({ color }: LegendIconProps) => (
  <div
    className="w-4 h-4 rounded-full flex items-center justify-center mr-2"
    style={{ backgroundColor: color }}
  >
    <div className="w-2 h-2 rounded-full flex items-center justify-center bg-white"></div>
  </div>
);

const LEGEND = [
  { color: '#00B04C', label: 'Functional' },
  { color: '#FFBF00', label: 'Marketing' },
  { color: '#3D7AFC', label: 'Analytics' },
  { color: '#FC260A', label: 'Unknown' },
];

interface LegendProps {
  counts: number[];
}

const Legend = ({ counts }: LegendProps) => {
  return (
    <div className="flex flex-col">
      {LEGEND.map(({ color, label }, idx) => (
        <div key={idx} className="w-36 flex items-center justify-center my-1">
          <LegendIcon color={color} />
          <p className="flex-1 text-[#111B21] text-xs">{label}</p>
          <p className=" text-[#111B21] text-xs"> {counts[idx]} </p>
        </div>
      ))}
    </div>
  );
};

export default Legend;
