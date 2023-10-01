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
import { Resizable } from 're-resizable';

/**
 * Internal dependencies
 */
import './app.css';
import SiteReport from './components/siteReport';
import type {
  CookieTableData,
  TabCookies,
  TabFrames,
  TechnologyData,
} from '@cookie-analysis-tool/common';
import type { CookieJsonDataType } from './types';
import SiteSelection from './components/siteReport/components/siteSelection';
import { CookiesLanding } from '@cookie-analysis-tool/design-system';

enum DisplayType {
  SITEMAP,
  SITE,
}

const App = () => {
  const [cookies, setCookies] = useState<CookieJsonDataType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyData[]>([]);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);

  const [type, path] = useMemo(() => {
    const urlParams = new URLSearchParams(window.location.search);
    return [
      urlParams.get('type') === 'sitemap'
        ? DisplayType.SITEMAP
        : DisplayType.SITE,
      urlParams.get('path')?.substring(1) || '',
    ];
  }, []);

  const frames = useMemo<TabFrames>(
    () =>
      cookies.reduce((acc, cookie) => {
        const frameUrl =
          Object.values(cookie.frameUrls).length >= 1
            ? Object.values(cookie.frameUrls)[0]
            : cookie.pageUrl;
        if (frameUrl?.includes('http')) {
          acc[frameUrl] = {} as TabFrames[string];
        }
        return acc;
      }, {} as TabFrames),
    [cookies]
  );

  const reshapedCookies = useMemo<TabCookies>(
    () =>
      Object.fromEntries(
        cookies.map((cookie) => {
          return [
            cookie.name + cookie.domain + cookie.path,
            {
              parsedCookie: {
                name: cookie.name,
                value: cookie.value,
                domain: cookie.domain,
                path: cookie.path,
                expires: cookie.expires,
                httponly: cookie.httpOnly,
                secure: cookie.secure,
                samesite: cookie.sameSite,
              },
              analytics: {
                platform: cookie.platform,
                category:
                  cookie.category === 'Unknown Category'
                    ? 'Uncategorized'
                    : cookie.category,
                description: cookie.description,
              } as CookieTableData['analytics'],
              url: cookie.pageUrl,
              headerType: 'response',
              isFirstParty: cookie.isFirstParty === 'Yes' ? true : false,
              frameIdList: [],
              isCookieSet: !cookie.isBlocked,
              frameUrl:
                Object.values(cookie.frameUrls).length >= 1
                  ? Object.values(cookie.frameUrls)[0]
                  : cookie.pageUrl,
            },
          ];
        })
      ),
    [cookies]
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(path);
      const data = await response.json();

      setCookies(data.cookies as CookieJsonDataType[]);
      setTechnologies(data.technologies as TechnologyData[]);

      const _sites = new Set<string>();
      data.cookies.forEach((cookie: CookieJsonDataType) => {
        _sites.add(cookie.pageUrl);
      });

      setSites(Array.from(_sites));
    })();
  }, [path]);

  const siteFilteredCookies = useMemo(() => {
    return cookies.filter((cookie) => cookie.pageUrl === selectedSite);
  }, [cookies, selectedSite]);

  if (!path) {
    return (
      <div className="flex justify-center items-center">
        <div className="text-2xl">No path provided</div>
      </div>
    );
  }

  if (type === DisplayType.SITEMAP) {
    return (
      <div className="w-full h-screen flex">
        <Resizable
          defaultSize={{ width: '200px', height: '100%' }}
          minWidth={'150px'}
          maxWidth={'98%'}
          enable={{
            right: true,
          }}
          className="h-full flex flex-col border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz"
        >
          <SiteSelection
            sites={sites}
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
          />
        </Resizable>
        <div className="flex-1 h-full">
          {selectedSite ? (
            <SiteReport
              cookies={siteFilteredCookies}
              technologies={technologies}
            />
          ) : (
            <CookiesLanding tabFrames={frames} tabCookies={reshapedCookies} />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div className="w-full h-screen flex">
        <SiteReport cookies={cookies} technologies={technologies} />
      </div>
    );
  }
};

export default App;
