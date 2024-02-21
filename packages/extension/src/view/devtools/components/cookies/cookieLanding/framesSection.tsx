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
  CookiesLandingContainer,
  CookiesMatrix,
  prepareFrameStatsComponent,
} from '@ps-analysis-tool/design-system';
import { UNKNOWN_FRAME_KEY } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import { useCookie } from '../../../stateProviders';

const FramesSection = () => {
  const { tabCookies, tabFrames, frameHasCookies } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    frameHasCookies: state.frameHasCookies,
  }));
  const processedTabFrames = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(tabFrames || {}).filter(([url]) =>
          url === UNKNOWN_FRAME_KEY ? frameHasCookies[url] : true
        )
      ),
    [tabFrames, frameHasCookies]
  );

  const framesStats = prepareFrameStatsComponent(
    processedTabFrames,
    tabCookies
  );

  return (
    <CookiesLandingContainer
      dataMapping={framesStats.dataMapping}
      testId="frames-insights"
    >
      <CookiesMatrix
        title="Frames"
        componentData={framesStats.legend}
        showMatrix={true}
        tabCookies={tabCookies}
        tabFrames={tabFrames}
        showHorizontalMatrix={false}
        infoIconTitle="The details regarding frames and associated cookies in this page."
      />
    </CookiesLandingContainer>
  );
};
export default FramesSection;
