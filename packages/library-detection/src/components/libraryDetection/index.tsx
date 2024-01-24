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
import React, { memo, useEffect } from 'react';
import {
  CookiesLandingContainer,
  COLOR_MAP,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import DynamicPlaceholder from './dynamicPlaceholder';
import LIBRARIES from '../../config';
import type { Config } from '../../types';
import { useLibraryDetection } from '../../core';

// eslint-disable-next-line react/display-name
const LibraryDetection = memo(function LibraryDetection({
  tabId,
}: {
  tabId: number;
}) {
  const { libraryMatches, libraryCount, setLibraryCount, isCurrentTabLoading } =
    useLibraryDetection(tabId);

  useEffect(() => {
    const names = Object.keys(libraryMatches);

    if (!names.length) {
      return;
    }

    const detectedLibraryNames = names.filter(
      (name) => libraryMatches[name]?.matches?.length
    );

    setLibraryCount(detectedLibraryNames.length);
  }, [libraryMatches, setLibraryCount]);

  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(libraryCount),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      {!isCurrentTabLoading && libraryCount > 0 ? (
        <>
          {LIBRARIES.map((config: Config) => {
            const Component = config.component as React.FC;
            const matches =
              libraryMatches && libraryMatches[config.name]
                ? libraryMatches[config.name]?.matches
                : [];

            return <Component key={config.name} matches={matches} />;
          })}
        </>
      ) : (
        <DynamicPlaceholder pageLoaded={!isCurrentTabLoading} />
      )}
    </CookiesLandingContainer>
  );
});

export default LibraryDetection;
