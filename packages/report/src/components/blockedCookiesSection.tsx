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
  LEGEND_DESCRIPTION,
  MatrixContainer,
  prepareCookieStatsComponents,
  prepareCookiesCount,
  type MatrixComponentProps,
} from '@ps-analysis-tool/design-system';
/**
 * Internal dependencies
 */
import { useData } from '../stateProviders/data';
import type { DataMapping } from '@ps-analysis-tool/common';

const CookiesSection = () => {
  const data = useData(({ state }) => state.data);

  if (!data) {
    return <></>;
  }

  const cookieStats = prepareCookiesCount(data.tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: 'Blocked cookies',
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];
  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.blockedCookiesLegend.map((component: any) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: legendDescription,
        title: component.label,
        containerClasses: '',
      };
    });

  const blockedCookiesStats = prepareCookiesCount(
    Object.fromEntries(
      Object.entries(data.tabCookies).filter(([, cookie]) => cookie.isBlocked)
    )
  );
  const blockedCookiesStatsComponents =
    prepareCookieStatsComponents(blockedCookiesStats);
  const blockedDataComponents: MatrixComponentProps[] =
    blockedCookiesStatsComponents.legend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: legendDescription,
        title: component.label,
        containerClasses: '',
      };
    });

  return (
    <CookiesLandingWrapper
      dataMapping={blockedCookieDataMapping}
      testId="blocked-cookies-insights"
    >
      {dataComponents.length > 0 && (
        <>
          <MatrixContainer
            title="Blocked Reasons"
            matrixData={dataComponents}
            infoIconTitle="Cookies that have been blocked by the browser. (The total count might not be same as cumulative reason count because cookie might be blocked due to more than 1 reason)."
          />
          {data.showBlockedCategory && (
            <div className="flex flex-col mt-8">
              <div className="pt-4">
                <MatrixContainer
                  matrixData={blockedDataComponents}
                  allowExpand={false}
                />
              </div>
            </div>
          )}
        </>
      )}
    </CookiesLandingWrapper>
  );
};

export default CookiesSection;
