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
import { type DataMapping } from '@google-psat/common';
/**
 * Internal dependencies.
 */
import LandingHeader from './landingHeader';
import { InfoIcon } from '../../icons';

export interface CookiesLandingWrapperProps {
  dataMapping?: DataMapping[];
  infoIconTitle?: string | React.ReactNode;
  showLandingHeader?: boolean;
  testId?: string | null;
  children?: React.ReactNode;
  description?: React.ReactNode;
  landingHeaderExtraClasses?: string;
}

const CookiesLandingWrapper = ({
  dataMapping = [],
  infoIconTitle = '',
  showLandingHeader = true,
  testId = 'cookie-landing-insights',
  description = '',
  children,
  landingHeaderExtraClasses = '',
}: CookiesLandingWrapperProps) => {
  return (
    <div className="w-full flex flex-col min-w-[40rem]">
      <div className="w-full min-w-[40rem]" data-testid={testId}>
        <div className="pb-5">
          {showLandingHeader && (
            <LandingHeader
              dataMapping={dataMapping}
              extraClasses={landingHeaderExtraClasses}
            />
          )}
          {Boolean(infoIconTitle) && (
            <div className="px-4 pt-2 mx-auto leading-5 flex gap-1 justify-center items-center max-w-2xl">
              <div>
                <InfoIcon className="w-3 h-3 fill-granite-gray" />
              </div>
              <p
                className="text-xxxs text-center text-gray dark:text-bright-gray"
                style={{ whiteSpace: 'pre-line' }}
              >
                {infoIconTitle}
              </p>
            </div>
          )}
        </div>
        {description && (
          <div className="text-center px-4 flex items-center justify-center -mt-2 mb-10">
            <p className="lg:max-w-[450px] text-gray dark:text-bright-gray">
              {description}
            </p>
          </div>
        )}
        <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-2 pb-10 px-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CookiesLandingWrapper;
