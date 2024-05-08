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
 * External dependencies.
 */
import {
  createContext,
  type CookieStatsComponents,
  type FrameStateCreator,
  type TabCookies,
  type TabFrames,
  type DataMapping,
  type LibraryData,
} from '@ps-analysis-tool/common';

export interface DataStoreContext {
  state: {
    isDataLoaded: boolean;
    data: {
      cookieClassificationDataMapping: DataMapping[];
      cookiesStatsComponents: CookieStatsComponents;
      tabCookies: TabCookies;
      tabFrames: TabFrames;
      showInfoIcon: boolean;
      showHorizontalMatrix: boolean;
      blockedCookieDataMapping: DataMapping[];
      showBlockedInfoIcon: boolean;
      frameStateCreator: FrameStateCreator;
      libraryMatches: LibraryData;
      exemptedCookiesDataMapping: DataMapping[];
      showFramesSection: boolean;
      showBlockedCategory: boolean;
    } | null;
  };
}

const initialState: DataStoreContext = {
  state: {
    data: {
      cookieClassificationDataMapping: [],
      cookiesStatsComponents: {
        legend: [],
        blockedCookiesLegend: [],
        firstParty: [],
        thirdParty: [],
        blocked: [],
        exemptedCookiesLegend: [],
        exempted: [],
      },
      tabCookies: {},
      tabFrames: {},
      showInfoIcon: false,
      showHorizontalMatrix: false,
      blockedCookieDataMapping: [],
      showBlockedInfoIcon: false,
      frameStateCreator: {
        dataMapping: [],
        legend: [],
      },
      libraryMatches: {},
      exemptedCookiesDataMapping: [],
      showBlockedCategory: false,
      showFramesSection: false,
    },
    isDataLoaded: false,
  },
};

export default createContext<DataStoreContext>(initialState);
