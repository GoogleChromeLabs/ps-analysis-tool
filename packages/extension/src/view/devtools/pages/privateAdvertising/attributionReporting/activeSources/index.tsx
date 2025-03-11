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
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { noop, type SourcesRegistration } from '@google-psat/common';
import {
  InfoIcon,
  Table,
  TableProvider,
  type InfoType,
  type TableColumn,
  type TableFilter,
  type TableRow,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies.
 */
import RowContextMenuForARA from '../rowContextMenu';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';
import { useAttributionReporting } from '../../../../stateProviders';
import calculateFiltersForSources from '../utils/calculateFiltersForSources';
import JsonDisplay from '../jsonDisplay';

const ActiveSources = () => {
  const [selectedJSON, setSelectedJSON] = useState<SourcesRegistration | null>(
    null
  );
  const [selectedPrevJSON, setSelectedPrevJSON] =
    useState<SourcesRegistration | null>(null);

  const { sourcesRegistration, filter, updateFilter } = useAttributionReporting(
    ({ state, actions }) => ({
      sourcesRegistration: state.sourcesRegistration,
      filter: state.filter,
      updateFilter: actions.updateFilter,
    })
  );

  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForARA
  > | null>(null);

  const data = useMemo(() => {
    if (filter?.activeSources) {
      return sourcesRegistration.filter(
        (source) =>
          source.tabId &&
          source.tabId === chrome.devtools.inspectedWindow.tabId.toString()
      );
    } else {
      return sourcesRegistration;
    }
  }, [filter?.activeSources, sourcesRegistration]);

  const tableFilters = useMemo<TableFilter>(
    () => ({
      sourceOrigin: {
        title: 'Source Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'sourceOrigin'),
      },
      destinationSites: {
        title: 'Destination Sites',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'destinationSites'),
        comparator: (value: InfoType, filterValue: string) => {
          if (Array.isArray(value)) {
            return (value as string[]).includes(filterValue);
          }
          return value === filterValue;
        },
      },
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'reportingOrigin'),
      },
      time: {
        title: 'Registration Time',
        hasStaticFilterValues: true,
        filterValues: {
          Today: {
            selected: false,
          },
          'Since Yesterday': {
            selected: false,
          },
          'Last 7 Days': {
            selected: false,
          },
          'Last 30 Days': {
            selected: false,
          },
        },
        useGenericPersistenceKey: true,
        comparator: (value: InfoType, filterValue: string) => {
          const val = new Date(value as number);

          const today = new Date();
          const yesterday = new Date();
          yesterday.setDate(today.getDate() - 1);

          const last7Days = new Date();
          last7Days.setDate(today.getDate() - 7);

          const last30Days = new Date();
          last30Days.setDate(today.getDate() - 30);
          switch (filterValue) {
            case 'Today':
              return new Date().toDateString() === val.toDateString();

            case 'Since Yesterday':
              return val >= yesterday && val <= today;

            case 'Last 7 Days':
              return val >= last7Days && val <= today;

            case 'Last 30 Days':
              return val >= last30Days && val <= today;

            default:
              return false;
          }
        },
      },
      expiry: {
        title: 'Expiry',
        hasStaticFilterValues: true,
        filterValues: {
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

            default:
              return false;
          }
        },
      },
      type: {
        title: 'Source Type',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'type'),
      },
    }),
    [data]
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
          if (Array.isArray(info) && info.length > 1) {
            return (
              <div>
                {(info as string[]).map((_info, index) => (
                  <div key={index} className="p-1 text-xs">
                    {_info}
                  </div>
                ))}
              </div>
            );
          }
          return Array.isArray(info) && info.length === 1 ? info[0] : info;
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

  const topBarExtraInterface = useCallback(() => {
    return (
      <div className="h-full flex items-center justify-center w-max gap-1">
        <div className="h-full w-px bg-american-silver dark:bg-quartz mr-2" />
        <div className="flex items-center justify-center w-max gap-1">
          <input
            onChange={(event) =>
              updateFilter('activeSources', event.target.checked)
            }
            type="checkbox"
            defaultChecked={filter.activeSources}
            className="hover:cursor-pointer"
          />
          <label htmlFor="showAllEvents" className="text-xs leading-none">
            Show current tab registrations
          </label>
          <div
            title="Preserve log from Network tab to view network requests associated
            with each source in this table for the current tab."
            className="hover:cursor-pointer"
          >
            <InfoIcon className="w-3 h-3 fill-granite-gray" />
          </div>
        </div>
      </div>
    );
  }, [updateFilter, filter.activeSources]);

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
            data={data}
            tableColumns={tableColumns}
            tableSearchKeys={undefined}
            onRowContextMenu={
              rowContextMenuRef.current
                ? rowContextMenuRef.current?.onRowContextMenu
                : noop
            }
            onRowClick={(row, prevRow) => {
              setSelectedPrevJSON(prevRow as SourcesRegistration);
              setSelectedJSON(row as SourcesRegistration);
            }}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as SourcesRegistration).index.toString()
            }
          >
            <Table
              extraInterfaceToTopBar={topBarExtraInterface}
              selectedKey={selectedJSON?.index.toString()}
              hideSearch={true}
              minWidth="50rem"
            />
          </TableProvider>
        </div>
      </Resizable>
      <JsonDisplay currentJson={selectedJSON} prevJson={selectedPrevJSON} />
      <RowContextMenuForARA ref={rowContextMenuRef} />
    </div>
  );
};

export default ActiveSources;
