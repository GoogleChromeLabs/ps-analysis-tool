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
import type { CookieTableData } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Internal dependencies.
 */
import Details from './details';

interface CookieDetailsProps {
  isUsingCDP: boolean;
  selectedFrameCookie: {
    [frame: string]: CookieTableData | null;
  } | null;
}

const CookieDetails = ({
  selectedFrameCookie,
  isUsingCDP,
}: CookieDetailsProps) => {
  const selectedCookie = Object.values(selectedFrameCookie ?? {})[0];

  return (
    <div
      data-testid="cookie-card"
      className="flex-1 border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] overflow-y-auto"
    >
      {selectedCookie ? (
        <Details isUsingCDP={isUsingCDP} selectedCookie={selectedCookie} />
      ) : (
        <div className="h-full p-8 flex items-center">
          <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
            {I18n.getMessage('selectCookie')}
          </p>
        </div>
      )}
    </div>
  );
};

export default CookieDetails;
