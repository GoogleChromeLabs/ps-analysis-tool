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
  type TableFilter,
} from '@google-psat/design-system';
import {
  type TabFrames,
  type CookieFrameStorageType,
  type CompleteJson,
  type LibraryData,
  type TabCookies,
} from '@google-psat/common';

/**
 * Internal dependencies.
 */
import SiteReport from '../siteReport';
import SiteMapCookiesWithIssues from './sitemapCookiesWithIssues';
import CookiesLandingContainer from '../siteReport/tabs/cookies/cookiesLandingContainer';
import reshapeCookies from '../utils/reshapeCookies';
import { generateSiteMapReportandDownload } from '../utils/reportDownloader';
import extractCookies from '../utils/extractCookies';

interface LayoutProps {
  landingPageCookies: CookieFrameStorageType;
  completeJson: CompleteJson[] | null;
  sidebarData: SidebarItems;
  setSidebarData: React.Dispatch<React.SetStateAction<SidebarItems>>;
  path: string;
  libraryMatches: { [url: string]: LibraryData } | null;
}

const Layout = ({
  landingPageCookies,
  completeJson,
  sidebarData,
  setSidebarData,
  path,
  libraryMatches,
}: LayoutProps) => {
  const [sites, setSites] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<TabCookies>({});
  const [appliedFilters, setAppliedFilters] = useState<TableFilter>({});

  useEffect(() => {
    const _sites = new Set<string>();
    completeJson?.forEach(({ pageUrl }) => {
      _sites.add(pageUrl);
    });

    setSites(Array.from(_sites));
  }, [completeJson]);

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
  const { query, clearQuery } = activePanel;

  const [
    siteFilteredCookies,
    siteFilteredTechnologies,
    siteFilteredCompleteJson,
  ] = useMemo(() => {
    const reportData = completeJson?.find((data) =>
      isKeySelected(data.pageUrl)
    );

    if (!reportData) {
      return [{}, [], null];
    }

    const _cookies = extractCookies(
      reportData.cookieData,
      reportData.pageUrl,
      true
    );
    const _technologies = reportData.technologyData;

    return [_cookies, _technologies, [reportData]];
  }, [completeJson, isKeySelected]);

  const doesSiteHaveCookies = useMemo(() => {
    const store = {} as Record<string, boolean>;

    completeJson?.forEach((data) => {
      store[data.pageUrl] = Object.entries(data.cookieData).reduce(
        (acc, [, frameData]) => {
          return acc || Object.keys(frameData.frameCookies || {}).length > 0;
        },
        false
      );
    });

    return store;
  }, [completeJson]);

  const [siteMapLibraryMatches, libraryMatchesUrlCount] = useMemo(() => {
    const _libraryMatchesUrlCount: {
      [key: string]: number;
    } = {};

    const _siteMapLibraryMatches = completeJson?.reduce<
      CompleteJson['libraryMatches']
    >((acc, data) => {
      const _libraryMatches = data.libraryMatches;

      Object.keys(_libraryMatches).forEach((key) => {
        acc[key] =
          // @ts-ignore
          acc[key]?.matches?.length || acc[key]?.domQuerymatches?.length
            ? acc[key]
            : _libraryMatches[key];

        if (
          Object.keys(_libraryMatches[key]?.matches ?? {}).length ||
          Object.keys(_libraryMatches[key]?.domQuerymatches ?? {}).length
        ) {
          _libraryMatchesUrlCount[key] =
            (_libraryMatchesUrlCount[key] || 0) + 1;
        }
      });

      return acc;
    }, {});

    return [_siteMapLibraryMatches, _libraryMatchesUrlCount];
  }, [completeJson]);

  useEffect(() => {
    setSidebarData((prev) => {
      const _data = { ...prev };

      _data[SIDEBAR_ITEMS_KEYS.COOKIES].panel = {
        Element: CookiesLandingContainer,
        props: {
          tabCookies: reshapedCookies,
          tabFrames: sites.reduce<TabFrames>((acc, site) => {
            acc[site] = {} as TabFrames[string];

            return acc;
          }, {}),
          setFilteredData,
          setAppliedFilters,
          cookiesWithIssues,
          libraryMatches: siteMapLibraryMatches,
          libraryMatchesUrlCount,
          downloadReport: () => {
            if (!Array.isArray(completeJson)) {
              return;
            }

            generateSiteMapReportandDownload(
              completeJson,
              filteredData,
              appliedFilters,
              path,
              //@ts-ignore
              atob(globalThis.PSAT_REPORT_HTML)
            );
          },
          menuBarScrollContainerId: 'dashboard-sitemap-layout-container',
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
                completeJson: siteFilteredCompleteJson,
                selectedSite: site,
                path,
                libraryMatches: libraryMatches ? libraryMatches[site] : {},
                query,
                clearQuery,
              },
            },
            children: {},
            icon: {
              Element: File,
            },
            selectedIcon: {
              Element: FileWhite,
            },
            isBlurred: doesSiteHaveCookies[site] === false,
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
    appliedFilters,
    completeJson,
    cookiesWithIssues,
    doesSiteHaveCookies,
    filteredData,
    libraryMatches,
    libraryMatchesUrlCount,
    path,
    reshapedCookies,
    setSidebarData,
    siteFilteredCompleteJson,
    siteFilteredCookies,
    siteFilteredTechnologies,
    siteMapLibraryMatches,
    sites,
    query,
    clearQuery,
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
      <div
        className="flex-1 max-h-screen overflow-auto"
        id="dashboard-sitemap-layout-container"
      >
        {PanelElement && <PanelElement {...props} />}
      </div>
    </div>
  );
};

export default Layout;
