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
  prepareCookieStatsComponents,
  prepareCookiesCount,
  type DataMapping,
  useFiltersMapping,
  MatrixContainer,
  CookiesLandingWrapper,
  type MatrixComponentProps,
  LEGEND_DESCRIPTION,
  InfoIcon,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useCookie } from '../../../stateProviders';

const ExemptedCookiesSection = () => {
  const { tabCookies, tabFrames } = useCookie(({ state }) => ({
    tabCookies: state.tabCookies,
    tabFrames: state.tabFrames,
  }));

  const { selectedItemUpdater } = useFiltersMapping(tabFrames || {});

  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.exemptedCookiesLegend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: legendDescription,
        title: component.label,
        containerClasses: '',
        onClick: (title: string) => {
          selectedItemUpdater(title, 'exemptionReason');
        },
      };
    });
  const exemptedCookiesDataMapping: DataMapping[] = [
    {
      title: 'Exempted cookies',
      count: cookieStats.exemptedCookies.total,
      data: cookiesStatsComponents.exempted,
      onClick: () => selectedItemUpdater('All', 'exemptionReason'),
    },
  ];

  const description = !cookieStats.exemptedCookies.total ? (
    <div className="flex gap-1 justify-center items-center">
      No cookies were exempted by the browser.
      <span title="Exempted cookies are only available in 3PCD browser.">
        <InfoIcon className="fill-granite-gray" />
      </span>
    </div>
  ) : (
    ''
  );

  return (
    <CookiesLandingWrapper
      description={description}
      dataMapping={exemptedCookiesDataMapping}
      testId="blocked-cookies-insights"
    >
      {dataComponents.length > 0 && (
        <MatrixContainer
          title="Exemption Reasons"
          matrixData={dataComponents}
          infoIconTitle="Cookies that should have been blocked by the browser but was exempted."
        />
      )}
    </CookiesLandingWrapper>
  );
};
export default ExemptedCookiesSection;
