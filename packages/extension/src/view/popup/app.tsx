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
import './app.css';
import { Legend } from './components';
import { useCookieStore } from './stateProviders/syncCookieStore';
import { Button, CirclePieChart } from '../design-system/components';
import { prepareCookieStatsComponents } from '../../utils/prepareCookieStatsComponents';
import ProgressBar from '../design-system/components/progressBar';
import { ALLOWED_NUMBER_OF_TABS } from '../../utils/constants';

const App: React.FC = () => {
  const {
    cookieStats,
    loading,
    isCurrentTabBeingListenedTo,
    returningToSingleTab,
    changeListeningToThisTab,
    onChromeUrl,
    allowedNumberOfTabs,
  } = useCookieStore(({ state, actions }) => ({
    cookieStats: state.tabCookieStats,
    isCurrentTabBeingListenedTo: state.isCurrentTabBeingListenedTo,
    loading: state.loading,
    returningToSingleTab: state.returningToSingleTab,
    changeListeningToThisTab: actions.changeListeningToThisTab,
    allowedNumberOfTabs: state.allowedNumberOfTabs,
    onChromeUrl: state.onChromeUrl,
  }));
  if (onChromeUrl) {
    return (
      <div className="w-96 min-h-[318px] h-fit p-5 flex justify-center items-center flex-col">
        <p className="font-bold text-lg">No url provided</p>
        <p className="text-chart-label text-xs">
          Cannot process cookies on empty tab.
        </p>
      </div>
    );
  }

  if (
    loading ||
    (loading &&
      isCurrentTabBeingListenedTo &&
      allowedNumberOfTabs &&
      allowedNumberOfTabs === 'single-tab')
  ) {
    return <ProgressBar additionalStyles="w-96 min-h-[20rem]" />;
  }

  if (
    ALLOWED_NUMBER_OF_TABS > 0 &&
    !isCurrentTabBeingListenedTo &&
    allowedNumberOfTabs &&
    allowedNumberOfTabs !== 'no-restriction'
  ) {
    return (
      <div className="w-96 min-h-[20rem] flex flex-col items-center justify-center">
        {!returningToSingleTab && (
          <p className="dark:text-bright-gray text-chart-label text-base mb-5">
            This tool works best with single tab.
          </p>
        )}
        <Button onClick={changeListeningToThisTab} text="Analyze this tab" />
      </div>
    );
  }

  if (
    !cookieStats ||
    (cookieStats?.firstParty.total === 0 && cookieStats?.thirdParty.total === 0)
  ) {
    return (
      <div className="w-96 min-h-[318px] h-fit p-5 flex justify-center items-center flex-col">
        <p className="font-bold text-lg">No cookies found on this page</p>
        <p className="text-chart-label text-xs">
          Please try reloading the page
        </p>
      </div>
    );
  }
  const statsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="w-96 min-h-[318px] h-fit p-5 flex justify-center items-center flex-col">
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
    </div>
  );
};

export default App;
