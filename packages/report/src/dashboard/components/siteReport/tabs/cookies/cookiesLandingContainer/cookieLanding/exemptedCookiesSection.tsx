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
import { useCallback, useMemo } from 'react';
import {
  type TabFrames,
  type DataMapping,
  getLegendDescription,
  type TabCookies,
} from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  useFiltersMapping,
  CookiesLandingWrapper,
  InfoIcon,
  MatrixContainer,
  LEGEND_DESCRIPTION,
  type MatrixComponentProps,
} from '@google-psat/design-system';

interface ExemptedCookiesSectionProps {
  tabCookies: TabCookies | null;
  tabFrames: TabFrames | null;
  isFilterValueSelected: (accessorKey: string, filterValue: string) => boolean;
}

const ExemptedCookiesSection = ({
  tabCookies,
  tabFrames,
  isFilterValueSelected,
}: ExemptedCookiesSectionProps) => {
  const { selectedItemUpdater } = useFiltersMapping(tabFrames || {});
  const cookieStats = useMemo(
    () => prepareCookiesCount(tabCookies),
    [tabCookies]
  );
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);

  const selectTabFrame = useCallback(
    (exemptionReason: string) => {
      const cookie = Object.values(tabCookies || {}).find((_cookie) => {
        // @ts-ignore - exemptionReasons is a string array

        if (_cookie.exemptionReason === exemptionReason) {
          return true;
        }

        return false;
      });

      return cookie?.pageUrl || '';
    },
    [tabCookies]
  );

  const dataComponents: MatrixComponentProps[] =
    cookiesStatsComponents.exemptedCookiesLegend.map((component) => {
      const legendDescription = LEGEND_DESCRIPTION[component.label] || '';
      return {
        ...component,
        description: getLegendDescription(legendDescription),
        title: component.label,
        containerClasses: '',
        onClick: (title: string) => {
          selectedItemUpdater(title, 'exemptionReason', selectTabFrame(title));
        },
        isSelected: (title: string) =>
          isFilterValueSelected('exemptionReason', title),
      };
    });

  const exemptedCookiesDataMapping: DataMapping[] = [
    {
      title: I18n.getMessage('exemptedCookies'),
      count: cookieStats.exemptedCookies.total,
      data: cookiesStatsComponents.exempted,
      onClick:
        cookieStats.exemptedCookies.total > 0
          ? () =>
              selectedItemUpdater(
                I18n.getMessage('selectAll'),
                'exemptionReason'
              )
          : null,
    },
  ];

  const description = !cookieStats.exemptedCookies.total ? (
    <div className="flex gap-1 justify-center items-center">
      {I18n.getMessage('noCookiesExempted')}
      <span title={I18n.getMessage('exemptedCookiesIn3PCD')}>
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
    >
      {dataComponents.length > 0 && (
        <MatrixContainer
          title={I18n.getMessage('exemptionReasons')}
          matrixData={dataComponents}
          infoIconTitle={I18n.getMessage('exemptionReasonsNote')}
        />
      )}
    </CookiesLandingWrapper>
  );
};

export default ExemptedCookiesSection;
