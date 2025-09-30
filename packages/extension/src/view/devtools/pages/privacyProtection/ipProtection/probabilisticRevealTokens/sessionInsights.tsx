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
import { useProbabilisticRevealTokens } from '../../../../stateProviders';
import InsightsStats from '../../mdlCommon/insightsStats';

const SessionInsights = () => {
  const { statistics } = useProbabilisticRevealTokens(({ state }) => ({
    statistics: state.statistics,
  }));

  const { stats, matrixData } = useMemo(
    () => ({
      stats: [
        {
          title: 'Domains',
          count: statistics.globalView.domains,
          color: '#F3AE4E',
          data: [
            {
              color: '#F3AE4E',
              count: statistics.globalView.domains,
            },
            {
              color: '#4C79F4',
              count: statistics.globalView.mdl,
            },
          ],
          countClassName: 'text-emerald',
        },
        {
          title: 'PRT',
          count: statistics.globalView.totalTokens,
          color: '#EC7159',
          data: [
            {
              color: '#EC7159',
              count: statistics.localView.totalTokens,
            },
            {
              color: '#5CC971',
              count: statistics.localView.nonZeroSignal,
            },
          ],
          countClassName: 'text-emerald',
        },
      ],
      matrixData: [
        {
          color: '#F3AE4E',
          title: 'Domains',
          count: statistics.globalView.domains,
          description: 'Unique domains',
          countClassName: 'text-emerald',
        },
        {
          color: '#4C79F4',
          title: 'MDL',
          count: statistics.globalView.mdl,
          description: 'Domains in the MDL',
          countClassName: 'text-indigo',
        },
        {
          color: '#EC7159',
          title: 'PRT',
          count: statistics.globalView.totalTokens,
          description: 'Unique PRT tokens sent in requests',
          countClassName: 'text-emerald',
        },
        {
          color: '#5CC971',
          title: 'Signals',
          count: statistics.globalView.nonZeroSignal,
          description: 'PRTs that decode to IP address',
          countClassName: 'text-emerald',
        },
      ],
    }),
    [statistics]
  );

  return <InsightsStats stats={stats} matrixData={matrixData} />;
};

export default SessionInsights;
