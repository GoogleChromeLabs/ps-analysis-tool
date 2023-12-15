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
import { useCookieStore } from '../../stateProviders/syncCookieStore';
import CookiesListing from './cookiesListing';
import {
  Button,
  CookiesLanding,
  ProgressBar,
} from '@ps-analysis-tool/design-system';
import type { CookieTableData } from '@ps-analysis-tool/common';

interface CookiesProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

const Cookies = ({ setFilteredCookies }: CookiesProps) => {
  const {
    allowedNumberOfTabs,
    contextInvalidated,
    isCurrentTabBeingListenedTo,
    loading,
    returningToSingleTab,
    selectedFrame,
    tabCookies,
    tabFrames,
    changeListeningToThisTab,
  } = useCookieStore(({ state, actions }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
    contextInvalidated: state.contextInvalidated,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    loading: state.loading,
    returningToSingleTab: state.returningToSingleTab,
    selectedFrame: state.selectedFrame,
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
    changeListeningToThisTab: actions.changeListeningToThisTab,
  }));

  if (
    loading ||
    (loading &&
      isCurrentTabBeingListenedTo &&
      allowedNumberOfTabs &&
      allowedNumberOfTabs === 'single')
  ) {
    return (
      <div className="w-full h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-raisin-black">
        <ProgressBar additionalStyles="w-full" />
      </div>
    );
  }

  if (
    (isCurrentTabBeingListenedTo &&
      allowedNumberOfTabs &&
      allowedNumberOfTabs === 'single') ||
    (allowedNumberOfTabs && allowedNumberOfTabs === 'unlimited')
  ) {
    return (
      <div
        className={`h-full ${selectedFrame ? '' : 'flex items-center'}`}
        data-testid="cookies-content"
      >
        {selectedFrame ? (
          <CookiesListing setFilteredCookies={setFilteredCookies} />
        ) : (
          <CookiesLanding
            tabCookies={tabCookies}
            tabFrames={tabFrames}
            showBlockedCookiesSection
          />
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black">
      <div className="w-full h-full flex flex-col items-center justify-center">
        {!returningToSingleTab && !contextInvalidated && (
          <p className="dark:text-bright-gray text-chart-label text-base mb-5 text-center">
            This tool works best with a single tab for cookie analysis.
          </p>
        )}
        <Button onClick={changeListeningToThisTab} text="Analyze this tab" />
      </div>
    </div>
  );
};

export default Cookies;
