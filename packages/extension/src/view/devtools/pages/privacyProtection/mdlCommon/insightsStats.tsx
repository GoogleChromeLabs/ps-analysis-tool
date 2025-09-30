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
import {
  CookiesLandingWrapper,
  MatrixContainer,
  type MatrixComponentProps,
} from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import type { DataMapping } from '@google-psat/common';

interface InsightsStatsProps {
  stats: DataMapping[];
  matrixData: MatrixComponentProps[];
}

const InsightsStats = ({ stats, matrixData }: InsightsStatsProps) => {
  return (
    <CookiesLandingWrapper dataMapping={stats} testId="ip-insights">
      {matrixData.length > 0 && (
        <MatrixContainer
          title="Explanations"
          matrixData={matrixData}
          description="A session lasts until the browser or the extension closes."
        />
      )}
    </CookiesLandingWrapper>
  );
};

export default InsightsStats;
