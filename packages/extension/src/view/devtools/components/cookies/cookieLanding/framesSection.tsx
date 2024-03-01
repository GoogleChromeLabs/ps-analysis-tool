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
import React, { useMemo } from 'react';
import {
  CookiesLandingWrapper,
  MatrixContainer,
  prepareFrameStatsComponent,
  type MatrixComponentProps,
  LEGEND_DESCRIPTION,
} from '@ps-analysis-tool/design-system';
import {
  ORPHANED_COOKIE_KEY,
  UNMAPPED_COOKIE_KEY,
} from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';

const FramesSection = () => {
  const { tabCookies, tabFrames, frameHasCookies } = useCookieStore(
    ({ state }) => ({
      tabCookies: state.tabCookies,
      tabFrames: state.tabFrames,
      frameHasCookies: state.frameHasCookies,
    })
  );

  const processedTabFrames = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tabFrames || {}).filter(([url]) => {
          if (url === ORPHANED_COOKIE_KEY || url === UNMAPPED_COOKIE_KEY) {
            return frameHasCookies[url];
          }

          return true;
        })
      ),
    [tabFrames, frameHasCookies]
  );

  const framesStats = prepareFrameStatsComponent(
    processedTabFrames,
    tabCookies
  );
  const dataComponents: MatrixComponentProps[] = framesStats.legend.map(
    (component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: legendDescription,
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
        title="Frames"
        matrixData={dataComponents}
        infoIconTitle="The details regarding frames and associated cookies in this page."
      />
    </CookiesLandingWrapper>
  );
};
export default FramesSection;
