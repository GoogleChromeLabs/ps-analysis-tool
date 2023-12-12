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
import {
  type TabCookies,
  type TabFrames,
  Legend,
  filterFramesWithCookies,
} from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import Matrix from '../../matrix';
import type { MatrixComponentProps } from '../../matrix/matrixComponent';
import { InfoIcon } from '../../../icons';
import { LEGEND_DATA, BLOCKED_COOKIE_LEGEND_DATA } from './constants';
import MatrixComponentHorizontal from '../../matrix/matrixComponent/matrixComponentHorizontal';

interface CookiesMatrixProps {
  tabCookies: TabCookies | null;
  componentData?: Legend[];
  tabFrames: TabFrames | null;
  title?: string;
  description?: string;
  showHorizontalMatrix?: boolean;
  showMatrix?: boolean;
  showInfoIcon?: boolean;
  count?: number | null;
  associatedCookiesCount?: number | null;
  allowExpand?: boolean;
  highlightTitle?: boolean;
  capitalizeTitle?: boolean;
}

const CookiesMatrix = ({
  tabCookies,
  tabFrames,
  componentData = [],
  title = 'Cookie Classification',
  description = '',
  showHorizontalMatrix = true,
  showMatrix = true,
  showInfoIcon = true,
  count = null,
  associatedCookiesCount = null,
  allowExpand = true,
  highlightTitle = false,
  capitalizeTitle = false,
}: CookiesMatrixProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataComponents: MatrixComponentProps[] = componentData.map(
    (component) => {
      const additionalDataComponent =
        LEGEND_DATA[component.label] ||
        BLOCKED_COOKIE_LEGEND_DATA[component.label] ||
        {};
      if (title === 'Cookie Classification') {
        return {
          ...additionalDataComponent,
          ...component,
          title: component.label,
          isExpanded,
          containerClasses: '',
        };
      } else if (title === 'Cookie Blockages') {
        if (component.count && component.count > 0) {
          return {
            ...additionalDataComponent,
            ...component,
            title: component.label,
            isExpanded,
            containerClasses: '',
          };
        }
      }
      return {};
    }
  );
  const totalFrames = tabFrames ? Object.keys(tabFrames).length : 0;
  const framesWithCookies = filterFramesWithCookies(tabCookies, tabFrames);

  const matrixHorizontalComponents = [
    {
      title: 'Number of Frames',
      description: 'Number of frames found on the page.',
      count: totalFrames,
      expand: isExpanded,
    },
    {
      title: 'Number of Frames with Associated Cookies',
      description: 'Frames that have cookies associated with them.',
      count: associatedCookiesCount
        ? associatedCookiesCount
        : framesWithCookies
        ? Object.keys(framesWithCookies).length
        : 0,
      expand: isExpanded,
    },
  ];
  return (
    <div className="w-full" data-testid={`cookies-matrix-${title}`}>
      <div>
        <div className="flex gap-x-5 justify-between border-b border-bright-gray dark:border-quartz">
          <div className="pb-3 flex flex-col gap-1.5">
            <h4
              className={`flex items-center gap-1 flex-1 grow text-xs font-bold text-darkest-gray dark:text-bright-gray ${
                highlightTitle ? 'text-red-500 dark:text-red-500' : ''
              } ${capitalizeTitle ? 'capitalize' : 'uppercase'}`}
            >
              <span>{title}</span>
              {showInfoIcon && (
                <span title="Cookies must be analyzed on a new, clean Chrome profile for an accurate report.">
                  <InfoIcon />
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
              <button onClick={() => setIsExpanded((state) => !state)}>
                {isExpanded ? 'Collapse View' : 'Expand View'}
              </button>
            </h4>
          )}
        </div>
        {showMatrix && <Matrix dataComponents={dataComponents} />}
      </div>
      {showHorizontalMatrix && (
        <div>
          {matrixHorizontalComponents.map(
            (matrixHorizontalComponent, index) => (
              <MatrixComponentHorizontal
                key={index}
                {...matrixHorizontalComponent}
                containerClasses="px-3.5 py-4"
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CookiesMatrix;
