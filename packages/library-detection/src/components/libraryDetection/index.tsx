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
import React, { useState, memo, useEffect, useCallback } from 'react';
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
  const [libraryCount, setLibraryCount] = useState(0);
  const { libraryMatches } = useLibraryDetection();

  useEffect(() => {
    const names = Object.keys(libraryMatches);

    if (!names.length) {
      return;
    }

    const detectedLibraryNames = names.filter(
      (name) => libraryMatches[name]?.matches?.length
    );

    setLibraryCount(detectedLibraryNames.length);
  }, [libraryMatches]);

  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(libraryCount),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  const onTabUpdate = useCallback(
    (
      changingTabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) => {
      const currentTabId = tabId;

      if (
        changeInfo.status === 'complete' &&
        tab.active &&
        changingTabId === currentTabId
      ) {
        setLibraryCount(0);
      }
    },
    [tabId]
  );

  useEffect(() => {
    chrome.tabs.onUpdated.addListener(onTabUpdate);

    return () => {
      chrome.tabs.onUpdated.removeListener(onTabUpdate);
    };
  }, [onTabUpdate]);

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      {libraryCount > 0 ? (
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
        <DynamicPlaceholder />
      )}
    </CookiesLandingContainer>
  );
});

export default LibraryDetection;
