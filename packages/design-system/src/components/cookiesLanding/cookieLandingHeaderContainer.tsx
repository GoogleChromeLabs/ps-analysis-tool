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
import LandingHeader, { type DataMapping } from './landingHeader';

export interface CookiesLandingContainerProps {
  dataMapping?: DataMapping[];
  showLandingHeader?: boolean;
  testId?: string | null;
  description?: string;
  children?: React.ReactNode;
}

const CookiesLandingContainer = ({
  dataMapping = [],
  showLandingHeader = true,
  testId = 'cookie-landing-insights',
  description,
  children,
}: CookiesLandingContainerProps) => {
  return (
    <div className="w-full flex flex-col min-w-[40rem]">
      <div className="w-full min-w-[40rem]" data-testid={testId}>
        {showLandingHeader && <LandingHeader dataMapping={dataMapping} />}
        {description && (
          <div className="text-center px-4 flex items-center justify-center -mt-2 mb-10">
            <p className="lg:max-w-[450px] text-gray">{description}</p>
          </div>
        )}
        <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-2 pb-10 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CookiesLandingContainer;
