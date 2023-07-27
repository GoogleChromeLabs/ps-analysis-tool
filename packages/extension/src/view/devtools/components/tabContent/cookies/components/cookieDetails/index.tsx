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
import { useContentPanelStore } from '../../../../../stateProviders/contentPanelStore';

const CookieDetails = () => {
  const { selectedCookie } = useContentPanelStore(({ state }) => ({
    selectedCookie: state.selectedCookie,
  }));

  return (
    <div data-testid="cookie-card">
      {selectedCookie ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-base font-bold text-gray-800">Cookie Value :</p>
          <p className="text-sm text-gray-700 mb-4 break-words">
            {selectedCookie.parsedCookie.value}
          </p>
          <p className="text-base font-bold text-gray-800">Description :</p>
          <p className="text-sm text-gray-600">
            {selectedCookie.analytics?.description ||
              'No description available.'}
          </p>
        </div>
      ) : (
        <div className="h-full flex justify-center items-center">
          <p className="text-3xl font-bold text-gray-700">
            Select a cookie to preview its details
          </p>
        </div>
      )}
    </div>
  );
};

export default CookieDetails;
