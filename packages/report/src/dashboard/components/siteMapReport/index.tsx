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
import { useState } from 'react';
import type {
  CookieFrameStorageType,
  CompleteJson,
  LibraryData,
  ErroredOutUrlsData,
} from '@google-psat/common';
import { SidebarProvider, type SidebarItems } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import sidebarData from './sidebarData';
import Layout from './layout';

interface SiteMapReportProps {
  landingPageCookies: CookieFrameStorageType;
  completeJson: CompleteJson[] | null;
  path: string;
  libraryMatches: { [url: string]: LibraryData } | null;
  erroredOutUrls: ErroredOutUrlsData[];
}

const SiteMapReport = ({
  landingPageCookies,
  completeJson,
  path,
  libraryMatches,
  erroredOutUrls,
}: SiteMapReportProps) => {
  const [data, setData] = useState<SidebarItems>(sidebarData);

  return (
    <SidebarProvider data={data}>
      <Layout
        erroredOutUrls={erroredOutUrls}
        landingPageCookies={landingPageCookies}
        completeJson={completeJson}
        sidebarData={data}
        setSidebarData={setData}
        path={path}
        libraryMatches={libraryMatches}
      />
    </SidebarProvider>
  );
};

export default SiteMapReport;
