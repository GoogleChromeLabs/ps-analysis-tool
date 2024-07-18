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
import React, { useState } from 'react';
import {
  noop,
  type CompleteJson,
  type CookieJsonDataType,
  type LibraryData,
  type TechnologyData,
} from '@google-psat/common';
import { SidebarProvider, type SidebarItems } from '@google-psat/design-system';

/**
 * Internal dependencies.
 */
import { Provider as ContentStoreProvider } from './stateProviders/contentStore';
import Layout from './components/layout';
import Tabs from './tabs';

interface SiteReportProps {
  cookies: {
    [frame: string]: {
      [key: string]: CookieJsonDataType;
    };
  };
  technologies: TechnologyData[];
  completeJson: CompleteJson[] | null;
  selectedSite: string | null;
  path: string;
  libraryMatches: LibraryData | null;
  query?: string;
  clearQuery?: () => void;
}

const SiteReport = ({
  cookies,
  technologies,
  completeJson,
  selectedSite,
  path,
  libraryMatches,
  query = '',
  clearQuery = noop,
}: SiteReportProps) => {
  const [data, setData] = useState<SidebarItems>(Tabs);

  return (
    <ContentStoreProvider
      cookies={cookies}
      technologies={technologies}
      completeJson={completeJson}
      libraryMatches={libraryMatches}
      path={path}
    >
      <SidebarProvider data={data}>
        <Layout
          selectedSite={selectedSite}
          setSidebarData={setData}
          query={query}
          clearQuery={clearQuery}
        />
      </SidebarProvider>
    </ContentStoreProvider>
  );
};

export default SiteReport;
