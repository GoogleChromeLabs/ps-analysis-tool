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
import { useMemo } from 'react';
import type { TabCookies, TabFrames } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  prepareCookieStatsComponents,
  prepareCookiesCount,
  useFiltersMapping,
  CookiesLandingWrapper,
  prepareCookieDataMapping,
  MessageBox,
  CookiesMatrix,
} from '@google-psat/design-system';

interface CookiesSectionProps {
  tabCookies: TabCookies | null;
  tabFrames: TabFrames | null;
}
const CookiesSection = ({ tabCookies, tabFrames }: CookiesSectionProps) => {
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

  return (
    <CookiesLandingWrapper
      dataMapping={cookieClassificationDataMapping}
      testId="cookies-insights"
      landingHeaderExtraClasses="border-t-0"
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
        tabFrames={tabFrames}
        showHorizontalMatrix={false}
      />
    </CookiesLandingWrapper>
  );
};
export default CookiesSection;
