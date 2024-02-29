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
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
import MatrixComponent, { type MatrixComponentProps } from './matrixComponent';

interface MatrixProps {
  dataComponents: MatrixComponentProps[];
  expand?: boolean;
}

const Matrix = ({ dataComponents, expand }: MatrixProps) => {
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
            <div
              key={index}
              className={classnames(
                'py-1 border-bright-gray dark:border-quartz',
                {
                  'border-b': !isLastTwoItems,
                }
              )}
            >
              <button
                onClick={() => dataComponent.onClick?.(dataComponent.title)}
                className={classnames('p-3.5 w-full box-border', {
                  'hover:opacity-90 active:opacity-50 hover:scale-[0.98] hover:bg-[#f5f5f5] hover:dark:bg-[#1d1d1d] hover:shadow-[inset_0_0_10px_5px_rgba(238,238,238,0.5)] hover:dark:shadow-[inset_0_0_10px_5px_rgba(32,32,32,0.1)] rounded-md transition-all duration-75 ease-in-out cursor-pointer':
                    dataComponent.onClick,
                  'cursor-default': !dataComponent.onClick,
                })}
              >
                <MatrixComponent
                  isExpanded={expand}
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

export default Matrix;
