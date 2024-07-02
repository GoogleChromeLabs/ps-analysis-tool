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
import React, { useMemo } from 'react';
import {
  CookiesLandingWrapper,
  CookiesMatrix,
  MessageBox,
  prepareCookieDataMapping,
  prepareCookieStatsComponents,
  prepareCookiesCount,
  useFiltersMapping,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
/**
 * Internal dependencies
 */
import { useCookie } from '../../../stateProviders';
import type { TabCookies } from '@google-psat/common';

interface CookiesSectionProps {
  tabCookies: TabCookies;
}

const CookiesSection = ({ tabCookies }: CookiesSectionProps) => {
  const { tabFrames } = useCookie(({ state }) => ({
    tabFrames: state.tabFrames,
  }));

  const { selectedItemUpdater } = useFiltersMapping(tabFrames || {});

  const cookieStats = prepareCookiesCount(tabCookies);
  const cookiesStatsComponents = prepareCookieStatsComponents(cookieStats);
  const cookieClassificationDataMapping = prepareCookieDataMapping(
    cookieStats,
    cookiesStatsComponents,
    selectedItemUpdater
  );

  const cookieComponentData = useMemo(() => {
    return cookiesStatsComponents.legend.map((component) => ({
      ...component,
      onClick: (title: string) =>
        selectedItemUpdater(title, 'analytics.category'),
    }));
  }, [cookiesStatsComponents.legend, selectedItemUpdater]);

  const processedTabFrames = useMemo(
    () => Object.fromEntries(Object.entries(tabFrames || {})),
    [tabFrames]
  );

  return (
    <CookiesLandingWrapper
      dataMapping={cookieClassificationDataMapping}
      infoIconTitle={
        <p
          dangerouslySetInnerHTML={{
            __html: I18n.getMessage('setUpEvaluationEnvironment', [
              '<a href="https://github.com/GoogleChromeLabs/ps-analysis-tool/wiki/Evaluation-Environment" target="_blank" rel="noreferrer" class="text-bright-navy-blue dark:text-jordy-blue">',
              '</a>',
            ]),
          }}
        />
      }
      testId="cookies-insights"
    >
      {!cookieStats ||
        (cookieStats?.firstParty.total === 0 &&
          cookieStats?.thirdParty.total === 0 && (
            <MessageBox
              headerText={I18n.getMessage('noCookies')}
              bodyText={I18n.getMessage('tryReloading')}
            />
          ))}
      <CookiesMatrix
        tabCookies={tabCookies}
        componentData={cookieComponentData}
        tabFrames={processedTabFrames}
        showHorizontalMatrix={false}
      />
    </CookiesLandingWrapper>
  );
};
export default CookiesSection;
