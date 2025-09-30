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
import React, { useMemo } from 'react';

/**
 * Internal dependencies.
 */
import { useScriptBlocking } from '../../../../stateProviders';
import InsightsStats from '../../mdlCommon/insightsStats';

const SessionInsights = () => {
  const { statistics } = useScriptBlocking(({ state }) => ({
    statistics: state.statistics,
  }));

  const { stats, matrixData } = useMemo(
    () => ({
      stats: [
        {
          title: 'Domains',
          count: statistics.globalView.domains,
          color: '#25ACAD',
          data: [
            {
              count: statistics.globalView.domains,
              color: '#25ACAD',
            },
            {
              count:
                statistics.globalView.partiallyBlockedDomains +
                statistics.globalView.completelyBlockedDomains,
              color: '#4C79F4',
            },
          ],
          countClassName: 'text-emerald',
        },
        {
          title: 'Blockings',
          count:
            statistics.globalView.partiallyBlockedDomains +
            statistics.globalView.completelyBlockedDomains,
          color: '#EC7159',
          data: [
            {
              count: statistics.globalView.completelyBlockedDomains,
              color: '#F3AE4E',
            },
            {
              count: statistics.globalView.partiallyBlockedDomains,
              color: '#4C79F4',
            },
          ],
          countClassName: 'text-blue-berry',
        },
      ],
      matrixData: [
        {
          title: 'Domains',
          count: statistics.globalView.domains,
          color: '#25ACAD',
          description: 'Total browsing session domains',
          countClassName: 'text-emerald',
        },
        {
          title: 'BDL',
          count:
            statistics.globalView.partiallyBlockedDomains +
            statistics.globalView.completelyBlockedDomains,
          color: '#7D8471',
          description: 'Total domains in block list',
          countClassName: 'text-max-yellow-red',
        },
        {
          title: 'Blockings',
          count:
            statistics.globalView.partiallyBlockedDomains +
            statistics.globalView.completelyBlockedDomains,
          color: '#EC7159',
          description: 'Blocked domains',
          countClassName: 'text-blue-berry',
        },
        {
          title: 'Complete',
          count: statistics.globalView.completelyBlockedDomains,
          color: '#F3AE4E',
          description: 'Completely blocked domains',
          countClassName: 'text-blue-berry',
        },
        {
          title: 'Partial',
          count: statistics.globalView.partiallyBlockedDomains,
          color: '#4C79F4',
          description: 'Partially blocked domains',
          countClassName: 'text-blue-berry',
        },
      ],
    }),
    [
      statistics.globalView.completelyBlockedDomains,
      statistics.globalView.domains,
      statistics.globalView.partiallyBlockedDomains,
    ]
  );

  return <InsightsStats stats={stats} matrixData={matrixData} />;
};

export default SessionInsights;
