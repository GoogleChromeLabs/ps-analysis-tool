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
  type LibraryData,
  type ErroredOutUrlsData,
  extractReportData,
  extractCookies,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import { SiteMapReport, SiteReport } from '@google-psat/report';
import '@google-psat/design-system/theme.css';

enum DisplayType {
  SITEMAP,
  SITE,
}

const App = () => {
  const [cookies, setCookies] = useState<CookieFrameStorageType>({});

  const [landingPageCookies, setLandingPageCookies] =
    useState<CookieFrameStorageType>({});

  const [completeJsonReport, setCompleteJsonReport] = useState<
    CompleteJson[] | null
  >(null);

  const [erroredOutUrls, setErroredOutUrls] = useState<ErroredOutUrlsData[]>(
    []
  );

  const [libraryMatches, setLibraryMatches] = useState<{
    [key: string]: LibraryData;
  } | null>(null);

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
  const [type, setType] = useState<DisplayType>(DisplayType.SITE);

  useEffect(() => {
    (async () => {
      if (process.env.NODE_ENV === 'development') {
        const module = await import('./dummyData/PSAT_DATA.js');
        // @ts-ignore
        globalThis.PSAT_DATA = module.default;
      }

      setType(
        globalThis?.PSAT_DATA?.type === 'sitemap'
          ? DisplayType.SITEMAP
          : DisplayType.SITE
      );
    })();
  }, []);

  useEffect(() => {
    if (!globalThis?.PSAT_DATA) {
      return;
    }

    sessionStorage.clear();
    //@ts-ignore
    const messages = globalThis?.PSAT_DATA?.translations;
    I18n.initMessages(messages);

    // @ts-ignore
    const data: CompleteJson[] = globalThis?.PSAT_DATA?.json;
    setCompleteJsonReport(data);

    let _cookies: CookieFrameStorageType = {},
      _libraryMatches: {
        [key: string]: LibraryData;
      } = {};

    if (type === DisplayType.SITEMAP) {
      const extractedData = extractReportData(data);

      _libraryMatches = extractedData.consolidatedLibraryMatches;
      setLandingPageCookies(extractedData.landingPageCookies);
      setErroredOutUrls(extractedData.erroredOutUrlsData);
    } else {
      _cookies = extractCookies(data[0].cookieData, '', true);
      _libraryMatches = { [data[0].pageUrl]: data[0].libraryMatches };
    }

    setCookies(_cookies);
    setLibraryMatches(_libraryMatches);
  }, [type]);

  if (type === DisplayType.SITEMAP) {
    return (
      <SiteMapReport
        erroredOutUrls={erroredOutUrls}
        landingPageCookies={landingPageCookies}
        completeJson={completeJsonReport}
        // @ts-ignore
        path={globalThis?.PSAT_DATA?.selectedSite}
        libraryMatches={libraryMatches}
      />
    );
  }

  return (
    <div className="w-full h-screen flex dark:bg-raisin-black text-raisin-black dark:text-bright-gray">
      <SiteReport
        completeJson={completeJsonReport}
        cookies={cookies}
        // @ts-ignore
        selectedSite={globalThis?.PSAT_DATA?.selectedSite}
        // @ts-ignore
        path={globalThis?.PSAT_DATA?.selectedSite}
        libraryMatches={
          libraryMatches
            ? libraryMatches[Object.keys(libraryMatches ?? {})[0]]
            : null
        }
      />
    </div>
  );
};

export default App;
