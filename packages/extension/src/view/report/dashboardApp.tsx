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
 * External dependencies
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  type CompleteJson,
  type CookieFrameStorageType,
  extractCookies,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import { SiteReport } from '@google-psat/report';
import '@google-psat/design-system/theme.css';

const App = () => {
  const [cookies, setCookies] = useState<CookieFrameStorageType>({});
  const [completeJsonReport, setCompleteJsonReport] = useState<
    CompleteJson[] | null
  >(null);

  const handleDarkThemeChange = useCallback(() => {
    const setThemeMode = (isDarkMode: boolean) => {
      if (isDarkMode) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    };

    const bodyTag = document.querySelector('body');

    if (!bodyTag) {
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeMode(true);
    } else {
      setThemeMode(false);
    }

    bodyTag.style.fontSize = '75%';
  }, []);

  useEffect(() => {
    handleDarkThemeChange();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', handleDarkThemeChange);

    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', handleDarkThemeChange);
    };
  }, [handleDarkThemeChange]);

  useEffect(() => {
    sessionStorage.clear();
    //@ts-ignore
    const messages = globalThis?.PSAT_DATA?.translations;
    I18n.initMessages(messages);

    // @ts-ignore
    const data: CompleteJson[] = globalThis?.PSAT_DATA?.json;
    setCompleteJsonReport(data);

    let _cookies: CookieFrameStorageType = {};

    _cookies = extractCookies(data[0].cookieData, data[0].pageUrl, true);

    setCookies(_cookies);
  }, []);

  if (!completeJsonReport) {
    return <></>;
  }

  return (
    <div className="w-full h-screen flex">
      <SiteReport
        completeJson={completeJsonReport}
        cookies={cookies}
        // @ts-ignore
        selectedSite={completeJsonReport[0].pageUrl}
        // @ts-ignore
        path={globalThis?.PSAT_DATA?.selectedSite}
      />
    </div>
  );
};

export default App;
