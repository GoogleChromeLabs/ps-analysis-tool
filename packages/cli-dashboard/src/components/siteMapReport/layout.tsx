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
} from '@ps-analysis-tool/design-system';
import {
  type TabFrames,
  type TechnologyData,
  UNKNOWN_FRAME_KEY,
  type CookieFrameStorageType,
  type CompleteJson,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import SiteReport from '../siteReport';
import SiteMapAffectedCookies from './sitemapAffectedCookies';
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
}

const Layout = ({
  cookies,
  technologies,
  landingPageCookies,
  completeJson,
  sidebarData,
  setSidebarData,
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

  const frames = useMemo(() => {
    return Object.keys(cookies).reduce((acc, frame) => {
      if (frame?.includes('http') || frame === UNKNOWN_FRAME_KEY) {
        acc[frame] = {} as TabFrames[string];
      }
      return acc;
    }, {} as TabFrames);
  }, [cookies]);

  const reshapedCookies = useMemo(
    () => reshapeCookies(landingPageCookies),
    [landingPageCookies]
  );

  const affectedCookies = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(reshapedCookies).filter(([, cookie]) => cookie.isBlocked)
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

      _data['sitemap-landing-page'].panel = () => (
        <CookiesLandingContainer
          tabCookies={reshapedCookies}
          tabFrames={frames}
          affectedCookies={affectedCookies}
          downloadReport={() => {
            if (!Array.isArray(completeJson)) {
              return;
            }

            generateSiteMapReportandDownload(completeJson);
          }}
        />
      );

      _data['sitemap-landing-page'].children = sites.reduce(
        (acc: SidebarItems, site: string) => {
          acc[site] = {
            title: site,
            panel: () => (
              <SiteReport
                cookies={siteFilteredCookies}
                technologies={siteFilteredTechnologies}
                completeJson={completeJson}
                selectedSite={site}
              />
            ),
            children: {},
            icon: () => <File />,
            selectedIcon: () => <FileWhite />,
          };

          return acc;
        },
        {}
      );

      _data['sitemap-affected-cookies'].panel = () => (
        <SiteMapAffectedCookies
          cookies={Object.values(reshapedCookies).filter(
            (cookie) => cookie.isBlocked
          )}
        />
      );

      return _data;
    });
  }, [
    affectedCookies,
    completeJson,
    frames,
    isKeySelected,
    reshapedCookies,
    setSidebarData,
    siteFilteredCookies,
    siteFilteredTechnologies,
    sites,
  ]);

  useEffect(() => {
    if (selectedItemKey === null && Object.keys(sidebarData).length > 0) {
      updateSelectedItemKey('sitemap-landing-page');
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
        {activePanel.element?.()}
      </div>
    </div>
  );
};

export default Layout;
