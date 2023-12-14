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
import LandingHeader, { type DataMapping } from './landingHeader';

interface CookiesLandingContainerProps {
  dataMapping?: DataMapping[];
  showLandingHeader?: boolean;
  testId?: string | null;
  children?: React.ReactNode;
}

const CookiesLandingContainer = ({
  dataMapping = [],
  showLandingHeader = true,
  testId = 'cookie-landing-insights',
  children,
}: CookiesLandingContainerProps) => {
  return (
    <div className="w-full flex flex-col min-w-[40rem]">
      <div className="w-full min-w-[40rem]" data-testid={testId}>
        {showLandingHeader && <LandingHeader dataMapping={dataMapping} />}
        <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-2 pb-10 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CookiesLandingContainer;
