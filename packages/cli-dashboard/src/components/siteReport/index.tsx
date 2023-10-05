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
import React from 'react';

/**
 * Internal dependencies.
 */
import { Provider as ContentStoreProvider } from './stateProviders/contentStore';
import Layout from './components/layout';
import type { TechnologyData } from '@cookie-analysis-tool/common';
import type { CookieJsonDataType } from '../../types';

interface SiteReportProps {
  cookies: {
    [frame: string]: {
      [key: string]: CookieJsonDataType;
    };
  };
  technologies: TechnologyData[];
}

const SiteReport = ({ cookies, technologies }: SiteReportProps) => {
  return (
    <ContentStoreProvider cookies={cookies} technologies={technologies}>
      <Layout />
    </ContentStoreProvider>
  );
};

export default SiteReport;
