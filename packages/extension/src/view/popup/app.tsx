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
import { PieChart, Legend } from './components';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import countCookiesByCategory from '../../utils/countCookiesByCategory';
import { colourMap } from './const';

const App: React.FC = () => {
  const { cookies, tabURL, message } = useCookieStore(({ state }) => ({
    cookies: state?.cookies,
    tabURL: state?.url,
    message: state.message,
  }));

  const cookieStats = countCookiesByCategory(cookies, tabURL || '');

  const legendData = [
    {
      label: 'Functional',
      count:
        cookieStats.firstParty.functional + cookieStats.thirdParty.functional,
      color: colourMap.funtional,
    },
    {
      label: 'Marketing',
      count:
        cookieStats.firstParty.marketing + cookieStats.thirdParty.marketing,
      color: colourMap.marketing,
    },
    {
      label: 'Analytics',
      count:
        cookieStats.firstParty.analytics + cookieStats.thirdParty.analytics,
      color: colourMap.analytics,
    },
    {
      label: 'Unknown',
      count: cookieStats.firstParty.unknown + cookieStats.thirdParty.unknown,
      color: colourMap.unknown,
    },
  ];

  const firstPartyPiechartData = [
    {
      count: cookieStats.firstParty.functional,
      color: colourMap.funtional,
    },
    {
      count: cookieStats.firstParty.marketing,
      color: colourMap.marketing,
    },
    {
      count: cookieStats.firstParty.analytics,
      color: colourMap.analytics,
    },
    {
      count: cookieStats.firstParty.unknown,
      color: colourMap.unknown,
    },
  ];

  const thirdPartyPiechartData = [
    {
      count: cookieStats.thirdParty.functional,
      color: colourMap.funtional,
    },
    {
      count: cookieStats.thirdParty.marketing,
      color: colourMap.marketing,
    },
    {
      count: cookieStats.thirdParty.analytics,
      color: colourMap.analytics,
    },
    {
      count: cookieStats.thirdParty.unknown,
      color: colourMap.unknown,
    },
  ];

  return (
    <>
      {cookieStats?.firstParty.total || cookieStats?.thirdParty.total ? (
        <div className="w-96 h-80 flex justify-center items-center flex-col">
          <div className="w-full flex-1 flex gap-16 pt-6 px-12">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex-1 w-full">
                {cookieStats.firstParty.total ? (
                  <PieChart
                    centerCount={cookieStats.firstParty.total}
                    data={firstPartyPiechartData}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-center">
                      First Party Cookies Not Found
                    </h1>
                  </div>
                )}
              </div>
              {cookieStats.firstParty.total ? (
                <p className="font-bold text-xs">1st Party Cookies</p>
              ) : null}
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex-1 w-full h-full">
                {cookieStats.thirdParty.total ? (
                  <PieChart
                    centerCount={cookieStats.thirdParty.total}
                    data={thirdPartyPiechartData}
                  />
                ) : (
                  <div className="w-full h-full flex justify-center items-center">
                    <h1 className="text-center">
                      Third Party Cookies Not Found
                    </h1>
                  </div>
                )}
              </div>
              {cookieStats.thirdParty.total ? (
                <p className="font-bold text-xs">3rd Party Cookies</p>
              ) : null}
            </div>
          </div>
          <div className="mt-3">
            <Legend legendItemList={legendData} />
          </div>
          <div className="w-full text-center mt-5 px-3 mb-3">
            <p className="text-chart-label text-xs">
              {'Inspect cookies in the "Privacy Sandbox" panel of DevTools'}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-96 h-80 flex justify-center items-center flex-col">
          <p className="font-bold text-lg">{message}</p>
        </div>
      )}
    </>
  );
};

export default App;
