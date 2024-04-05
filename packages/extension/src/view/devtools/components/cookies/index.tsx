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
import {
  Button,
  CookiesLanding,
  ProgressBar,
} from '@ps-analysis-tool/design-system';
import { type CookieTableData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { useCookie, useSettings } from '../../stateProviders';
import CookiesListing from './cookiesListing';
import AssembledCookiesLanding from './cookieLanding';

interface CookiesProps {
  setFilteredCookies: React.Dispatch<CookieTableData[]>;
}

// eslint-disable-next-line complexity
const Cookies = ({ setFilteredCookies }: CookiesProps) => {
  const {
    isCurrentTabBeingListenedTo,
    loading,
    selectedFrame,
    tabToRead,
    changeListeningToThisTab,
  } = useCookie(({ state, actions }) => ({
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    loading: state.loading,
    selectedFrame: state.selectedFrame,
    tabToRead: state.tabToRead,
    changeListeningToThisTab: actions.changeListeningToThisTab,
  }));

  const { allowedNumberOfTabs } = useSettings(({ state }) => ({
    allowedNumberOfTabs: state.allowedNumberOfTabs,
  }));

  if (
    loading ||
    (loading &&
      tabToRead &&
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
    (tabToRead &&
      isCurrentTabBeingListenedTo &&
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
          <CookiesLanding>
            <AssembledCookiesLanding />
          </CookiesLanding>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-white dark:bg-raisin-black">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Button onClick={changeListeningToThisTab} text="Analyze this tab" />
      </div>
    </div>
  );
};

export default Cookies;
