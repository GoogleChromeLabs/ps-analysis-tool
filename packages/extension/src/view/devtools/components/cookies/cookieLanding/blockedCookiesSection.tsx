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
  useFiltersMapping,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
} from '@ps-analysis-tool/design-system';
import { I18n } from '@ps-analysis-tool/i18n';
/**
 * Internal dependencies
 */
import { useCookie, useSettings } from '../../../stateProviders';

const BlockedCookiesSection = () => {
  const { tabCookies, tabFrames } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
  }));

  const { isUsingCDP } = useSettings(({ state }) => ({
    isUsingCDP: state.isUsingCDP,
  }));

  // Callback selecting/updating the clicked item in the sidebar
  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  // For opening Cookies table with pre-filtered data, uses updateSelectedItemKey from useSidebar internally
  const { selectedItemUpdater } = useFiltersMapping(tabFrames || {});

  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('blockedCookies'),
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
      onClick:
        cookieStats.blockedCookies.total > 0
          ? () =>
              selectedItemUpdater(
                I18n.getMessage('selectAll'),
                'blockedReasons'
              )
          : null,
    },
  ];
  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.blockedCookiesLegend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description:
          typeof legendDescription === 'string'
            ? I18n.getMessage(legendDescription)
            : I18n.getFormattedMessages(legendDescription),
        title: component.label,
        containerClasses: '',
        onClick: (title: string) =>
          selectedItemUpdater(title, 'blockedReasons'),
      };
    });

  const description = !isUsingCDP ? (
    <>
      {I18n.getMessage('notUsingCDP')}&nbsp;
      <button
        className="text-bright-navy-blue dark:text-jordy-blue"
        onClick={() => {
          document
            .getElementById('cookies-landing-scroll-container')
            ?.scrollTo(0, 0);
          updateSelectedItemKey(SIDEBAR_ITEMS_KEYS.SETTINGS);
        }}
      >
        {I18n.getMessage('settingsPage')}
      </button>
      . <br />
      {I18n.getMessage('visitPSAT')}&nbsp;
      <a
        target="_blank"
        rel="noreferrer"
        className="text-bright-navy-blue dark:text-jordy-blue"
        href="https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki"
      >
        {I18n.getMessage('wiki')}
      </a>
      .
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
          title={I18n.getMessage('blockedReasons')}
          matrixData={dataComponents}
          infoIconTitle={I18n.getMessage('cookiesBlockedNote')}
        />
      )}
    </CookiesLandingWrapper>
  );
};
export default BlockedCookiesSection;
