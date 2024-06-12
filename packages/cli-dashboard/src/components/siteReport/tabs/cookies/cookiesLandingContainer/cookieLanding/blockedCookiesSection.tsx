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
} from '@ps-analysis-tool/design-system';
import type { TabCookies, TabFrames } from '@ps-analysis-tool/common';
import { I18n } from '@ps-analysis-tool/i18n';

interface BlockedCookiesSectionProps {
  tabCookies: TabCookies | null;
  cookiesWithIssues: TabCookies | null;
  tabFrames: TabFrames | null;
}

const BlockedCookiesSection = ({
  tabCookies,
  cookiesWithIssues,
  tabFrames,
}: BlockedCookiesSectionProps) => {
  const { selectedItemUpdater, multiSelectItemUpdater } = useFiltersMapping(
    tabFrames || {}
  );
  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const blockedCookieDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('blockedCookies'),
      count: cookieStats.blockedCookies.total,
      data: cookiesStatsComponents.blocked,
      onClick: () =>
        selectedItemUpdater(I18n.getMessage('selectAll'), 'blockedReasons'),
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

  const blockedCookiesStats = prepareCookiesCount(cookiesWithIssues);
  const blockedCookiesStatsComponents =
    prepareCookieStatsComponents(blockedCookiesStats);
  const blockedDataComponents: MatrixComponentProps[] =
    blockedCookiesStatsComponents.legend.map((component) => {
      const legendDescription =
        LEGEND_DESCRIPTION[component.descriptionKey || ''];
      return {
        ...component,
        description:
          typeof legendDescription === 'string'
            ? I18n.getMessage(legendDescription)
            : I18n.getFormattedMessages(legendDescription),
        title: component.label,
        containerClasses: '',
        onClick: (title: string) => {
          multiSelectItemUpdater({
            blockedReasons: ['All'],
            'analytics.category': [title],
          });
        },
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
            title={I18n.getMessage('blockedCookies')}
            matrixData={dataComponents}
            infoIconTitle={I18n.getMessage('blockedReasonsNote')}
          />
          <div className="flex flex-col mt-8">
            <div className="pt-4">
              <MatrixContainer
                matrixData={blockedDataComponents}
                allowExpand={false}
              />
            </div>
          </div>
        </>
      )}
    </CookiesLandingWrapper>
  );
};
export default BlockedCookiesSection;
