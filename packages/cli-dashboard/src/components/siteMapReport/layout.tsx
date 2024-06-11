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
import {
  File,
  FileWhite,
  Sidebar,
  useSidebar,
  type SidebarItems,
  SIDEBAR_ITEMS_KEYS,
} from '@ps-analysis-tool/design-system';
import {
  type TabFrames,
  type TechnologyData,
  type CookieFrameStorageType,
  type CompleteJson,
  type LibraryData,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import SiteReport from '../siteReport';
import SiteMapCookiesWithIssues from './sitemapCookiesWithIssues';
import CookiesLandingContainer from '../siteReport/tabs/cookies/cookiesLandingContainer';
import reshapeCookies from '../utils/reshapeCookies';
import { generateSiteMapReportandDownload } from '../utils/reportDownloader';

interface LayoutProps {
  landingPageCookies: CookieFrameStorageType;
  cookies: CookieFrameStorageType;
  technologies: TechnologyData[];
  completeJson: CompleteJson[] | null;
  sidebarData: SidebarItems;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
  path: string;
  libraryMatches: { [url: string]: LibraryData } | null;
}

const Layout = ({
  cookies,
  technologies,
  landingPageCookies,
  completeJson,
  sidebarData,
  setSidebarData,
  path,
  libraryMatches,
}: LayoutProps) => {
  const [sites, setSites] = useState<string[]>([]);

  useEffect(() => {
    const _sites = new Set<string>();
    Object.values(cookies).forEach((cookieData) => {
      Object.values(cookieData).forEach((cookie) => {
        _sites.add(cookie.pageUrl || '');
      });
    });

    setSites(Array.from(_sites));
  }, [cookies]);

  const reshapedCookies = useMemo(
    () => reshapeCookies(landingPageCookies),
    [landingPageCookies]
  );

  const cookiesWithIssues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(reshapedCookies).filter(
          ([, cookie]) => cookie.isBlocked || cookie.blockedReasons?.length
        )
      ),
    [reshapedCookies]
  );

  const { activePanel, selectedItemKey, updateSelectedItemKey, isKeySelected } =
    useSidebar(({ state, actions }) => ({
      activePanel: state.activePanel,
      selectedItemKey: state.selectedItemKey,
      updateSelectedItemKey: actions.updateSelectedItemKey,
      isKeySelected: actions.isKeySelected,
    }));

  const { Element: PanelElement, props } = activePanel.panel;

  const siteFilteredCookies = useMemo(() => {
    return Object.entries(cookies).reduce(
      (acc: CookieFrameStorageType, [frame, _cookies]) => {
        acc[frame] = Object.fromEntries(
          Object.entries(_cookies).filter(([, cookie]) =>
            isKeySelected(cookie.pageUrl || '')
          )
        );

        return acc;
      },
      {}
    );
  }, [cookies, isKeySelected]);

  const siteFilteredTechnologies = useMemo(() => {
    return technologies.filter((technology) =>
      isKeySelected(technology.pageUrl || '')
    );
  }, [isKeySelected, technologies]);

  useEffect(() => {
    setSidebarData((prev) => {
      const _data = { ...prev };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: CookiesLandingContainer,
        props: {
          tabCookies: reshapedCookies,
          isSiteMapLandingContainer: true,
          tabFrames: sites.reduce<TabFrames>((acc, site) => {
            acc[site] = {} as TabFrames[string];

            return acc;
          }, {}),
          cookiesWithIssues,
          downloadReport: () => {
            if (!Array.isArray(completeJson)) {
              return;
            }

            generateSiteMapReportandDownload(
              completeJson,
              //@ts-ignore
              atob(globalThis.PSAT_REPORT),
              ''
            );
          },
        },
      };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].children = sites.reduce(
        (acc: SidebarItems, site: string) => {
          acc[site] = {
            title: site,
            panel: {
              Element: SiteReport,
              props: {
                cookies: siteFilteredCookies,
                technologies: siteFilteredTechnologies,
                completeJson,
                selectedSite: site,
                path,
                libraryMatches: libraryMatches ? libraryMatches[site] : {},
              },
            },
            children: {},
            icon: {
              Element: File,
            },
            selectedIcon: {
              Element: FileWhite,
            },
          };

          return acc;
        },
        {}
      );

      _data[SIDEBAR_ITEMS_KEYS.COOKIES_WITH_ISSUES].panel = {
        Element: SiteMapCookiesWithIssues,
        props: {
          cookies: Object.values(reshapedCookies).filter(
            (cookie) => cookie.isBlocked || cookie.blockedReasons?.length
          ),
        },
      };

      return _data;
    });
  }, [
    libraryMatches,
    completeJson,
    cookiesWithIssues,
    isKeySelected,
    path,
    reshapedCookies,
    setSidebarData,
    siteFilteredCookies,
    siteFilteredTechnologies,
    sites,
  ]);

  useEffect(() => {
    if (selectedItemKey === null && Object.keys(sidebarData).length > 0) {
      updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.COOKIES);
    }
  }, [isKeySelected, selectedItemKey, sidebarData, updateSelectedItemKey]);

  return (
    <div className="w-full h-screen flex">
      <Resizable
        defaultSize={{ width: '200px', height: '100%' }}
        minWidth={'150px'}
        maxWidth={'50%'}
        enable={{
          right: true,
        }}
      >
        <Sidebar />
      </Resizable>
      <div className="flex-1 max-h-screen overflow-auto">
        {PanelElement && <PanelElement {...props} />}
      </div>
    </div>
  );
};

export default Layout;
