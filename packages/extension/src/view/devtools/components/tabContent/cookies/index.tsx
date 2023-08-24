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
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import CookiesListing from './cookiesListing';
import CookiesLanding from './cookiesLanding';
import ProgressBar from '../../../../design-system/components/progressBar';

const Cookies = () => {
  const { tabCookies, selectedFrame, initialProcessed, totalProcessed } =
    useCookieStore(({ state }) => ({
      selectedFrame: state.selectedFrame,
      initialProcessed: state.initialProcessed,
      totalProcessed: state.totalProcessed,
      tabCookies: state.tabCookies,
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

  if (!initialProcessed && tabCookies && Object.keys(tabCookies).length <= 0) {
    return (
      <ProgressBar
        additionalStyles="h-full"
        intervalCounter={intervalCounter}
        initialProcessed={initialProcessed}
        totalProcessed={totalProcessed}
      />
    );
  }

  return (
    <div
      className={`h-full ${selectedFrame ? '' : 'flex items-center'}`}
      data-testid="cookies-content"
    >
      {selectedFrame ? <CookiesListing /> : <CookiesLanding />}
    </div>
  );
};

export default Cookies;
