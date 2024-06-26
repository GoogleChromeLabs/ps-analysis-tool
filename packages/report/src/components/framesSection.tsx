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
  LEGEND_DESCRIPTION,
  MatrixContainer,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { getLegendDescription } from '@google-psat/common';
/**
 * Internal dependencies
 */
import { useData } from '../stateProviders/data';

const CookiesSection = () => {
  const data = useData(({ state }) => state.data);

  if (!data) {
    return null;
  }

  const _data = data.frameStateCreator.legend.map((component) => {
    const legendDescription =
      LEGEND_DESCRIPTION[component.descriptionKey || ''];

    return {
      ...component,
      description: getLegendDescription(legendDescription),
      title: component.label,
      containerClasses: '',
    };
  });

  return (
    <CookiesLandingWrapper
      dataMapping={data.frameStateCreator.dataMapping}
      testId="frames-insights"
    >
      <MatrixContainer
        title={I18n.getMessage('frames')}
        matrixData={_data}
        infoIconTitle={I18n.getMessage('framesNote')}
      />
    </CookiesLandingWrapper>
  );
};

export default CookiesSection;
