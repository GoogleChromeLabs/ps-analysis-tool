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

/**
 * Internal dependencies.
 */
import type { CookieTableData } from '@cookie-analysis-tool/common';
import { CookieTable } from '@cookie-analysis-tool/design-system';

interface CookieTableContainerProps {
  cookies: CookieTableData[];
  selectedFrame: string | null;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
  setSelectedFrameCookie: (
    cookie: {
      [frame: string]: CookieTableData | null;
    } | null
  ) => void;
}

const CookieTableContainer = ({
  cookies,
  selectedFrame,
  selectedFrameCookie,
  setSelectedFrameCookie,
}: CookieTableContainerProps) => {
  return (
    <CookieTable
      tableColumns={[]}
      data={cookies}
      selectedFrame={selectedFrame}
      selectedFrameCookie={selectedFrameCookie}
      setSelectedFrameCookie={setSelectedFrameCookie}
    />
  );
};

export default CookieTableContainer;
