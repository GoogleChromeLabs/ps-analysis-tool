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
import MatrixComponent, { type MatrixComponentProps } from './matrixComponent';

interface MatrixProps {
  dataComponents: MatrixComponentProps[];
}

const Matrix = ({ dataComponents }: MatrixProps) => {
  if (!dataComponents || !dataComponents.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-x-5" data-testid="matrix">
      {dataComponents.map((dataComponent, index) => {
        if (dataComponent && dataComponent.countClassName) {
          const isLastTwoItems =
            index === dataComponents.length - 1 ||
            index === dataComponents.length - 2;
          return (
            <MatrixComponent
              key={index}
              {...dataComponent}
              containerClasses={`p-3.5 ${
                !isLastTwoItems ? 'border-b' : ''
              } border-bright-gray dark:border-quartz`}
              countClassName={
                dataComponent.countClassName + ' text-xxl leading-none'
              }
            />
          );
        }
        return null;
      })}
    </div>
  );
};

export default Matrix;
