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
import {
  COLOR_MAP,
  CookiesLandingWrapper,
} from '@ps-analysis-tool/design-system';
import { KNOWN_BREAKAGES } from '@ps-analysis-tool/library-detection';

interface KnownBreakagesSectionProps {
  libraryDetectionData: string[];
}

const KnownBreakagesSection = ({
  libraryDetectionData,
}: KnownBreakagesSectionProps) => {
  const dataMapping = [
    {
      title: 'Known Breakages',
      count: Number(libraryDetectionData.length),
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  return (
    <CookiesLandingWrapper
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      <div className="divide-y divide-hex-gray">
        {libraryDetectionData.map((knownBreakage) => {
          const Component = KNOWN_BREAKAGES[knownBreakage];
          return (
            <div className="text-xs" key={knownBreakage}>
              <Component />
            </div>
          );
        })}
      </div>
    </CookiesLandingWrapper>
  );
};

export default KnownBreakagesSection;
