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
  MatrixComponent,
  MatrixComponentHorizontal,
} from '../../../../../../design-system/components';

const LEGEND_DATA = {
  Functional: {
    title: 'Functional Cookies',
    description:
      'These are essential cookies that are necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size).',
    textClassName: 'text-functional',
  },
  Marketing: {
    title: 'Marketing Cookies',
    description:
      "They are used to track visitors across websites to gather information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
    textClassName: 'text-marketing',
  },
  Analytics: {
    title: 'Analytics Cookies',
    description:
      'Used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site. This data helps website owners understand and improve the user experience, optimize content, and identify areas for enhancement.',
    textClassName: 'text-analytics',
  },
  Uncategorised: {
    title: 'Uncategorized Cookies',
    description:
      'We were unable to categorize these cookies as they are not available in our current database. However, you can try visiting websites such as cookiedatabase.org and cookiesearch.org to find more information about these cookies.',
    textClassName: 'text-uncategorized',
  },
};

const CookiesMatrix = ({ cookiesStatsComponents, totalFrames }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dataComponents = cookiesStatsComponents.legend.map((dataComponent) => {
    const additionalDataComponent = LEGEND_DATA[dataComponent.label] || {};

    return {
      ...dataComponent,
      ...additionalDataComponent,
      isExpanded,
      containerClasses: 'mb-5 pb-3 pl-3 border-b border-bright-gray',
    };
  });

  const matrixHorizontalComponents = [
    {
      title: 'Invalid Cookies',
      description:
        'The cookies which could not be stored in the cookie jar of the browser as they were invalid.',
      count: 2,
      expand: isExpanded,
      containerClasses: 'mb-5 pl-3',
    },
    {
      title: 'Number of frames',
      description:
        'The cookies which could not be stored in the cookie jar of the browser as they were invalid.',
      count: totalFrames,
      expand: isExpanded,
      containerClasses: 'mb-5 pl-3',
    },
    {
      title: 'Number of Frames with Associated Cookies',
      description:
        'The cookies which could not be stored in the cookie jar of the browser as they were invalid.',
      count: 5,
      expand: isExpanded,
      containerClasses: 'mb-5 pl-3',
    },
  ];

  return (
    <div className="w-full">
      <div>
        <div className="flex gap-5 justify-between">
          <h4 className="mb-5 pb-3 grow border-b border-bright-gray text-xs font-bold text-darkest-gray">
            Cookies Matrix
          </h4>
          <h4 className="mb-5 pb-3 grow border-b border-bright-gray text-xs font-bold text-darkest-gray text-right">
            <button onClick={() => setIsExpanded((state) => !state)}>
              {isExpanded ? 'Collapse View' : 'Expand View'}
            </button>
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {dataComponents.map((dataComponent, index) => (
            <MatrixComponent key={index} {...dataComponent} />
          ))}
        </div>
      </div>
      <div>
        {matrixHorizontalComponents.map((matrixHorizontalComponent, index) => (
          <MatrixComponentHorizontal
            key={index}
            {...matrixHorizontalComponent}
          />
        ))}
      </div>
    </div>
  );
};

export default CookiesMatrix;
