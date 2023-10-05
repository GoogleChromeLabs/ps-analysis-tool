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
  const [cookies, setCookies] = useState<{
    [key: string]: {
      [key: string]: CookieJsonDataType;
    };
  }>({});
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

  const frames = useMemo(() => {
    return Object.keys(cookies).reduce((acc, frame) => {
      if (frame?.includes('http')) {
        acc[frame] = {} as TabFrames[string];
      }
      return acc;
    }, {} as TabFrames);
  }, [cookies]);

  const reshapedCookies = useMemo(
    () =>
      Object.entries(cookies)
        .filter(([frame]) => frame.includes('http'))
        .map(([frame, _cookies]) => {
          const newCookies = Object.fromEntries(
            Object.entries(_cookies).map(([key, cookie]) => [
              key,
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
                frameUrl: frame,
              } as CookieTableData,
            ])
          );

          return newCookies;
        })
        .reduce((acc, cookieObj) => {
          return {
            ...acc,
            ...cookieObj,
          };
        }, {}),
    [cookies]
  );

  useEffect(() => {
    (async () => {
      const response = await fetch(path);
      const data = await response.json();

      let _cookies: {
          [key: string]: {
            [key: string]: CookieJsonDataType;
          };
        } = {},
        _technologies;

      if (type === DisplayType.SITEMAP) {
        _technologies = data.reduce(
          (
            acc: TechnologyData[],
            {
              technologyData,
              pageUrl,
            }: { technologyData: TechnologyData[]; pageUrl: string }
          ) => {
            return [
              ...acc,
              ...technologyData.map((technology) => {
                technology.pageUrl = pageUrl;
                return technology;
              }),
            ];
          },
          [] as TechnologyData[]
        );

        data.forEach(
          ({
            cookieData,
            pageUrl,
          }: {
            cookieData: {
              frameCookies: {
                [key: string]: {
                  [key: string]: CookieJsonDataType;
                };
              };
            };
            pageUrl: string;
          }) => {
            const _cookieData = Object.entries(cookieData).reduce(
              (
                acc: {
                  [key: string]: {
                    [key: string]: CookieJsonDataType;
                  };
                },
                [frame, _data]
              ) => {
                acc[frame] = Object.fromEntries(
                  Object.entries(_data.frameCookies).map(([key, cookie]) => [
                    key + pageUrl,
                    {
                      ...cookie,
                      pageUrl,
                      frameUrl: frame,
                    } as CookieJsonDataType,
                  ])
                );

                return acc;
              },
              {}
            );

            Object.entries(_cookieData).forEach(([frame, __cookies]) => {
              if (!_cookies[frame]) {
                _cookies[frame] = {};
              }

              Object.entries(__cookies).forEach(([key, cookie]) => {
                _cookies[frame][key] = cookie;
              });
            });
          }
        );
      } else {
        _technologies = data.technologyData;

        _cookies = Object.entries(
          data.cookieData as {
            [frame: string]: {
              frameCookies: {
                [key: string]: CookieJsonDataType;
              };
            };
          }
        ).reduce(
          (
            acc: { [key: string]: { [key: string]: CookieJsonDataType } },
            [frame, _data]
          ) => {
            acc[frame] = Object.fromEntries(
              Object.entries(_data.frameCookies).map(([key, cookie]) => [
                key + data.pageUrl + frame,
                {
                  ...cookie,
                  pageUrl: data.pageUrl,
                  frameUrl: frame,
                },
              ])
            );

            return acc;
          },
          {}
        );
      }

      setCookies(_cookies);
      setTechnologies(_technologies as TechnologyData[]);

      const _sites = new Set<string>();
      Object.values(_cookies).forEach((cookieData) => {
        Object.values(cookieData).forEach((cookie) => {
          _sites.add(cookie.pageUrl);
        });
      });

      setSites(Array.from(_sites));
    })();
  }, [path, type]);

  const siteFilteredCookies = useMemo(() => {
    return Object.entries(cookies).reduce(
      (
        acc: {
          [key: string]: {
            [key: string]: CookieJsonDataType;
          };
        },
        [frame, _cookies]
      ) => {
        acc[frame] = Object.fromEntries(
          Object.entries(_cookies).filter(
            ([, cookie]) => cookie.pageUrl === selectedSite
          )
        );

        return acc;
      },
      {}
    );
  }, [cookies, selectedSite]);

  const siteFilteredTechnologies = useMemo(() => {
    return technologies.filter(
      (technology) => technology.pageUrl === selectedSite
    );
  }, [selectedSite, technologies]);

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
              technologies={siteFilteredTechnologies}
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
