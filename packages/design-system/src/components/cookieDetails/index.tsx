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
import type { CookieTableData } from '@ps-analysis-tool/common';
import Details from './details';

interface CookieDetailsProps {
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
}

const CookieDetails = ({ selectedFrameCookie }: CookieDetailsProps) => {
  const selectedCookie = Object.values(selectedFrameCookie ?? {})[0];

  return (
    <div
      data-testid="cookie-card"
      className="flex-1 border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] overflow-y-auto"
    >
      {selectedCookie ? (
        <Details selectedCookie={selectedCookie} />
      ) : (
        <div className="h-full p-8 flex items-center">
          <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
            Select cookies to preview its value
          </p>
        </div>
      )}
    </div>
  );
};

export default CookieDetails;
