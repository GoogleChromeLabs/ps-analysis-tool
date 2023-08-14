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
import { CirclePieChart } from '../design-system/components';
import { prepareCookieStatsComponents } from '../../utils/prepareCookieStatsComponents';

const App: React.FC = () => {
  const { cookieStats } = useCookieStore(({ state }) => ({
    cookieStats: state.tabCookieStats,
  }));

  if (!cookieStats) {
    return (
      <div className="w-96 h-fit p-5 flex justify-center items-center flex-col">
        <p className="font-bold text-lg">
          Please refresh this page to view cookies
        </p>
      </div>
    );
  }

  if (
    cookieStats.firstParty.total === 0 &&
    cookieStats.thirdParty.total === 0
  ) {
    return (
      <div className="w-96 h-fit p-5 flex justify-center items-center flex-col">
        <p className="font-bold text-lg">No cookies found on this page</p>
      </div>
    );
  }

  const statsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="w-96 h-fit p-5 flex justify-center items-center flex-col">
      <div className="w-full flex gap-x-6 justify-center">
        <div className="w-28 text-center">
          <CirclePieChart
            centerCount={cookieStats.firstParty.total}
            data={statsComponents.firstParty}
            title="1st Party Cookies"
          />
        </div>
        <div className="w-28 text-center">
          <CirclePieChart
            centerCount={cookieStats.thirdParty.total}
            data={statsComponents.thirdParty}
            title="3rd Party Cookies"
          />
        </div>
      </div>
      <div className="w-full mt-8 mb-5">
        <Legend legendItemList={statsComponents.legend} />
      </div>
      <div className="w-full text-center mt-2">
        <p className="text-chart-label text-xs">
          {'Inspect cookies in the "Privacy Sandbox" panel of DevTools'}
        </p>
      </div>
    </div>
  );
};

export default App;
