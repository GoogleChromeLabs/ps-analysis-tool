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
import { noop, type SourcesRegistration } from '@google-psat/common';
import {
  TableProvider,
  type TableRow,
  Table,
  type TableFilter,
  type TableColumn,
  type InfoType,
  InfoIcon,
  JsonView,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import RowContextMenuForARA from '../rowContextMenu';
import calculateFiltersForSources from '../utils/calculateFiltersForSources';
import { useAttributionReporting } from '../../../../stateProviders';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';

const SourceRegistrations = () => {
  const [selectedJSON, setSelectedJSON] = useState<SourcesRegistration | null>(
    null
  );

  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForARA
  > | null>(null);

  const { sourcesRegistration, filter, updateFilter } = useAttributionReporting(
    ({ state, actions }) => ({
      sourcesRegistration: state.sourcesRegistration,
      filter: state.filter,
      updateFilter: actions.updateFilter,
    })
  );

  const data = useMemo(() => {
    if (filter?.sourcesRegistration) {
      return sourcesRegistration.filter(
        (source) =>
          source.tabId &&
          source.tabId === chrome.devtools.inspectedWindow.tabId.toString()
      );
    } else {
      return sourcesRegistration;
    }
  }, [filter?.sourcesRegistration, sourcesRegistration]);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Registration Time',
        accessorKey: 'time',
        cell: (_, details) =>
          calculateRegistrationDate((details as SourcesRegistration)?.time),
        enableHiding: false,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Source Origin',
        accessorKey: 'sourceOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Reporting Origin',
        accessorKey: 'reportingOrigin',
        cell: (info) => info,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Cleared Debug Key',
        accessorKey: 'clearedDebugKey',
        cell: (info) => info,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Source Type',
        accessorKey: 'type',
        cell: (info) => info,
        widthWeightagePercentage: 10,
      },
      {
        header: 'Status',
        accessorKey: 'result',
        cell: (info) => info,
        widthWeightagePercentage: 10,
      },
    ],
    []
  );

  const tableFilters = useMemo<TableFilter>(
    () => ({
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
      sourceOrigin: {
        title: 'Source Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'sourceOrigin'),
      },
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'reportingOrigin'),
      },
      type: {
        title: 'Type',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForSources(data, 'type'),
      },
    }),
    [data]
  );

  const topBarExtraInterface = useCallback(() => {
    return (
      <div className="h-full flex items-center justify-center w-max gap-1">
        <div className="h-full w-px bg-american-silver dark:bg-quartz mr-2" />
        <div className="flex items-center justify-center w-max gap-1">
          <input
            onChange={(event) =>
              updateFilter('sourcesRegistration', event.target.checked)
            }
            type="checkbox"
            defaultChecked={filter.sourcesRegistration}
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
  }, [updateFilter, filter.sourcesRegistration]);

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
            onRowClick={(row) => {
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
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedJSON ? (
          <div className="text-xs py-1 h-full">
            <JsonView src={selectedJSON} />
          </div>
        ) : (
          <div className="h-full p-8 flex items-center">
            <p className="text-lg w-full font-bold text-granite-gray dark:text-manatee text-center">
              {I18n.getMessage('selectRowToPreview')}
            </p>
          </div>
        )}
      </div>
      <RowContextMenuForARA ref={rowContextMenuRef} />
    </div>
  );
};

export default SourceRegistrations;
