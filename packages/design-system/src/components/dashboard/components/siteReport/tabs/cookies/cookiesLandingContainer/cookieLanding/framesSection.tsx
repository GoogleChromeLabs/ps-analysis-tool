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
 * External dependencies
 */
import React from 'react';
import { getLegendDescription } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import { type MatrixComponentProps } from '../../../../../../../matrix/matrixComponent';
import CookiesLandingWrapper from '../../../../../../../cookiesLanding/cookiesLandingWrapper';
import MatrixContainer from '../../../../../../../matrixContainer';
import { LEGEND_DESCRIPTION } from '../../../../../../../../constants';
import { prepareFrameStatsComponentForExtensionDashboard } from '../../../../../../../../utils';

const FramesSection = () => {
  const framesStats = prepareFrameStatsComponentForExtensionDashboard(
    //@ts-ignore
    globalThis?.PSAT_DATA.json[0] || {}
  );

  const dataComponents: MatrixComponentProps[] = framesStats.legend.map(
    (component) => {
      const legendDescription =
        LEGEND_DESCRIPTION[component.descriptionKey] || '';
      return {
        ...component,
        description: getLegendDescription(legendDescription),
        title: component.label,
        containerClasses: '',
      };
    }
  );

  return (
    <CookiesLandingWrapper
      dataMapping={framesStats.dataMapping}
      testId="frames-insights"
    >
      <MatrixContainer
        title={I18n.getMessage('frames')}
        matrixData={dataComponents}
        infoIconTitle={I18n.getMessage('framesNote')}
      />
    </CookiesLandingWrapper>
  );
};
export default FramesSection;
