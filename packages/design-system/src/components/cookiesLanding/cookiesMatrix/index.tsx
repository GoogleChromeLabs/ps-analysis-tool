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
import {
  type TabCookies,
  type TabFrames,
  Legend,
  filterFramesWithCookies,
} from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import type { MatrixComponentProps } from '../../matrix/matrixComponent';
import { type MatrixComponentHorizontalProps } from '../../matrix/matrixComponent/matrixComponentHorizontal';
import { LEGEND_DESCRIPTION } from '../../../constants';
import MatrixContainer from '../../matrixContainer';

interface CookiesMatrixProps {
  tabCookies: TabCookies | null;
  componentData?: Legend[];
  tabFrames: TabFrames | null;
  title?: string;
  description?: string;
  showHorizontalMatrix?: boolean;
  showMatrix?: boolean;
  count?: number | null;
  associatedCookiesCount?: number | null;
  allowExpand?: boolean;
  highlightTitle?: boolean;
  capitalizeTitle?: boolean;
  matrixHorizontalData?: MatrixComponentHorizontalProps[] | null;
  infoIconTitle?: string;
}

const CookiesMatrix = ({
  tabCookies,
  tabFrames,
  componentData = [],
  title = 'Categories',
  description = '',
  showHorizontalMatrix = true,
  showMatrix = true,
  count = null,
  associatedCookiesCount = null,
  allowExpand = true,
  highlightTitle = false,
  capitalizeTitle = false,
  matrixHorizontalData = null,
  infoIconTitle,
}: CookiesMatrixProps) => {
  const dataComponents: MatrixComponentProps[] = [];

  componentData.forEach((component) => {
    const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
    dataComponents.push({
      ...component,
      description: legendDescription,
      title: component.label,
      containerClasses: '',
    });
  });

  const totalFrames = tabFrames ? Object.keys(tabFrames).length : 0;
  const framesWithCookies = filterFramesWithCookies(tabCookies, tabFrames);

  const matrixHorizontalComponents = matrixHorizontalData
    ? matrixHorizontalData
    : [
        {
          title: 'Number of Frames',
          description: 'Number of unique frames found across the page(s).',
          count: totalFrames,
        },
        {
          title: 'Number of Frames with Associated Cookies',
          description:
            'Unique frames across the page(s) that have cookies associated with them.',
          count: associatedCookiesCount
            ? associatedCookiesCount
            : framesWithCookies
            ? Object.keys(framesWithCookies).length
            : 0,
        },
      ];

  return (
    <div className="w-full" data-testid={`cookies-matrix-${title}`}>
      <MatrixContainer
        matrixData={dataComponents}
        horizontalMatrixData={
          showHorizontalMatrix ? matrixHorizontalComponents : undefined
        }
        title={title}
        description={description}
        showMatrix={showMatrix}
        count={count}
        allowExpand={allowExpand}
        highlightTitle={highlightTitle}
        capitalizeTitle={capitalizeTitle}
        infoIconTitle={infoIconTitle}
      />
    </div>
  );
};

export default CookiesMatrix;
