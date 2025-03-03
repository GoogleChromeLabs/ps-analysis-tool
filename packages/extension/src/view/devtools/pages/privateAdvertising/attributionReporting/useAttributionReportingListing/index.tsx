/*
 * Copyright 2025 Google LLC
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
  SourcesData,
  SourcesRegistration,
  TriggerRegistration,
} from '@google-psat/common';
import { useCallback, useMemo } from 'react';
import type {
  TableFilter,
  InfoType,
  TableColumn,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */

import { useAttributionReporting } from '../../../../stateProviders';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';

type SourcesKeys = keyof SourcesRegistration;
type TriggerKeys = keyof TriggerRegistration;
type ReturnType = {
  tableFilters: TableFilter;
  tableColumns: TableColumn[];
  data: SourcesData[];
};
/**
 * This hook is used to spit out specific columns and filters for the attribution sources listing.
 * @param {string} tab Caller of the hook.
 * @returns {Record<string, TableFilter | TableColumn[] | SourcesData[]>} Table filters, columns and data for the table listing.
 */
function useAttributionReportingListing(tab: string): ReturnType {
  const { sourcesRegistration, triggerRegistration } = useAttributionReporting(
    ({ state }) => ({
      sourcesRegistration: state.sourcesRegistration,
      triggerRegistration: state.triggerRegistration,
    })
  );

  const isActiveSouresTab = useMemo(() => tab === 'activeSources', [tab]);

  const calculateFiltersForSources = useCallback(
    (key: SourcesKeys) => {
      const filters: { [key: string]: Record<'selected', boolean> } = {};
      sourcesRegistration.forEach((sources) => {
        if (key === 'destinationSites') {
          if (Array.isArray(sources[key])) {
            sources[key].forEach((site) => {
              filters[site] = {
                selected: false,
              };
            });
          } else {
            filters[sources[key]] = {
              selected: false,
            };
          }
        } else {
          const _key = sources[key] as SourcesKeys;
          filters[_key] = {
            selected: false,
          };
        }
      });
      return filters;
    },
    [sourcesRegistration]
  );

  const calculateFiltersForTriggers = useCallback(
    (key: TriggerKeys) => {
      const filters: { [key: string]: Record<'selected', boolean> } = {};
      triggerRegistration.forEach((trigger) => {
        if (key === 'destination') {
          if (!trigger[key]) {
            return;
          }

          filters[trigger[key]] = {
            selected: false,
          };
        } else {
          const _key = trigger[key] as TriggerKeys;
          filters[_key] = {
            selected: false,
          };
        }
      });
      return filters;
    },
    [triggerRegistration]
  );

  const tableFiltersForSources = useMemo<TableFilter>(
    () => ({
      sourceOrigin: {
        title: 'Source Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources('sourceOrigin'),
      },
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources('reportingOrigin'),
      },
      destination: {
        title: 'Destination Sites',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources('destinationSites'),
      },
      type: {
        title: 'Event Type',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources('type'),
      },
      expiry: {
        title: 'Expiry',
        hasStaticFilterValues: true,
        filterValues: {
          [I18n.getMessage('session')]: {
            selected: false,
          },
          [I18n.getMessage('shortTerm')]: {
            selected: false,
          },
          [I18n.getMessage('mediumTerm')]: {
            selected: false,
          },
          [I18n.getMessage('longTerm')]: {
            selected: false,
          },
          [I18n.getMessage('extentedTerm')]: {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          let diff = 0;
          const val = value as number;
          switch (filterValue) {
            case I18n.getMessage('shortTerm'):
              diff = val - Date.now();
              return diff < 86400000;

            case I18n.getMessage('mediumTerm'):
              diff = val - Date.now();
              return diff >= 86400000 && diff < 604800000;

            case I18n.getMessage('longTerm'):
              diff = val - Date.now();
              return diff >= 604800000 && diff < 2629743833;

            case I18n.getMessage('extentedTerm'):
              diff = val - Date.now();
              return diff >= 2629743833;

            default:
              return false;
          }
        },
      },
    }),
    [calculateFiltersForSources]
  );

  const tableFiltersForTriggers = useMemo<TableFilter>(
    () => ({
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTriggers('reportingOrigin'),
      },
      destination: {
        title: 'Destination Sites',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTriggers('destination'),
      },
    }),
    [calculateFiltersForTriggers]
  );

  const tableColumnsForTriggers = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Destination',
        accessorKey: 'destination',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Reporting Origin',
        accessorKey: 'reportingOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Registration Time',
        accessorKey: 'time',
        cell: (_, details) =>
          calculateRegistrationDate((details as TriggerRegistration)?.time),
        enableHiding: false,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Event Level Result',
        accessorKey: 'eventLevel',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Aggregetable Result',
        accessorKey: 'aggregatable',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
    ],
    []
  );

  const tableColumnsForSources = useMemo<TableColumn[]>(() => {
    const baseColumns: TableColumn[] = [
      {
        header: 'Source Origin',
        accessorKey: 'sourceOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Reporting Origin',
        accessorKey: 'reportingOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
      {
        header: 'Registration Time',
        accessorKey: 'time',
        cell: (_, details) =>
          calculateRegistrationDate((details as SourcesRegistration)?.time),
        enableHiding: false,
        widthWeightagePercentage: isActiveSouresTab ? 12 : 15,
      },
      {
        header: 'Source Type',
        accessorKey: 'type',
        cell: (info) => info,
        widthWeightagePercentage: isActiveSouresTab ? 5 : 15,
      },
      {
        header: 'Debug Key',
        accessorKey: 'debugKey',
        cell: (info) => info,
        widthWeightagePercentage: isActiveSouresTab ? 12 : 15,
      },
    ];

    if (isActiveSouresTab) {
      const modifiedBaseColumns: TableColumn[] = [
        {
          header: 'Source Event ID',
          accessorKey: 'eventId',
          cell: (info) => info,
          widthWeightagePercentage: 12,
        },
        ...baseColumns.slice(1, 1),
        {
          header: 'Destinations',
          accessorKey: 'destinationSites',
          cell: (info) => {
            if (!info) {
              return '';
            }
            if (Array.isArray(info)) {
              return info.join(', ');
            }
            return info;
          },
          widthWeightagePercentage: isActiveSouresTab ? 20 : 15,
        },
        ...baseColumns.slice(2),
        {
          header: 'Expiry',
          accessorKey: 'expiry',
          cell: (_, details) =>
            calculateRegistrationDate((details as SourcesRegistration)?.expiry),
          sortingComparator: (a, b) => {
            const aString = (a as string).toLowerCase().trim();
            const bString = (b as string).toLowerCase().trim();

            return aString > bString ? 1 : -1;
          },
          widthWeightagePercentage: isActiveSouresTab ? 12 : 15,
        },
        {
          header: 'Status',
          accessorKey: 'result',
          cell: (info) => info,
          widthWeightagePercentage: 15,
        },
      ];

      return modifiedBaseColumns;
    }
    return baseColumns;
  }, [isActiveSouresTab]);

  return {
    tableColumns:
      tab === 'triggers' ? tableColumnsForTriggers : tableColumnsForSources,
    tableFilters:
      tab === 'triggers' ? tableFiltersForTriggers : tableFiltersForSources,
    data: tab === 'triggers' ? triggerRegistration : sourcesRegistration,
  };
}

export default useAttributionReportingListing;
