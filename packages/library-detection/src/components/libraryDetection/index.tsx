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
  CookiesLandingContainer,
  COLOR_MAP,
  ProgressBar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import LIBRARIES from '../../config';
import type { LibraryData, DetectedSignature } from '../../types';
import {
  filterMatchesBasedOnExceptions,
  useLibraryDetection,
  useLibraryDetectionContext,
} from '../../core';
import { extractUrl } from '@ps-analysis-tool/common';

const LibraryDetection = memo(function LibraryDetection() {
  useLibraryDetection();

  const { libraryMatches, showLoader, tabDomain } = useLibraryDetectionContext(
    ({ state }) => ({
      libraryMatches: state.libraryMatches,
      showLoader: state.showLoader,
      tabDomain: state.tabDomain,
    })
  );

  const names = Object.keys(libraryMatches);

  const detectedLibraryNames = names.filter(
    (name) => libraryMatches[name as keyof LibraryData]?.matches?.length
  );

  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(detectedLibraryNames.length),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  const result =
    detectedLibraryNames.length > 0 ? (
      <>
        {LIBRARIES.map((config) => {
          const Component = config.component as React.FC<{
            matches: DetectedSignature[];
          }>;
          let matches =
            libraryMatches && libraryMatches[config.name as keyof LibraryData]
              ? libraryMatches[config.name as keyof LibraryData]?.matches
              : [];

          const parsedUrl = extractUrl(tabDomain);

          const parsedTabDomain = parsedUrl?.domain;

          const isCurrentDomainExceptionDomain =
            config?.exceptions?.[parsedTabDomain as string] &&
            config?.exceptions?.[parsedTabDomain as string]?.signatures
              ?.length > 0;

          if (isCurrentDomainExceptionDomain) {
            matches = filterMatchesBasedOnExceptions(
              tabDomain,
              config?.exceptions, //TODO: revist this after testing
              matches
            );
          }

          return <Component key={config.name} matches={matches} />;
        })}
      </>
    ) : (
      <p className="text-center dark:text-bright-gray">
        No libraries with known breakages found yet!
      </p>
    );

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      {showLoader ? (
        <>
          <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />
          <p className="text-center dark:text-bright-gray">
            Checking libraries for any known breakages on the page..
          </p>
        </>
      ) : (
        result
      )}
    </CookiesLandingContainer>
  );
});

export default LibraryDetection;
