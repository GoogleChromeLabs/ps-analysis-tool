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
import type { CookieTableData } from '@google-psat/common';

/**
 * Internal dependencies.
 */
import CookiesWithIssues from '../cookiesWithIssues';

interface SiteMapCookiesWithIssuesProps {
  cookies: CookieTableData[];
  path: string;
}

const SiteMapCookiesWithIssues = ({
  cookies,
  path,
}: SiteMapCookiesWithIssuesProps) => {
  return (
    <CookiesWithIssues cookies={cookies} selectedSite={null} hostName={path} />
  );
};

export default SiteMapCookiesWithIssues;
