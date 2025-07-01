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
import React, { ReactNode } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import SupportLink from './supportLink';
import QuickLinksList from './quickLinksList';
import { PSInfoKeyType } from './infoCard/fetchPSInfo';
import InfoCard from './infoCard';
import Breadcrumbs from '../breadcrumbs';
import { useSidebar } from '../sidebar';
import Tabs from '../tabs';

export interface LandingPageProps {
  title?: string;
  hideTitle?: boolean;
  children?: ReactNode;
  psInfoKey?: PSInfoKeyType;
  contentPanel?: ReactNode;
  containerStyles?: string;
  showQuickLinks?: boolean;
  showSupportLink?: boolean;
  isLandingPageContainer?: boolean;
  extraClasses?: string;
}

const LandingPage = ({
  title,
  hideTitle,
  psInfoKey,
  children,
  containerStyles = '',
  contentPanel,
  showQuickLinks = true,
  showSupportLink = false,
  isLandingPageContainer = false,
  extraClasses = '',
}: LandingPageProps) => {
  const { extractSelectedItemKeyTitles } = useSidebar(({ actions }) => ({
    extractSelectedItemKeyTitles: actions.extractSelectedItemKeyTitles,
  }));

  return (
    <div
      className={`w-full h-full flex flex-col divide-y divide-hex-gray dark:divide-quartz overflow-hidden ${containerStyles}`}
    >
      {!hideTitle && (
        <div className="flex justify-between">
          <div>
            <div className="p-4 flex flex-col gap-1">
              <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
                {title && <h1 className="text-left">{title}</h1>}
              </div>
              <Breadcrumbs items={extractSelectedItemKeyTitles()} />
            </div>
            <Tabs showBottomBorder={false} />
          </div>
          <div className="p-4 flex items-center">
            {showSupportLink && <SupportLink />}
          </div>
        </div>
      )}

      <div className="flex-1 w-full overflow-auto divide-y divide-hex-gray dark:divide-quartz flex flex-col">
        <div
          className={classNames(
            'flex flex-col gap-6 divide-y divide-american-silver dark:divide-quartz flex-1',
            {
              'border-b border-american-silver dark:border-quartz': children,
            },
            extraClasses
          )}
        >
          {psInfoKey && <InfoCard infoKey={psInfoKey} />}
          {contentPanel && <>{contentPanel}</>}
        </div>

        {children && (
          <div
            id="#__psat-main-content"
            className={classNames(
              'flex flex-col gap-6 divide-y divide-american-silver dark:divide-quartz',
              extraClasses
            )}
          >
            {children}
          </div>
        )}

        {isLandingPageContainer && showQuickLinks && <QuickLinksList />}
      </div>
    </div>
  );
};

export default LandingPage;
