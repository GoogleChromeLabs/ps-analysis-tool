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
import React, { useEffect, useMemo, useState } from 'react';
import type { TechnologyData } from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import './app.css';
import SiteReport from './components/siteReport';
import type { CookieFrameStorageType, CompleteJson } from './types';
import SiteMapReport from './components/siteMapReport';
import extractReportData from './components/utils/extractReportData';
import extractCookies from './components/utils/extractCookies';

enum DisplayType {
  SITEMAP,
  SITE,
}

const App = () => {
  const [cookies, setCookies] = useState<CookieFrameStorageType>({});
  const [landingPageCookies, setLandingPageCookies] =
    useState<CookieFrameStorageType>({});
  const [technologies, setTechnologies] = useState<TechnologyData[]>([]);
  const [completeJsonReport, setCompleteJsonReport] =
    useState<CompleteJson | null>(null);

  const [type, path] = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dir = urlParams.get('dir');

    return [
      urlParams.get('type') === 'sitemap'
        ? DisplayType.SITEMAP
        : DisplayType.SITE,
      `/out/${dir}/out.json`,
    ];
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch(path);
      const data = await response.json();
      setCompleteJsonReport(data);

      let _cookies: CookieFrameStorageType = {},
        _technologies: TechnologyData[] = [];

      if (type === DisplayType.SITEMAP) {
        const extractedData = extractReportData(data);

        _cookies = extractedData.cookies;
        _technologies = extractedData.technologies;
        setLandingPageCookies(extractedData.landingPageCookies);
      } else {
        _cookies = extractCookies(data.cookieData, data.pageUrl, true);
        _technologies = data.technologyData;
      }

      setCookies(_cookies);
      setTechnologies(_technologies);
    })();
  }, [path, type]);

  if (!path) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-2xl">No path provided</div>
      </div>
    );
  }

  if (type === DisplayType.SITEMAP) {
    return (
      <SiteMapReport
        landingPageCookies={landingPageCookies}
        cookies={cookies}
        technologies={technologies}
        completeJson={completeJsonReport}
      />
    );
  }

  return (
    <div className="w-full h-screen flex">
      <SiteReport
        completeJson={completeJsonReport}
        cookies={cookies}
        technologies={technologies}
        selectedSite={path.slice(5, -9)}
      />
    </div>
  );
};

export default App;
