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
import { useEffect, useState } from 'react';
import type {
  CompleteJson,
  CookieFrameStorageType,
  LibraryData,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import { extractCookies, SiteReport } from '@google-psat/report';

/**
 * Internal dependencies
 */
import './app.css';

const App = () => {
  const [cookies, setCookies] = useState<CookieFrameStorageType>({});
  const [completeJsonReport, setCompleteJsonReport] = useState<
    CompleteJson[] | null
  >(null);
  const [libraryMatches, setLibraryMatches] = useState<{
    [key: string]: LibraryData;
  } | null>(null);

  useEffect(() => {
    const bodyTag = document.querySelector('body');

    if (!bodyTag) {
      return;
    }

    bodyTag.style.fontSize = '75%';
  }, []);

  useEffect(() => {
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

    _cookies = extractCookies(data[0].cookieData, data[0].pageUrl, true);
    _libraryMatches = { [data[0].pageUrl]: data[0].libraryMatches };

    setCookies(_cookies);
    setLibraryMatches(_libraryMatches);
  }, []);

  if (!completeJsonReport) {
    return <></>;
  }

  return (
    <div className="w-full h-screen flex">
      <SiteReport
        completeJson={completeJsonReport}
        cookies={cookies}
        technologies={[]}
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
