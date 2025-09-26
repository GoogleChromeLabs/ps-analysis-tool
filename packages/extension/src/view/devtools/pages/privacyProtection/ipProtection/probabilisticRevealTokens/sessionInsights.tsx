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
import { useProbabilisticRevealTokens } from '../../../../stateProviders';
import InsightsStats from '../../mdlCommon/insightsStats';

const SessionInsights = () => {
  const { statistics } = useProbabilisticRevealTokens(({ state }) => ({
    statistics: state.statistics,
  }));

  const stats = [
    {
      title: 'Domains',
      centerCount: statistics.globalView.domains,
      color: '#F3AE4E',
      description: 'Total unique domains in browsing session',
      countClassName: 'text-emerald',
    },
    {
      title: 'MDL',
      centerCount: statistics.globalView.mdl,
      color: '#4C79F4',
      description: 'Browsing session domains in MDL',
      countClassName: 'text-emerald',
    },
    {
      title: 'PRT',
      centerCount: statistics.globalView.totalTokens,
      color: '#EC7159',
      description: 'Total unique tokens sent in requests',
      countClassName: 'text-emerald',
    },
    {
      title: 'Signals',
      centerCount: statistics.globalView.nonZeroSignal,
      color: '#5CC971',
      description: 'Total PRTs that decode to IP address',
      countClassName: 'text-emerald',
    },
  ];

  return <InsightsStats stats={stats} />;
};

export default SessionInsights;
