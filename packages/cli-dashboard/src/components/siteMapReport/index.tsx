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
import React, { useEffect, useMemo, useState } from 'react';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import SiteSelection from '../siteReport/components/siteSelection';
import {
  CookiesLanding,
  CookiesMatrix,
} from '@cookie-analysis-tool/design-system';
import type { CookieFrameStorageType } from '../../types';
import {
  prepareCookieStatsComponents,
  type CookieTableData,
  type TabFrames,
  type TechnologyData,
  prepareCookiesCount,
} from '@cookie-analysis-tool/common';
import SiteReport from '../siteReport';
import SiteMapAffectedCookies from './sitemapAffectedCookies';

interface SiteMapReportProps {
  landingPageCookies: CookieFrameStorageType;
  cookies: CookieFrameStorageType;
  technologies: TechnologyData[];
  completeJson: CompleteJson | null;
}

const SiteMapReport = ({
  cookies,
  technologies,
  landingPageCookies,
}: SiteMapReportProps) => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [sites, setSites] = useState<string[]>([]);
  const [selectedTopLevelMenu, setSelectedTopLevelMenu] =
    useState<string>('report');

  useEffect(() => {
    const _sites = new Set<string>();
    Object.values(cookies).forEach((cookieData) => {
      Object.values(cookieData).forEach((cookie) => {
        _sites.add(cookie.pageUrl);
      });
    });

    setSites(Array.from(_sites));
  }, [cookies]);

  const frames = useMemo(() => {
    return Object.keys(cookies).reduce((acc, frame) => {
      if (frame?.includes('http') || frame === 'Unknown Frame') {
        acc[frame] = {} as TabFrames[string];
      }
      return acc;
    }, {} as TabFrames);
  }, [cookies]);

  const reshapedCookies = useMemo(
    () =>
      Object.entries(landingPageCookies)
        .filter(
          ([frame]) => frame.includes('http') || frame === 'Unknown Frame'
        )
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
                isFirstParty: cookie.isFirstParty,
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
    [landingPageCookies]
  );

  const affectedCookies = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(reshapedCookies).filter(
          ([, cookie]) => !cookie.isCookieSet
        )
      ),
    [reshapedCookies]
  );

  const siteFilteredCookies = useMemo(() => {
    return Object.entries(cookies).reduce(
      (acc: CookieFrameStorageType, [frame, _cookies]) => {
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
        <div className="flex flex-col">
          <SiteSelection
            sites={sites}
            selectedSite={selectedSite}
            setSelectedSite={setSelectedSite}
            isSelectedTopLevelMenu={selectedTopLevelMenu === 'report'}
            selectTopLevelMenu={() => setSelectedTopLevelMenu('report')}
          />
          <div
            onClick={() => {
              setSelectedTopLevelMenu('affectedCookies');
              setSelectedSite(null);
            }}
            className={`w-full flex items-center pl-6 py-0.5 outline-0 cursor-pointer text-sm 
							${
                selectedTopLevelMenu === 'affectedCookies'
                  ? 'bg-royal-blue text-white'
                  : 'bg-white'
              }
							}
						`}
          >
            <p>Affected Cookies</p>
          </div>
        </div>
      </Resizable>
      <div className="flex-1 h-full">
        {selectedSite ? (
          <SiteReport
            cookies={siteFilteredCookies}
            technologies={siteFilteredTechnologies}
            completeJson={completeJson}
          />
        ) : selectedTopLevelMenu === 'report' ? (
          <>
            <CookiesLanding
              tabFrames={frames}
              tabCookies={reshapedCookies}
              showInfoIcon={false}
              showHorizontalMatrix={false}
            >
              <CookiesMatrix
                tabCookies={affectedCookies}
                cookiesStatsComponents={prepareCookieStatsComponents(
                  prepareCookiesCount(affectedCookies)
                )}
                tabFrames={frames}
                title="Affected Cookies Insights"
                description="Following are the insights about cookies that will be affected by 3P cookie depreciation."
                showInfoIcon={false}
                count={Object.values(affectedCookies).length}
              />
            </CookiesLanding>
          </>
        ) : (
          <SiteMapAffectedCookies
            cookies={Object.values(reshapedCookies).filter(
              (cookie) => !cookie.isCookieSet
            )}
          />
        )}
      </div>
    </div>
  );
};

export default SiteMapReport;
