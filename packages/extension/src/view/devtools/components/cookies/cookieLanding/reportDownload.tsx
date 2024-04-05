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
 * External dependencies.
 */
import React from 'react';
import { Button } from '@ps-analysis-tool/design-system';
import { useLibraryDetectionContext } from '@ps-analysis-tool/library-detection';
/**
 * Internal dependencies.
 */
import downloadReport from '../../../../../utils/downloadReport';
import { useCookie } from '../../../stateProviders';

const ReportDownloadButton = () => {
  const { url, tabCookies, tabFrames } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    url: state.tabUrl,
  }));

  const { libraryMatches, showLoader } = useLibraryDetectionContext(
    ({ state }) => ({
      libraryMatches: state.libraryMatches,
      showLoader: state.showLoader,
    })
  );

  return (
    <Button
      disabled={showLoader}
      title={showLoader ? 'Wait for library detection' : ''}
      extraClasses="absolute top-3 right-6"
      onClick={() => {
        if (tabCookies && tabFrames && libraryMatches && url) {
          downloadReport(url, tabCookies, tabFrames, libraryMatches);
        }
      }}
      text="Download report"
    />
  );
};

export default ReportDownloadButton;
