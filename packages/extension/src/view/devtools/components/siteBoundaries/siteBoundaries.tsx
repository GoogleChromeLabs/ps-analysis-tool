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
 * External Dependencies
 */
import React, { useState } from 'react';

/**
 * Internal dependencies.
 */
import { LandingPage } from '@cookie-analysis-tool/design-system';

const SiteBoundaries = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <LandingPage title="Site Boundaries" isLoading={loading}>
        <div className="px-4 pt-6 pb-4 h-[82vh] w-full">
          <iframe
            src="https://privacysandbox.info/en/privacy-sandbox/strengthen-privacy-boundaries"
            height="100%"
            onLoad={() => {
              setLoading(false);
            }}
            className="w-full md:m-auto md:w-[70%]"
          />
        </div>
      </LandingPage>
    </>
  );
};

export default SiteBoundaries;
