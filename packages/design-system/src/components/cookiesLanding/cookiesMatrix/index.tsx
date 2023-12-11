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
  MatrixComponentHorizontal,
  Matrix,
  type MatrixComponentProps,
  InfoIcon,
} from '@ps-analysis-tool/design-system';
import {
  filterFramesWithCookies,
  type TabCookies,
  type TabFrames,
  Legend,
} from '@ps-analysis-tool/common';

interface CookiesMatrixProps {
  tabCookies: TabCookies | null;
  componentData: Legend[];
  tabFrames: TabFrames | null;
  title?: string;
  description?: string;
  showHorizontalMatrix?: boolean;
  showInfoIcon?: boolean;
  count?: number | null;
  associatedCookiesCount?: number | null;
  allowExpand?: boolean;
  highlightTitle?: boolean;
  capitalizeTitle?: boolean;
}

interface LegendData {
  [key: string]: {
    description: string;
    countClassName: string;
  };
}

const LEGEND_DATA: LegendData = {
  Functional: {
    description:
      'Cookies necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size, etc.)',
    countClassName: 'text-functional',
  },
  Marketing: {
    description:
      "Cookies used to track visitors across websites, gathering information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
    countClassName: 'text-marketing',
  },
  Analytics: {
    description:
      'Cookies used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site.',
    countClassName: 'text-analytics',
  },
  Uncategorized: {
    description:
      'Cookies that could not be categorized. You may check sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
    countClassName: 'text-uncategorized',
  },
};

const CookiesMatrix = ({
  tabCookies,
  componentData,
  tabFrames,
  title = 'Cookies Insights',
  description = '',
  showHorizontalMatrix = true,
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
      const additionalDataComponent = LEGEND_DATA[component.label] || {};
      const comp = {
        ...component,
        ...additionalDataComponent,
        title: component.label,
        isExpanded,
        containerClasses: '',
      };

      return comp;
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
    <div className="w-full" data-testid="cookies-matrix">
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
        <Matrix dataComponents={dataComponents} />
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
