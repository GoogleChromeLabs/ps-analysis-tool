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
import React, { useCallback, useMemo } from 'react';
import {
  type TabFrames,
  type DataMapping,
  getLegendDescription,
  TabCookies,
} from '@google-psat/common';
/**
 * Internal dependencies
 */
import { type MatrixComponentProps } from '../../../../../../../matrix/matrixComponent';
import useFiltersMapping from '../../../../../../../cookiesLanding/useFiltersMapping';
import {
  prepareCookiesCount,
  prepareCookieStatsComponents,
} from '../../../../../../../../utils';
import CookiesLandingWrapper from '../../../../../../../cookiesLanding/cookiesLandingWrapper';
import MatrixContainer from '../../../../../../../matrixContainer';
import { InfoIcon } from '../../../../../../../../icons';
import { LEGEND_DESCRIPTION } from '../../../../../../../../constants';
import { I18n } from '@google-psat/i18n';

interface ExemptedCookiesSectionProps {
  tabCookies: TabCookies | null;
  tabFrames: TabFrames | null;
}

const ExemptedCookiesSection = ({
  tabCookies,
  tabFrames,
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
      };
    });

  const exemptedCookiesDataMapping: DataMapping[] = [
    {
      title: 'Exempted cookies',
      count: cookieStats.exemptedCookies.total,
      data: cookiesStatsComponents.exempted,
      onClick:
        cookieStats.exemptedCookies.total > 0
          ? () => selectedItemUpdater('All', 'exemptionReason')
          : null,
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
