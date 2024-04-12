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
import type {
  CookieStatsComponents,
  CookiesCount,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies
 */
import { DataMapping } from '../components/cookiesLanding/landingHeader';
import { I18n } from '@ps-analysis-tool/i18n';

/**
 * Calcualte insights about frames to be shown on cookies landing page.
 * @param {CookiesCount} cookieStats The calculated cookie count for each type.
 * @param {CookieStatsComponents} cookiesStatsComponents cookies statistics of curent tab with the legend data.
 * @param selectedItemUpdater The function to update the selected item.
 * @returns {DataMapping[]} Mapped data array for displaying the landing header.
 */
export default function prepareCookieDataMapping(
  cookieStats: CookiesCount,
  cookiesStatsComponents: CookieStatsComponents,
  selectedItemUpdater: (title: string, accessorKey?: string) => void
): DataMapping[] {
  return [
    {
      title: I18n.getMessage('dsTotalCookies'),
      count: cookieStats.total,
      data: cookiesStatsComponents.legend,
      onClick: () => selectedItemUpdater('', 'isFirstParty'), // title is empty as we don't want to select any filter.
    },
    {
      title: I18n.getMessage('dsFirstPartyCookies'),
      count: cookieStats.firstParty.total,
      data: cookiesStatsComponents.firstParty,
      onClick: () =>
        selectedItemUpdater(I18n.getMessage('dsFirstParty'), 'isFirstParty'),
    },
    {
      title: I18n.getMessage('dsThirdPartyCookies'),
      count: cookieStats.thirdParty.total,
      data: cookiesStatsComponents.thirdParty,
      onClick: () =>
        selectedItemUpdater(I18n.getMessage('dsThirdParty'), 'isFirstParty'),
    },
  ];
}
