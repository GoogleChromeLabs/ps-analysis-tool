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
import {
  CookiesLandingWrapper,
  type DataMapping,
  prepareCookieStatsComponents,
  prepareCookiesCount,
  MatrixContainer,
  type MatrixComponentProps,
  LEGEND_DESCRIPTION,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useCookieStore } from '../../../stateProviders/syncCookieStore';
import { useSettingsStore } from '../../../stateProviders/syncSettingsStore';
import useSidebarQuery from './useSidebarQuery';

const BlockedCookiesSection = () => {
  const { tabCookies } = useCookieStore(({ state }) => ({
    tabCookies: state.tabCookies,
  }));

  const { isUsingCDP } = useSettingsStore(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  const { selectedItemUpdater } = useSidebarQuery();

  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
      onClick: () => selectedItemUpdater('All', 'blockedReasons'),
    },
  ];
  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.blockedCookiesLegend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: legendDescription,
        title: component.label,
        containerClasses: '',
        onClick: (title: string) =>
          selectedItemUpdater(title, 'blockedReasons'),
      };
    });

  const description = !isUsingCDP ? (
    <>
      To gather data and insights regarding blocked cookies, please enable PSAT
      to use the Chrome DevTools protocol. You can do this in the Settings page
      or in the extension popup. For more information check the PSAT&nbsp;
      <a
        target="_blank"
        rel="noreferrer"
        className="text-bright-navy-blue dark:text-jordy-blue"
        href="https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki"
      >
        Wiki
      </a>
    </>
  ) : (
    ''
  );

  return (
    <CookiesLandingWrapper
      description={description}
      dataMapping={blockedCookieDataMapping}
      testId="blocked-cookies-insights"
    >
      {dataComponents.length > 0 && (
        <MatrixContainer
          title="Blocked Reasons"
          matrixData={dataComponents}
          infoIconTitle="Cookies that have been blocked by the browser.(The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
        />
      )}
    </CookiesLandingWrapper>
  );
};
export default BlockedCookiesSection;
