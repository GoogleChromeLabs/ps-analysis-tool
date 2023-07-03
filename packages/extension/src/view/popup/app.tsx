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

interface LegendIconProps {
  color: string;
}

const LegendIcon = ({ color }: LegendIconProps) => (
  <div
    className="w-4 h-4 rounded-full flex items-center justify-center mr-2"
    style={{ backgroundColor: color }}
  >
    <div className="w-2 h-2 rounded-full flex items-center justify-center bg-white"></div>
  </div>
);

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
  { color: '#00B04C', label: 'Functional' },
  { color: '#FFBF00', label: 'Marketing' },
  { color: '#3D7AFC', label: 'Analytics' },
  { color: '#FC260A', label: 'Unknown' },
];

interface LegendProps {
  counts: number[];
}

const Legend = ({ counts }: LegendProps) => {
  return (
    <div className="flex flex-col">
      {LEGEND.map(({ color, label }, idx) => (
        <div key={idx} className="w-36 flex items-center justify-center my-1">
          <LegendIcon color={color} />
          <p className="flex-1 text-[#111B21] text-xs">{label}</p>
          <p className=" text-[#111B21] text-xs"> {counts[idx]} </p>
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
        <div className="w-96 h-80 flex justify-center items-center flex-col">
          <div className="w-full flex-1 flex gap-16 pt-6 px-12">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex-1 w-full h-ful">
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
                      No first party cookies found
                    </h1>
                  </div>
                )}
              </div>
              <p className="font-bold text-xs">1st Party Cookies</p>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="flex-1 w-full h-full">
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
                    <h1 className="text-center">
                      No third party cookies found
                    </h1>
                  </div>
                )}
              </div>
              <p className="font-bold text-xs">3rd Party Cookies</p>
            </div>
          </div>
          <div className="mt-3">
            <Legend
              counts={[
                cookieStats.firstParty.functional +
                  cookieStats.thirdParty.functional,
                cookieStats.firstParty.marketing +
                  cookieStats.thirdParty.marketing,
                cookieStats.firstParty.analytics +
                  cookieStats.thirdParty.analytics,
                cookieStats.firstParty.unknown + cookieStats.thirdParty.unknown,
              ]}
            />
          </div>
          <div className="w-full text-center mt-5 px-3 mb-3">
            <p className="text-[#111B21] text-xs">
              {'Inspect cookies in the "Privacy Sandbox" panel of DevTools'}
            </p>
          </div>
        </div>
      ) : (
        fallback
      )}
    </>
  );
};

export default App;
