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
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import { useData } from '../stateProviders/data';
import type { DataMapping } from '@google-psat/common';

const CookiesSection = () => {
  const data = useData(({ state }) => state.data);

  if (!data) {
    return <></>;
  }

  const cookieStats = prepareCookiesCount(data.tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('blockedCookies'),
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
    },
  ];
  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.blockedCookiesLegend.map((component: any) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description:
          typeof legendDescription === 'string'
            ? legendDescription.includes(' ')
              ? legendDescription
              : I18n.getMessage(legendDescription)
            : I18n.getFormattedMessages(legendDescription),
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
        description:
          typeof legendDescription === 'string'
            ? I18n.getMessage(legendDescription)
            : I18n.getFormattedMessages(legendDescription),
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
            title={I18n.getMessage('blockedReasons')}
            matrixData={dataComponents}
            infoIconTitle={I18n.getMessage('cookiesBlockedNote')}
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
