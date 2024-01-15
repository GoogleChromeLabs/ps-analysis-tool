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
import React, { useState, memo, useEffect } from 'react';
import {
  CookiesLandingContainer,
  COLOR_MAP,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import DynamicPlaceholder from './dynamicPlaceholder';
import LIBRARIES from '../../config';
import { Provider as LibraryDetectionProvider } from '../../stateProviders/librayDetectionContext';
import type { Config } from '../../types';
import useLibraryDetection from './useLibraryDetection';

// eslint-disable-next-line react/display-name
const LibraryDetection = memo(function LibraryDetection() {
  const [libraryCount, setLibraryCount] = useState(0);
  const { libraryMatches } = useLibraryDetection();

  console.log(libraryMatches, 'libraryMatches');

  useEffect(() => {
    const names = Object.keys(libraryMatches);

    if (!names.length) {
      return;
    }

    const detectedLibraryNames = names.filter((name) => {
      return libraryMatches[name]?.matches?.length;
    });

    setLibraryCount(detectedLibraryNames.length);
  }, [libraryMatches]);

  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(libraryCount),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  const description =
    libraryCount > 0
      ? 'Please review the following libraries or library features for known breakages.'
      : '';

  const configs: Config[] = LIBRARIES.map((config) => {
    const _config = { ...config, component: '' };

    return _config;
  });

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
      description={description}
    >
      {libraryCount > 0 ? (
        <LibraryDetectionProvider config={configs}>
          {LIBRARIES.map((config: Config) => {
            const Component = config.component as React.FC;
            const matches =
              libraryMatches && libraryMatches[config.name]
                ? libraryMatches[config.name]?.matches
                : [];

            return <Component key={config.name} matches={matches} />;
          })}
        </LibraryDetectionProvider>
      ) : (
        <DynamicPlaceholder />
      )}
    </CookiesLandingContainer>
  );
});

export default LibraryDetection;
