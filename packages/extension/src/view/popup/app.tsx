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
  CirclePieChart,
  ProgressBar,
  ToastMessage,
  prepareCookieStatsComponents,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import './app.css';
import { Legend, CookieLanding } from './components';
import { useCookie, useSettings } from './stateProviders';
import { ALLOWED_NUMBER_OF_TABS } from '../../constants';

const App: React.FC = () => {
  const {
    cookieStats,
    loading,
    isCurrentTabBeingListenedTo,
    onChromeUrl,
    changeListeningToThisTab,
  } = useCookie(({ state, actions }) => ({
    cookieStats: state.tabCookieStats,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    loading: state.loading,
    returningToSingleTab: state.returningToSingleTab,
    onChromeUrl: state.onChromeUrl,
    changeListeningToThisTab: actions.changeListeningToThisTab,
  }));

  const { allowedNumberOfTabs, settingsChanged, handleSettingsChange } =
    useSettings(({ state, actions }) => ({
      allowedNumberOfTabs: state.allowedNumberOfTabs,
      settingsChanged: state.settingsChanged,
      handleSettingsChange: actions.handleSettingsChange,
    }));

  if (onChromeUrl) {
    return (
      <CookieLanding>
        <p className="font-bold text-lg mb-2">Not much to analyze here</p>
        <p className="text-chart-label text-xs">
          Its emptier than a cookie jar after a midnight snack!
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text="Settings changed, please reload all tabs."
              onClick={handleSettingsChange}
              textAdditionalStyles="xxs:p-1 text-xxs leading-5"
            />
          )}
        </div>
      </CookieLanding>
    );
  }

  if (
    loading ||
    (loading &&
      isCurrentTabBeingListenedTo &&
      allowedNumberOfTabs &&
      allowedNumberOfTabs === 'single')
  ) {
    return <ProgressBar additionalStyles="w-96 min-h-[20rem]" />;
  }

  if (
    ALLOWED_NUMBER_OF_TABS > 0 &&
    !isCurrentTabBeingListenedTo &&
    allowedNumberOfTabs &&
    allowedNumberOfTabs !== 'unlimited'
  ) {
    return (
      <CookieLanding>
        <Button onClick={changeListeningToThisTab} text="Analyze this tab" />
        <div className="absolute right-0 bottom-0 w-full">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text="Settings changed, please reload all tabs."
              onClick={handleSettingsChange}
              textAdditionalStyles="xxs:p-1 text-xxs leading-5"
            />
          )}
        </div>
      </CookieLanding>
    );
  }

  if (
    !cookieStats ||
    (cookieStats?.firstParty.total === 0 && cookieStats?.thirdParty.total === 0)
  ) {
    return (
      <CookieLanding>
        <p className="font-bold text-lg">No cookies found on this page</p>
        <p className="text-chart-label text-xs">
          Please try reloading the page
        </p>
        <div className="absolute right-0 bottom-0 w-full">
          {settingsChanged && (
            <ToastMessage
              additionalStyles="text-sm"
              text="Settings changed, please reload all tabs."
              onClick={handleSettingsChange}
              textAdditionalStyles="xxs:p-1 text-xxs leading-5"
            />
          )}
        </div>
      </CookieLanding>
    );
  }
  const statsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <CookieLanding>
      <div className="w-full flex gap-x-6 justify-center border-b border-hex-gray pb-3.5">
        <div className="w-32 text-center">
          <CirclePieChart
            centerCount={cookieStats.firstParty.total}
            data={statsComponents.firstParty}
            title="1st Party Cookies"
          />
        </div>
        <div className="w-32 text-center">
          <CirclePieChart
            centerCount={cookieStats.thirdParty.total}
            data={statsComponents.thirdParty}
            title="3rd Party Cookies"
          />
        </div>
      </div>
      <div className="w-full mb-4">
        <Legend legendItemList={statsComponents.legend} />
      </div>
      <div className="w-full text-center">
        <p className="text-chart-label text-xs">
          {'Inspect cookies in the "Privacy Sandbox" panel of DevTools'}
        </p>
      </div>
      <div className="absolute right-0 bottom-0 w-full">
        {settingsChanged && (
          <ToastMessage
            additionalStyles="text-sm"
            text="Settings changed, please reload all tabs."
            onClick={handleSettingsChange}
            textAdditionalStyles="xxs:p-1 text-xxs leading-5"
          />
        )}
      </div>
    </CookieLanding>
  );
};

export default App;
