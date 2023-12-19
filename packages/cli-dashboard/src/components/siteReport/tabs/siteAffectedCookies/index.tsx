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
 * Internal dependencies
 */
import AffectedCookies from '../../../affectedCookies';
import { useContentStore } from '../../stateProviders/contentStore';

interface SiteAffectedCookiesProps {
  selectedSite: string | null;
}

const SiteAffectedCookies = ({ selectedSite }: SiteAffectedCookiesProps) => {
  const { tabCookies } = useContentStore(({ state }) => ({
    tabCookies: Object.values(state.tabCookies).filter(
      (cookie) => cookie.isBlocked
    ),
  }));

  return <AffectedCookies cookies={tabCookies} selectedSite={selectedSite} />;
};

export default SiteAffectedCookies;
