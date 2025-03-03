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
 * External dependencies.
 */
import React, { useMemo, useState, useCallback } from 'react';
import { noop, type SourcesRegistration } from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableRow,
  type TableColumn,
  type TableFilter,
  type InfoType,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import { prettyPrintJson } from 'pretty-print-json';
import { I18n } from '@google-psat/i18n';
import type { Protocol } from 'devtools-protocol';

/**
 * Internal dependencies.
 */
import { useAttributionReporting } from '../../../../stateProviders/attributionReporting';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';

type SourcesKeys =
  keyof Protocol.Storage.AttributionReportingSourceRegistration;

const ActiveSources = () => {
  const [selectedJSON, setSelectedJSON] = useState<SourcesRegistration | null>(
    null
  );

  const { sourcesRegistration } = useAttributionReporting(({ state }) => ({
    sourcesRegistration: state.sourcesRegistration,
  }));

  const calculateFilters = useCallback(
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

  const tableFilters = useMemo<TableFilter>(
    () => ({
      sourceOrigin: {
        title: 'Source Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters('sourceOrigin'),
      },
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters('reportingOrigin'),
      },
      destination: {
        title: 'Destination Sites',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters('destinationSites'),
      },
      type: {
        title: 'Event Type',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters('type'),
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
    [calculateFilters]
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Source Event ID',
        accessorKey: 'eventId',
        cell: (info) => info,
        widthWeightagePercentage: 12,
      },
      {
        header: 'Source Origin',
        accessorKey: 'sourceOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 15,
      },
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
        widthWeightagePercentage: 20,
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
        widthWeightagePercentage: 12,
      },
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
        widthWeightagePercentage: 12,
      },
      {
        header: 'Source Type',
        accessorKey: 'type',
        cell: (info) => info,
        widthWeightagePercentage: 5,
      },
      {
        header: 'Debug Key',
        accessorKey: 'debugKey',
        cell: (info) => info,
        widthWeightagePercentage: 12,
      },
    ],
    []
  );

  return (
    <div className="w-full h-full text-outer-space-crayola dark:text-bright-gray flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        enable={{
          bottom: true,
        }}
        minHeight="20%"
        maxHeight="90%"
        className="w-full flex flex-col"
      >
        <div className="flex-1 border border-american-silver dark:border-quartz overflow-auto">
          <TableProvider
            tableFilterData={tableFilters}
            data={sourcesRegistration}
            tableColumns={tableColumns}
            tableSearchKeys={undefined}
            onRowContextMenu={noop}
            onRowClick={(row) => setSelectedJSON(row as SourcesRegistration)}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as SourcesRegistration).index.toString()
            }
          >
            <Table
              selectedKey={selectedJSON?.index.toString()}
              hideSearch={true}
              minWidth="50rem"
            />
          </TableProvider>
        </div>
      </Resizable>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedJSON ? (
          <div className="text-xs py-1 px-1.5">
            <pre>
              <div
                className="json-container"
                dangerouslySetInnerHTML={{
                  __html: prettyPrintJson.toHtml(selectedJSON),
                }}
              />
            </pre>
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveSources;
