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
import React, { useRef, useEffect, useState } from 'react';

/**
 * Internal dependencies.
 */
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import prepareCookiesCount from '../../../../../../utils/prepareCookiesCount';
import { prepareCookieStatsComponents } from '../../../../../../utils/prepareCookieStatsComponents';
import ProgressBar from '../../../../../design-system/components/progressBar';

const CookiesLanding = () => {
  const { tabCookies, tabFrames, tabUrl, initialProcessed, totalProcessed } =
    useCookieStore(({ state }) => ({
      tabFrames: state.tabFrames,
      tabCookies: state.tabCookies,
      tabUrl: state.tabUrl,
      initialProcessed: state.initialProcessed,
      totalProcessed: state.totalProcessed,
    }));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [intervalCounter, setIntervalCounter] = useState<number>(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIntervalCounter((prevState) => {
        if (prevState < 50) {
          return prevState + 1;
        }
        return 50;
      });
    }, 760);
  }, [intervalCounter]);

  useEffect(() => {
    if (intervalCounter > 50 && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [intervalCounter]);

  const cookieStats = prepareCookiesCount(tabCookies, tabUrl);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="w-full h-full">
      {(!initialProcessed && !tabCookies) ||
        (tabCookies && Object.keys(tabCookies).length <= 0 && (
          <div className="absolute inset-0 z-10 w-full h-full backdrop-blur-sm">
            <ProgressBar
              additionalStyles="w-96 h-44 top-5 inset-x-1/3 dark:bg-raisin-black bg-white border border-american-silver dark:border-quartz"
              intervalCounter={intervalCounter}
              initialProcessed={initialProcessed}
              totalProcessed={totalProcessed}
            />
          </div>
        ))}
      <div
        className="absolute inset-0 z-0 h-full w-full min-w-[20rem]"
        data-testid="cookies-landing"
      >
        <LandingHeader
          cookieStats={cookieStats}
          cookiesStatsComponents={cookiesStatsComponents}
        />
        <div className="lg:max-w-[729px] mx-auto flex justify-center mt-10 pb-28 px-4">
          <CookiesMatrix
            tabCookies={tabCookies}
            cookiesStatsComponents={cookiesStatsComponents}
            tabFrames={tabFrames}
          />
        </div>
      </div>
    </div>
  );
};

export default CookiesLanding;
