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
import React, { useMemo } from 'react';
import { MatrixComponent } from '@google-psat/design-system';

interface AdMatrixProps {
  adUnitsCount: number;
  biddersCount: number;
  bidsCount: number;
  noBidsCount: number;
}

const AdMatrix = ({
  adUnitsCount,
  biddersCount,
  bidsCount,
  noBidsCount,
}: AdMatrixProps) => {
  const matrixData = useMemo(
    () => [
      {
        title: 'Ad Units',
        count: adUnitsCount,
        color: '#5CC971',
        description: 'Placeholder',
        countClassName: 'text-[#5CC971]',
      },
      {
        title: 'Bidders',
        count: biddersCount,
        color: '#F3AE4E',
        description: 'Placeholder',
        countClassName: 'text-[#F3AE4E]',
      },
      {
        title: 'Bids',
        count: bidsCount,
        color: '#4C79F4',
        description: 'Placeholder',
        countClassName: 'text-[#4C79F4]',
      },
      {
        title: 'No Bids',
        count: noBidsCount,
        color: '#EC7159',
        description: 'Placeholder',
        countClassName: 'text-[#EC7159]',
      },
    ],
    [adUnitsCount, biddersCount, bidsCount, noBidsCount]
  );

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
