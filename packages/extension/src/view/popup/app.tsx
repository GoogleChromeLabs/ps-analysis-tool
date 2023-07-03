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
import PieChart from './PieChart';
import { useCookieStore } from '../stateProviders/syncCookieStore';
import countCookiesByCategory from '../../utils/countCookiesByCategory';

export type CookieStats = {
  total: number;
  firstParty: {
    total: number;
    functional: number;
    marketing: number;
    analytics: number;
    unknown: number;
  };
  thirdParty: {
    total: number;
    functional: number;
    marketing: number;
    analytics: number;
    unknown: number;
  };
};

const LEGEND = [
  { colour: '#5FA569', label: 'Functional' },
  { colour: '#FA752E', label: 'Marketing' },
  { colour: '#2e97fa', label: 'Analytics' },
  { colour: '#fa2e49', label: 'Unknown' },
];
const Legend = () => {
  return (
    <div>
      {LEGEND.map(({ colour, label }, idx) => (
        <div key={idx} className="flex items-center justify-centerI">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: colour }}
          />
          <p className="px-2">{label}</p>
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const { cookies, tabURL } = useCookieStore(({ state }) => ({
    cookies: state?.cookies,
    tabURL: state?.url,
  }));

  const fallback = <></>;

  if (!Object.keys(cookies).length || !tabURL) {
    return fallback;
  }

  const cookieStats = countCookiesByCategory(cookies, tabURL || '');

  return (
    <>
      {cookieStats?.firstParty.total || cookieStats?.thirdParty.total ? (
        <div className="w-96 h-80 flex justify-center items-center flex-col px-5 py-10">
          <div className="flex-1 flex justify-center items-center gap-10">
            <div className="h-full w-1/2 flex items-center flex-col">
              <h1 className="font-bold">{' 1st party cookies'}</h1>
              {cookieStats.firstParty.total ? (
                <PieChart
                  count={cookieStats.firstParty.total}
                  categoryCountData={{
                    countFuntional: cookieStats.firstParty.functional,
                    countMarketing: cookieStats.firstParty.marketing,
                    countAnalytics: cookieStats.firstParty.analytics,
                    countUnknown: cookieStats.firstParty.unknown,
                  }}
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <h1 className="text-center">
                    Listening to First Party Cookies...
                  </h1>
                </div>
              )}
            </div>
            <div className="h-full w-1/2 flex items-center flex-col">
              <h1 className="font-bold">{'3rd party cookies'}</h1>
              {cookieStats.thirdParty.total ? (
                <PieChart
                  count={cookieStats.thirdParty.total}
                  categoryCountData={{
                    countFuntional: cookieStats.thirdParty.functional,
                    countMarketing: cookieStats.thirdParty.marketing,
                    countAnalytics: cookieStats.thirdParty.analytics,
                    countUnknown: cookieStats.thirdParty.unknown,
                  }}
                />
              ) : (
                <div className="w-full h-full flex justify-center items-center">
                  <h1 className="text-center">No third party cookies found</h1>
                </div>
              )}
            </div>
          </div>
          <Legend />
          <p className="mt-5">Open devtools to inspect cookie details</p>
        </div>
      ) : (
        fallback
      )}
    </>
  );
};

export default App;
