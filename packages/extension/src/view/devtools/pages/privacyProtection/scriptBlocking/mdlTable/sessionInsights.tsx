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
      tooltipText: 'Total browsing session domains',
    },
    {
      title: 'BDL',
      centerCount:
        statistics.globalView.partiallyBlockedDomains +
        statistics.globalView.completelyBlockedDomains,
      color: '#7D8471',
      tooltipText: 'Total domains in block list',
    },
    {
      title: 'Blockings',
      centerCount:
        statistics.globalView.partiallyBlockedDomains +
        statistics.globalView.completelyBlockedDomains,
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
      tooltipText: 'Blocked domains',
    },
    {
      title: 'Complete',
      centerCount: statistics.globalView.completelyBlockedDomains,
      color: '#F3AE4E',
      tooltipText: 'Completely blocked domains',
    },
    {
      title: 'Partial',
      centerCount: statistics.globalView.partiallyBlockedDomains,
      color: '#4C79F4',
      tooltipText: 'Partially blocked domains',
    },
  ];

  return <InsightsStats stats={stats} />;
};

export default SessionInsights;
