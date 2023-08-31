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
import LandingHeader from './landingHeader';
import CookiesMatrix from './cookiesMatrix';
import { useCookieStore } from '../../../../stateProviders/syncCookieStore';
import prepareCookiesCount from '../../../../../../utils/prepareCookiesCount';
import { prepareCookieStatsComponents } from '../../../../../../utils/prepareCookieStatsComponents';
import MessageBox from '../../../../../design-system/components/messageBox';
import { Button } from '../../../../../design-system/components';

const CookiesLanding = () => {
  const {
    tabCookies,
    tabFrames,
    tabUrl,
    stopRequestProcessing,
    firstRequestProcessedTime,
    updateFirstRequestProcessed,
  } = useCookieStore(({ state, actions }) => ({
    tabFrames: state.tabFrames,
    tabCookies: state.tabCookies,
    tabUrl: state.tabUrl,
    stopRequestProcessing: state.stopRequestProcessing,
    firstRequestProcessedTime: state.firstRequestProcessedTime,
    updateFirstRequestProcessed: actions.updateFirstRequestProcessed,
  }));

  let fetchedDate: Date;
  let dateWritten = '';

  if (firstRequestProcessedTime) {
    fetchedDate = new Date(firstRequestProcessedTime + 30 * 60000);
    dateWritten =
      String(
        new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
          fetchedDate
        ) +
          ', ' +
          fetchedDate.toLocaleString('en-us', { month: 'long' })
      ) +
      ' ' +
      fetchedDate.getDate() +
      ', ' +
      fetchedDate.getFullYear() +
      ' at ' +
      fetchedDate.getHours() +
      ':' +
      fetchedDate.getMinutes() +
      ':' +
      fetchedDate.getSeconds();
  }
  const cookieStats = prepareCookiesCount(tabCookies, tabUrl);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  return (
    <div className="h-full w-full min-w-[20rem]" data-testid="cookies-landing">
      <LandingHeader
        cookieStats={cookieStats}
        cookiesStatsComponents={cookiesStatsComponents}
      />
      <div className="lg:max-w-[729px] mx-auto flex justify-center flex-col mt-10 pb-28 px-4">
        {!cookieStats ||
          (cookieStats?.firstParty.total === 0 &&
            cookieStats?.thirdParty.total === 0 && (
              <MessageBox
                headerText="No cookies found on this page"
                bodyText="Please try reloading the page"
              />
            ))}
        {stopRequestProcessing && firstRequestProcessedTime && (
          <div className="flex flex-col w-full items-center justify-center">
            <MessageBox
              headerText="Cookie processing information"
              bodyText={`Request processing on this tab will be paused after ${dateWritten}. Click on the button below to the reset timer.`}
            />
            <div>
              <Button
                onClick={updateFirstRequestProcessed}
                text="Reset timer"
              />
            </div>
          </div>
        )}
        <CookiesMatrix
          tabCookies={tabCookies}
          cookiesStatsComponents={cookiesStatsComponents}
          tabFrames={tabFrames}
        />
      </div>
    </div>
  );
};

export default CookiesLanding;
