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
import { Button, CookiesLanding } from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';
/**
 * Internal dependencies
 */
import { CookiesSection, BlockedCookiesSection } from './cookieLanding';

interface CookiesLandingContainerProps {
  tabFrames: TabFrames;
  tabCookies: TabCookies;
  affectedCookies: TabCookies;
  downloadReport?: () => void;
}

const CookiesLandingContainer = ({
  tabFrames,
  tabCookies,
  affectedCookies,
  downloadReport,
}: CookiesLandingContainerProps) => {
  return (
    <>
      {downloadReport && (
        <div className="absolute right-0 py-5 px-5">
          <Button
            extraClasses="w-fit text-sm flex justify-center items-center"
            text="Download Report"
            onClick={downloadReport}
          />
        </div>
      )}
      <CookiesLanding>
        <CookiesSection tabCookies={tabCookies} tabFrames={tabFrames} />
        <BlockedCookiesSection
          affectedCookies={affectedCookies}
          tabFrames={tabFrames}
        />
      </CookiesLanding>
    </>
  );
};

export default CookiesLandingContainer;
