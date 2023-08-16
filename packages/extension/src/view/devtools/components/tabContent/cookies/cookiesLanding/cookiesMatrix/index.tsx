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
 * Internal dependencies.
 */
import {
  MatrixComponentHorizontal,
  Matrix,
  type MatrixComponentProps,
} from '../../../../../../design-system/components';
import { getInvalidCookies } from '../../utils/getInvalidCookies';
import { filterFramesWithCookies } from '../../utils/filterFramesWithCookies';
import type {
  TabCookies,
  TabFrames,
  CookieStatsComponents,
} from '../../../../../cookies.types';

interface CookiesMatrixProps {
  tabCookies: TabCookies | null;
  cookiesStatsComponents: CookieStatsComponents;
  tabFrames: TabFrames | null;
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
      'These are essential cookies that are necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size), etc.',
    countClassName: 'text-functional',
  },
  Marketing: {
    description:
      "They are used to track visitors across websites to gather information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
    countClassName: 'text-marketing',
  },
  Analytics: {
    description:
      'Used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site. This data helps website owners understand and improve the user experience, optimize content, and identify areas for enhancement.',
    countClassName: 'text-analytics',
  },
  Uncategorized: {
    description:
      'We are unable to categorize certain cookies since we do not possess any relevant information about them. Nonetheless, you may visit sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
    countClassName: 'text-uncategorized',
  },
};

const CookiesMatrix = ({
  tabCookies,
  cookiesStatsComponents,
  tabFrames,
}: CookiesMatrixProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.legend.map((component) => {
      const additionalDataComponent = LEGEND_DATA[component.label] || {};
      const comp = {
        ...component,
        ...additionalDataComponent,
        title: component.label,
        isExpanded,
        containerClasses: '',
      };

      return comp;
    });

  const invalidCookies = getInvalidCookies(tabCookies);
  const totalFrames = tabFrames ? Object.keys(tabFrames).length : 0;
  const framesWithCookies = filterFramesWithCookies(tabCookies, tabFrames);

  const matrixHorizontalComponents = [
    {
      title: 'Invalid Cookies',
      description:
        "Cookies which were deemed invalid and therefore not saved in the browser's cookie store.",
      count: invalidCookies ? Object.keys(invalidCookies).length : 0,
      expand: isExpanded,
    },
    {
      title: 'Number of Frames',
      description: 'Number of frames found on the page.',
      count: totalFrames,
      expand: isExpanded,
    },
    {
      title: 'Number of Frames with Associated Cookies',
      description: 'Frames that have cookies associated with them',
      count: framesWithCookies ? Object.keys(framesWithCookies).length : 0,
      expand: isExpanded,
    },
  ];

  return (
    <div className="w-full" data-testid="cookies-matrix">
      <div>
        <div className="flex gap-x-5 justify-between">
          <h4 className="pb-3 flex-1 grow border-b border-bright-gray text-xs font-bold text-darkest-gray dark:text-bright-gray uppercase">
            Cookies Matrix
          </h4>
          <h4 className="pb-3 flex-1 grow border-b border-bright-gray text-xs font-bold text-darkest-gray dark:text-bright-gray text-right">
            <button onClick={() => setIsExpanded((state) => !state)}>
              {isExpanded ? 'Collapse View' : 'Expand View'}
            </button>
          </h4>
        </div>
        <Matrix dataComponents={dataComponents} />
      </div>
      <div>
        {matrixHorizontalComponents.map((matrixHorizontalComponent, index) => (
          <MatrixComponentHorizontal
            key={index}
            {...matrixHorizontalComponent}
            containerClasses="px-3.5 py-4"
          />
        ))}
      </div>
    </div>
  );
};

export default CookiesMatrix;
