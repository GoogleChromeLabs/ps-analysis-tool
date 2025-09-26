/*
 * Copyright 2025 Google LLC
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
import { useScriptBlocking } from '../../../../stateProviders';
import InsightsStats from '../../mdlCommon/insightsStats';

const SessionInsights = () => {
  const { statistics } = useScriptBlocking(({ state }) => ({
    statistics: state.statistics,
  }));

  const stats = [
    {
      title: 'Domains',
      centerCount: statistics.globalView.domains,
      color: '#25ACAD',
      description: 'Total browsing session domains',
      countClassName: 'text-emerald',
    },
    {
      title: 'BDL',
      centerCount:
        statistics.globalView.partiallyBlockedDomains +
        statistics.globalView.completelyBlockedDomains,
      color: '#7D8471',
      description: 'Total domains in block list',
      countClassName: 'text-max-yellow-red',
    },
    {
      title: 'Blockings',
      centerCount:
        statistics.globalView.partiallyBlockedDomains +
        statistics.globalView.completelyBlockedDomains,
      color: '#4C79F4',
      data: [
        {
          color: '#4C79F4',
          count: statistics.globalView.partiallyBlockedDomains,
        },
        {
          color: '#F3AE4E',
          count: statistics.globalView.completelyBlockedDomains,
        },
      ],
      description: 'Blocked domains',
      countClassName: 'text-blue-berry',
    },
    {
      title: 'Complete',
      centerCount: statistics.globalView.completelyBlockedDomains,
      color: '#F3AE4E',
      description: 'Completely blocked domains',
      countClassName: 'text-blue-berry',
    },
    {
      title: 'Partial',
      centerCount: statistics.globalView.partiallyBlockedDomains,
      color: '#4C79F4',
      description: 'Partially blocked domains',
      countClassName: 'text-blue-berry',
    },
  ];

  //   {
  //     color: '#5CC971',
  //     containerClasses: '',
  //     count: 7,
  //     countClassName: 'text-emerald',
  //     description:
  //       'These are essential cookies that are necessary for a website to function properly. They enable basic functionalities such as page navigation, access to secure areas, and remembering user preferences (e.g., language, font size), etc.',
  //     isExpanded: true,
  //     title: 'Functional',
  //   },
  //   {
  //     color: '#F3AE4E',
  //     containerClasses: '',
  //     count: 9,
  //     countClassName: 'text-max-yellow-red',
  //     description:
  //       "They are used to track visitors across websites to gather information about their browsing habits. The data collected is often used by advertisers to deliver targeted advertisements that are relevant to the user's interests.",
  //     isExpanded: true,
  //     title: 'Marketing',
  //   },
  //   {
  //     color: '#4C79F4',
  //     containerClasses: '',
  //     count: 2,
  //     countClassName: 'text-blue-berry',
  //     description:
  //       'Used to gather information about how users interact with a website. They provide website owners with insights into user behavior, such as the number of visitors, the most popular pages, and the average time spent on the site. This data helps website owners understand and improve the user experience, optimize content, and identify areas for enhancement.',
  //     isExpanded: true,
  //     title: 'Analytics',
  //   },
  //   {
  //     color: '#EC7159',
  //     containerClasses: '',
  //     count: 23,
  //     countClassName: 'text-blue-berry',
  //     description:
  //       'We are unable to categorize certain cookies since we do not possess any relevant information about them. Nonetheless, you may visit sites like cookiedatabase.org and cookiesearch.org to acquire additional details about these cookies.',
  //     isExpanded: true,
  //     title: 'Uncategorized',
  //   },
  // ];

  return <InsightsStats stats={stats} />;
};

export default SessionInsights;
