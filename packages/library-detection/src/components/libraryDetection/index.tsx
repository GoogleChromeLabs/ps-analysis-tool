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
import React, { memo } from 'react';
import {
  CookiesLandingWrapper,
  COLOR_MAP,
  ProgressBar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import { useLibraryDetection, useLibraryDetectionContext } from '../../core';
import LIBRARIES from '../../config';
import type { LibraryData, AccordionProps } from '../../types';
import { I18n } from '@ps-analysis-tool/i18n';

const LibraryDetection = memo(function LibraryDetection() {
  useLibraryDetection();

  const { libraryMatches, showLoader, isCurrentTabLoading, errorOccured } =
    useLibraryDetectionContext(({ state }) => ({
      libraryMatches: state.libraryMatches,
      errorOccured: state.errorOccured,
      showLoader: state.showLoader,
      isCurrentTabLoading: state.isCurrentTabLoading,
    }));

  const names = Object.keys(libraryMatches);

  const detectedLibraryNames = names.filter(
    (name) =>
      libraryMatches[name as keyof LibraryData]?.matches?.length ||
      libraryMatches[name as keyof LibraryData]?.domQuerymatches?.length
  );

  const dataMapping = [
    {
      title: I18n.getMessage('ldKnownBreakages'),
      count: Number(detectedLibraryNames.length),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  const result =
    !errorOccured && detectedLibraryNames.length > 0 ? (
      <>
        {LIBRARIES.map((library) => {
          const Component = library.component as React.FC<AccordionProps>;

          const matches =
            libraryMatches && libraryMatches[library.name as keyof LibraryData]
              ? libraryMatches[library.name as keyof LibraryData]?.matches
              : [];
          const domQueryMatches =
            libraryMatches && libraryMatches[library.name as keyof LibraryData]
              ? libraryMatches[library.name as keyof LibraryData]
                  ?.domQuerymatches
              : null;

          return (
            <Component
              key={library.name}
              matches={matches}
              domQueryMatches={domQueryMatches}
            />
          );
        })}
      </>
    ) : !errorOccured ? (
      <p className="text-center dark:text-bright-gray">
        {I18n.getMessage('ldNoLibraries')}
      </p>
    ) : (
      <p className="text-center dark:text-bright-gray">
        {I18n.getMessage('ldErrorOccured')}
      </p>
    );

  return (
    <CookiesLandingWrapper
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      {!errorOccured && showLoader ? (
        <>
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
          <p className="text-center dark:text-bright-gray">
            {isCurrentTabLoading
              ? I18n.getMessage('ldWaitingPageLoad')
              : I18n.getMessage('ldCheckingLibraries')}
          </p>
        </>
      ) : (
        result
      )}
    </CookiesLandingWrapper>
  );
});

export default LibraryDetection;
