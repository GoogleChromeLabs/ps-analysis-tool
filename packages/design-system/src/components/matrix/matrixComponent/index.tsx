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
import Circle from '../../circle';

export interface MatrixComponentProps {
  color: string;
  title: string;
  description?: string;
  count: number;
  isExpanded?: boolean;
  countClassName: string;
  containerClasses: string;
}

const MatrixComponent = ({
  color,
  title,
  description = '',
  count,
  isExpanded = false,
  countClassName,
  containerClasses,
}: MatrixComponentProps) => {
  return (
    <div className={containerClasses}>
      <div className="flex gap-x-4">
        <Circle color={color} />
        <div className="lg:max-w-[80%] lg:mr-8">
          <h4 className="-mt-[3px] mb-1.5 text-xs font-medium dark:text-bright-gray">
            {title}
          </h4>
          <p style={{ color }} className={countClassName}>
            {count}
          </p>
          {description && isExpanded && (
            <p
              className="mt-2 text-xs text-darkest-gray dark:text-bright-gray"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrixComponent;
