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
/*
 * External dependencies
 */
import React from 'react';
import type { LibraryData } from '@ps-analysis-tool/common';
import {
  COLOR_MAP,
  CookiesLandingWrapper,
} from '@ps-analysis-tool/design-system';
import {
  Libraries,
  type AccordionProps,
} from '@ps-analysis-tool/library-detection';

interface KnownBreakagesProps {
  libraryMatches: LibraryData;
}

export const KnownBreakages = ({ libraryMatches }: KnownBreakagesProps) => {
  const names = Object.keys(libraryMatches);

  const detectedLibraryNames = names.filter(
    (name) =>
      libraryMatches[name as keyof LibraryData]?.matches?.length ||
      libraryMatches[name as keyof LibraryData]?.domQuerymatches?.length
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
        {Libraries.map((library) => {
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
    ) : (
      <p className="text-center dark:text-bright-gray">
        No libraries with known breakages found!
      </p>
    );

  return (
    <CookiesLandingWrapper
      dataMapping={dataMapping}
      testId="library-detection"
      description=""
    >
      <div className="divide-y divide-hex-gray">{result}</div>
    </CookiesLandingWrapper>
  );
};
