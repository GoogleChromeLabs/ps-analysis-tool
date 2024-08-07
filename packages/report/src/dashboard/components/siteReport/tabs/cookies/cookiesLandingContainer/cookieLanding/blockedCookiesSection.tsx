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
import { useCallback } from 'react';
import {
  type TabCookies,
  type TabFrames,
  type DataMapping,
  getLegendDescription,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  LEGEND_DESCRIPTION,
  useFiltersMapping,
  CookiesLandingWrapper,
  MatrixContainer,
  type MatrixComponentProps,
} from '@google-psat/design-system';

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

  const selectTabFrame = useCallback(
    (blockedReason: string) => {
      const cookie = Object.values(tabCookies || {}).find((_cookie) => {
        // @ts-ignore - blockedReasons is a string array
        if (_cookie.blockedReasons?.includes(blockedReason)) {
          return true;
        }

        return false;
      });

      return cookie?.pageUrl || '';
    },
    [tabCookies]
  );

  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.blockedCookiesLegend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: getLegendDescription(legendDescription),
        title: component.label,
        containerClasses: '',
        onClick: (title: string) =>
          selectedItemUpdater(title, 'blockedReasons', selectTabFrame(title)),
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
        description: getLegendDescription(legendDescription),
        title: component.label,
        containerClasses: '',
        onClick: (title: string) => {
          multiSelectItemUpdater({
            blockedReasons: [I18n.getMessage('selectAll')],
            'analytics.category': [title],
          });
        },
      };
    });

  const description =
    blockedCookiesStats.blockedCookies.total === 0
      ? 'No cookies were blocked by the browser.'
      : '';

  return (
    <CookiesLandingWrapper
      description={description}
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
          {
            //@ts-ignore -- PSAT_EXTENSTION is added only when the report is downloaded from the extension. Since optional chaining is done it will return false if it doesnt exist.
            !globalThis?.PSAT_EXTENSION && (
              <div className="flex flex-col mt-8">
                <div className="pt-4">
                  <MatrixContainer
                    matrixData={blockedDataComponents}
                    allowExpand={false}
                  />
                </div>
              </div>
            )
          }
        </>
      )}
    </CookiesLandingWrapper>
  );
};
export default BlockedCookiesSection;
