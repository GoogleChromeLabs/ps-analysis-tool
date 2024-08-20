/*
 * Copyright 2024 Google LLC
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
import { MatrixComponent } from '@google-psat/design-system';

const AdMatrix = () => {
  const matrixData = [
    {
      title: 'Ad Unit 1',
      count: 5,
      color: '#5CC971',
      description: 'This is the first ad unit',
      countClassName: 'text-[#5CC971]',
    },
    {
      title: 'Ad Unit 2',
      count: 10,
      color: '#F3AE4E',
      description: 'This is the second ad unit',
      countClassName: 'text-[#F3AE4E]',
    },
    {
      title: 'Ad Unit 3',
      count: 15,
      color: '#4C79F4',
      description: 'This is the third ad unit',
      countClassName: 'text-[#4C79F4]',
    },
    {
      title: 'Ad Unit 4',
      count: 20,
      color: '#EC7159',
      description: 'This is the fourth ad unit',
      countClassName: 'text-[#EC7159]',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-x-2 max-w-2xl">
      {matrixData.map((dataComponent, index) => {
        if (dataComponent && dataComponent.countClassName) {
          return (
            <div key={index} className={'py-1'}>
              <button className="p-3.5 w-full box-border cursor-default">
                <MatrixComponent
                  {...dataComponent}
                  countClassName={
                    dataComponent.countClassName + ' text-xxl leading-none'
                  }
                />
              </button>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default AdMatrix;
