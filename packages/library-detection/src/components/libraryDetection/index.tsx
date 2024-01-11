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
  CookiesLandingContainer,
  COLOR_MAP,
} from '@ps-analysis-tool/design-system';

const LibraryDetection = () => {
  const dataMapping = [
    {
      title: 'Known Breakages',
      count: 2,
      data: [{ count: 1, color: COLOR_MAP.uncategorized.color }],
    },
  ];

  return (
    <CookiesLandingContainer
      dataMapping={dataMapping}
      testId="library-detection"
    >
      <div>
        <h1>Library Detection</h1>
        <p>This is a placeholder for the Library Detection page.</p>
      </div>
    </CookiesLandingContainer>
  );
};

export default LibraryDetection;
