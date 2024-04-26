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
import {
  CookiesLandingWrapper,
  MatrixContainer,
  prepareFrameStatsComponent,
  type MatrixComponentProps,
  LEGEND_DESCRIPTION,
} from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';
/**
 * Internal dependencies
 */
import { useCookie } from '../../../stateProviders';

const FramesSection = () => {
  const { tabCookies, tabFrames } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
  }));

  const framesStats = prepareFrameStatsComponent(tabFrames, tabCookies);
  const dataComponents: MatrixComponentProps[] = framesStats.legend.map(
    (component) => {
      const legendDescription =
        LEGEND_DESCRIPTION[component.descriptionKey] || '';
      return {
        ...component,
        description:
          typeof legendDescription === 'string'
            ? I18n.getMessage(legendDescription)
            : I18n.getFormattedMessages(legendDescription),
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
