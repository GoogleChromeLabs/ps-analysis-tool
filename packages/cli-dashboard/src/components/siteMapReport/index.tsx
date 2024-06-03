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
import React, { useState } from 'react';
import {
  SidebarProvider,
  type SidebarItems,
} from '@ps-analysis-tool/design-system';
import {
  type TechnologyData,
  type CookieFrameStorageType,
  type CompleteJson,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import sidebarData from './sidebarData';
import Layout from './layout';

interface SiteMapReportProps {
  landingPageCookies: CookieFrameStorageType;
  cookies: CookieFrameStorageType;
  technologies: TechnologyData[];
  completeJson: CompleteJson[] | null;
  path: string;
}

const SiteMapReport = ({
  cookies,
  technologies,
  landingPageCookies,
  completeJson,
  path,
}: SiteMapReportProps) => {
  const [data, setData] = useState<SidebarItems>(sidebarData);

  return (
    <SidebarProvider data={data}>
      <Layout
        landingPageCookies={landingPageCookies}
        cookies={cookies}
        technologies={technologies}
        completeJson={completeJson}
        sidebarData={data}
        setSidebarData={setData}
        path={path}
      />
    </SidebarProvider>
  );
};

export default SiteMapReport;
