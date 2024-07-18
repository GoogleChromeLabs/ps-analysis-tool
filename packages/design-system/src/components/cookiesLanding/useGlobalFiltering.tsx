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
import { useMemo } from 'react';
import type { CookieTableData } from '@google-psat/common';
import {
  calculateBlockedReasonsFilterValues,
  calculateExemptionReason,
  evaluateSelectAllOption,
  evaluateStaticFilterValues,
  useFiltering,
  type InfoType,
  type TableFilter,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

const useGlobalFiltering = (
  cookies: CookieTableData[],
  query: string,
  clearQuery: () => void
) => {
  const parsedQuery = useMemo(() => {
    if (query) {
      return JSON.parse(query);
    }

    return {};
  }, [query]);

  const filters = useMemo<TableFilter>(
    () => ({
      'analytics.category': {
        title: I18n.getMessage('category'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('analytics')]: {
              selected: false,
            },
            [I18n.getMessage('functional')]: {
              selected: false,
            },
            [I18n.getMessage('marketing')]: {
              selected: false,
            },
            [I18n.getMessage('uncategorized')]: {
              selected: false,
            },
          },
          'analytics.category',
          parsedQuery,
          clearQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return (
            I18n.getMessage(val?.toLowerCase() || 'uncategorized') ===
            filterValue
          );
        },
      },
      isFirstParty: {
        title: I18n.getMessage('scope'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: evaluateStaticFilterValues(
          {
            [I18n.getMessage('firstParty')]: {
              selected: false,
            },
            [I18n.getMessage('thirdParty')]: {
              selected: false,
            },
          },
          'isFirstParty',
          parsedQuery,
          clearQuery
        ),
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = Boolean(value);
          return val === (filterValue === I18n.getMessage('firstParty'));
        },
      },
      blockedReasons: {
        title: I18n.getMessage('blockedReasons'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        isSelectAllOptionSelected: evaluateSelectAllOption(
          'blockedReasons',
          parsedQuery,
          clearQuery
        ),
        filterValues: calculateBlockedReasonsFilterValues(
          cookies,
          parsedQuery?.filter?.blockedReasons,
          clearQuery
        ),
        sortValues: true,
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string[];
          return val?.includes(filterValue);
        },
      },
      exemptionReason: {
        title: I18n.getMessage('exemptionReasons'),
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        enableSelectAllOption: true,
        isSelectAllOptionSelected: evaluateSelectAllOption(
          'exemptionReason',
          parsedQuery,
          clearQuery
        ),
        filterValues: calculateExemptionReason(
          cookies,
          clearQuery,
          parsedQuery?.filter?.exemptionReason
        ),
        comparator: (value: InfoType, filterValue: string) => {
          const val = value as string;
          return val === filterValue;
        },
        useGenericPersistenceKey: true,
      },
    }),
    [clearQuery, cookies, parsedQuery]
  );

  const filterOutput = useFiltering(
    cookies,
    filters,
    'cookiesListing',
    'cookiesListing'
  );

  return filterOutput;
};

export default useGlobalFiltering;
