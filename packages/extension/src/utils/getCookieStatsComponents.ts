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
 * Internal dependencies.
 */
import { COLOR_MAP } from '../view/design-system/theme/colors';

export const getCookieStatsComponents = (cookiesData) => {
  return {
    legend: [
      {
        label: 'Functional',
        count:
          cookiesData.firstParty.functional + cookiesData.thirdParty.functional,
        color: COLOR_MAP.functional,
      },
      {
        label: 'Marketing',
        count:
          cookiesData.firstParty.marketing + cookiesData.thirdParty.marketing,
        color: COLOR_MAP.marketing,
      },
      {
        label: 'Analytics',
        count:
          cookiesData.firstParty.analytics + cookiesData.thirdParty.analytics,
        color: COLOR_MAP.analytics,
      },
      {
        label: 'Uncategorised',
        count:
          cookiesData.firstParty.uncategorised +
          cookiesData.thirdParty.uncategorised,
        color: COLOR_MAP.uncategorised,
      },
    ],
    firstParty: [
      {
        count: cookiesData.firstParty.functional,
        color: COLOR_MAP.functional,
      },
      {
        count: cookiesData.firstParty.marketing,
        color: COLOR_MAP.marketing,
      },
      {
        count: cookiesData.firstParty.analytics,
        color: COLOR_MAP.analytics,
      },
      {
        count: cookiesData.firstParty.uncategorised,
        color: COLOR_MAP.uncategorised,
      },
    ],
    thirdParty: [
      {
        count: cookiesData.thirdParty.functional,
        color: COLOR_MAP.functional,
      },
      {
        count: cookiesData.thirdParty.marketing,
        color: COLOR_MAP.marketing,
      },
      {
        count: cookiesData.thirdParty.analytics,
        color: COLOR_MAP.analytics,
      },
      {
        count: cookiesData.thirdParty.uncategorised,
        color: COLOR_MAP.uncategorised,
      },
    ],
  };
};
