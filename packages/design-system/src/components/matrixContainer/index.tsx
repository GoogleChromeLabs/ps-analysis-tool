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
import React, { useState } from 'react';

/**
 * Internal dependencies
 */
import { ArrowUp, InfoIcon } from '../../icons';
import Matrix from '../matrix';
import MatrixComponentHorizontal, {
  MatrixComponentHorizontalProps,
} from '../matrix/matrixComponent/matrixComponentHorizontal';
import { MatrixComponentProps } from '../matrix/matrixComponent';

interface MatrixContainerProps {
  matrixData?: MatrixComponentProps[];
  horizontalMatrixData?: MatrixComponentHorizontalProps[];
  title?: string;
  description?: string;
  showMatrix?: boolean;
  count?: number | null;
  allowExpand?: boolean;
  highlightTitle?: boolean;
  capitalizeTitle?: boolean;
  infoIconTitle?: string;
}

const MatrixContainer = ({
  matrixData = [],
  horizontalMatrixData = [],
  title = 'Categories',
  description = '',
  showMatrix = true,
  count = null,
  allowExpand = true,
  highlightTitle = false,
  capitalizeTitle = false,
  infoIconTitle = '',
}: MatrixContainerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full" data-testid={`matrix-${title}`}>
      <div>
        <div className="flex gap-x-5 justify-between border-b border-bright-gray dark:border-quartz">
          <div className="pb-3 flex flex-col gap-1.5">
            <h4
              className={`flex items-center gap-1 flex-1 grow text-xs font-bold text-darkest-gray dark:text-bright-gray ${
                highlightTitle ? 'text-red-500 dark:text-red-500' : ''
              } ${capitalizeTitle ? 'capitalize' : 'uppercase'}`}
            >
              <span>{title}</span>
              {Boolean(infoIconTitle) && (
                <span title={infoIconTitle}>
                  <InfoIcon className="fill-granite-gray" />
                </span>
              )}
              {count !== null && <span>: {Number(count) || 0}</span>}
            </h4>
            <p className="text-xs text-darkest-gray dark:text-bright-gray">
              {description}
            </p>
          </div>
          {allowExpand && (
            <h4 className="pb-3 flex-1 grow text-xs font-bold text-darkest-gray dark:text-bright-gray text-right">
              <button
                onClick={() => setIsExpanded((state) => !state)}
                data-testid="expand-button"
              >
                {isExpanded ? (
                  <ArrowUp className="fill-granite-gray" />
                ) : (
                  <ArrowUp className="fill-granite-gray rotate-180" />
                )}
              </button>
            </h4>
          )}
        </div>
        {showMatrix && (
          <Matrix dataComponents={matrixData} expand={isExpanded} />
        )}
      </div>
      {Boolean(horizontalMatrixData.length) && (
        <div>
          {horizontalMatrixData.map((data, index) => (
            <MatrixComponentHorizontal
              key={index}
              expand={isExpanded}
              {...data}
              containerClasses="px-3.5 py-4"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatrixContainer;
