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
import type {
  CookieTableData,
  SelectedFilters,
} from '@ps-analysis-tool/common';

/**
 * Internal dependencies.
 */
import { FILTER_MAPPING, CUSTOM_FILTER_MAPPING } from '../constants';
import getFilterValue from './getFilterValue';

const filterCookiesWithoutRetentionPeriod = (
  cookies: {
    [key: string]: CookieTableData;
  },
  selectedFilters: SelectedFilters,
  searchTerm = ''
): {
  [key: string]: CookieTableData;
} => {
  const filteredCookies: {
    [key: string]: CookieTableData;
  } = {};

  if (!cookies || (!searchTerm && !Object.keys(selectedFilters).length)) {
    return cookies;
  }

  Object.entries(cookies).forEach(([cookieName, cookieData]) => {
    const canShow: boolean[] = [];

    const matchTerm = () => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      return (
        cookieName.toLowerCase().includes(lowerCaseTerm) ||
        cookieData.parsedCookie.domain?.toLowerCase()?.includes(lowerCaseTerm)
      );
    };

    if (Object.keys(selectedFilters).length) {
      // eslint-disable-next-line complexity
      Object.entries(selectedFilters).forEach(([keys, selectedFilter]) => {
        if (
          keys !== CUSTOM_FILTER_MAPPING.retentionPeriod.keys &&
          keys !== CUSTOM_FILTER_MAPPING.scope.keys &&
          keys !== CUSTOM_FILTER_MAPPING.setVia.keys &&
          keys !== CUSTOM_FILTER_MAPPING.samesite.keys &&
          keys !== CUSTOM_FILTER_MAPPING.priority.keys
        ) {
          let value = getFilterValue(keys, cookieData);
          const filterMap = FILTER_MAPPING.find(
            (config) => config.keys === keys
          );

          if ('boolean' === filterMap?.type) {
            value = value ? 'True' : 'False';
          }

          if (!value && filterMap?.default) {
            value = filterMap.default;
          }

          canShow.push(selectedFilter?.has(String(value)));
        } else if (keys === CUSTOM_FILTER_MAPPING.scope.keys) {
          if (
            selectedFilter.has('Third Party') &&
            !selectedFilter.has('First Party')
          ) {
            canShow.push(!cookieData.isFirstParty);
          } else if (
            !selectedFilter.has('Third Party') &&
            selectedFilter.has('First Party')
          ) {
            canShow.push(Boolean(cookieData.isFirstParty));
          } else {
            canShow.push(true);
          }
        } else if (keys === CUSTOM_FILTER_MAPPING.setVia.keys) {
          if (selectedFilter.has('HTTP') && !selectedFilter.has('JS')) {
            canShow.push(
              cookieData.headerType === 'request' ||
                cookieData.headerType === 'response'
            );
          } else if (selectedFilter.has('JS') && !selectedFilter.has('HTTP')) {
            canShow.push(cookieData.headerType === 'javascript');
          }
        } else if (keys === CUSTOM_FILTER_MAPPING.samesite.keys) {
          let canBeShown = false;
          if (selectedFilter.has('None') && !canBeShown) {
            canBeShown =
              cookieData.parsedCookie.samesite?.toLowerCase() === 'none';
          }
          if (selectedFilter.has('Strict') && !canBeShown) {
            canBeShown =
              cookieData.parsedCookie.samesite?.toLowerCase() === 'strict';
          }
          if (selectedFilter.has('Lax') && !canBeShown) {
            canBeShown =
              cookieData.parsedCookie.samesite?.toLowerCase() === 'lax';
          }
          canShow.push(canBeShown);
        } else if (keys === CUSTOM_FILTER_MAPPING.priority.keys) {
          let canBeShown = false;
          if (selectedFilter.has('Low') && !canBeShown) {
            canBeShown = cookieData.parsedCookie?.priority === 'Low';
          }
          if (selectedFilter.has('Medium') && !canBeShown) {
            canBeShown = cookieData.parsedCookie?.priority === 'Medium';
          }
          if (selectedFilter.has('High') && !canBeShown) {
            canBeShown = cookieData.parsedCookie?.priority === 'High';
          }
          canShow.push(canBeShown);
        }
      });

      if (canShow.length > 0 && !canShow.includes(false)) {
        if (searchTerm) {
          if (matchTerm()) {
            filteredCookies[cookieName] = cookieData;
          }
        } else {
          filteredCookies[cookieName] = cookieData;
        }
      }
    } else {
      if (matchTerm()) {
        filteredCookies[cookieName] = cookieData;
      }
    }
  });

  return filteredCookies;
};

export default filterCookiesWithoutRetentionPeriod;
