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
import React, { ReactNode, useState } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import ProgressBar from '../progressBar';
import SupportLink from './supportLink';
import QuickLinksList from './quickLinksList';
import { PSInfoKeyType } from './infoCard/fetchPSInfo';
import InfoCard from './infoCard';
import Breadcrumbs from '../breadcrumbs';
import { useSidebar } from '../sidebar';

export interface LandingPageProps {
  title?: string;
  hideTitle?: boolean;
  children?: ReactNode;
  psInfoKey?: PSInfoKeyType;
  iframeSrc?: string;
  contentPanel?: ReactNode;
  containerStyles?: string;
  iframeBorderClass?: string;
  extraClasses?: string;
  showQuickLinks?: boolean;
  showSupportLink?: boolean;
  hasTabs?: boolean;
  isLandingPageContainer?: boolean;
}

const LandingPage = ({
  title,
  hideTitle,
  psInfoKey,
  iframeSrc,
  iframeBorderClass,
  children,
  extraClasses,
  containerStyles = '',
  contentPanel,
  showQuickLinks = true,
  showSupportLink = false,
  hasTabs = false,
  isLandingPageContainer = false,
}: LandingPageProps) => {
  const [loading, setLoading] = useState(iframeSrc ? true : false);
  const { extractSelectedItemKeyTitles } = useSidebar(({ actions }) => ({
    extractSelectedItemKeyTitles: actions.extractSelectedItemKeyTitles,
  }));

  return (
    <div className={`w-full h-full ${containerStyles}`}>
      {loading && <ProgressBar additionalStyles="w-1/3 mx-auto h-full" />}
      <div
        className={classNames(
          { hidden: loading },
          'w-full h-full flex flex-col',
          { 'divide-y divide-hex-gray dark:divide-quartz ': !hasTabs }
        )}
      >
        {!hideTitle && (
          <div className="flex justify-between">
            <div className="p-4 flex flex-col gap-1">
              <div className="flex gap-2 text-2xl font-bold items-baseline text-raisin-black dark:text-bright-gray">
                {title && <h1 className="text-left">{title}</h1>}
              </div>
              <Breadcrumbs items={extractSelectedItemKeyTitles()} />
            </div>
            <div className="p-4 flex items-center">
              {showSupportLink && <SupportLink />}
            </div>
          </div>
        )}
        <div className={'flex-1'}>
          <div
            className={classNames(
              'h-full w-full flex flex-col gap-6 divide-y divide-american-silver dark:divide-quartz py-2',
              {
                'border-b border-american-silver dark:border-quartz': children,
              },
              {
                'px-4 py-6': !hasTabs,
              },
              extraClasses
            )}
          >
            {iframeSrc && (
              <iframe
                src={iframeSrc}
                height="100%"
                onLoad={() => {
                  setLoading(false);
                }}
                className={classNames(
                  'w-full md:w-[95%] md:m-auto rounded-xl',
                  iframeBorderClass
                )}
              />
            )}
            {psInfoKey && <InfoCard infoKey={psInfoKey} />}
            {contentPanel && <>{contentPanel}</>}
          </div>

          {children && (
            <div
              id="#__psat-main-content"
              className={classNames(
                'flex flex-col gap-6 divide-y divide-american-silver dark:divide-quartz px-4 py-6',
                extraClasses
              )}
            >
              {children}
            </div>
          )}
        </div>
        {isLandingPageContainer && showQuickLinks && <QuickLinksList />}
      </div>
    </div>
  );
};

export default LandingPage;
