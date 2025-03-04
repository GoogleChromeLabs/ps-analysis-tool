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
import { noop, type TriggerRegistration } from '@google-psat/common';
import {
  TableProvider,
  type TableRow,
  Table,
  type TableColumn,
  type TableFilter,
  type InfoType,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';
import React, { useMemo, useRef, useState } from 'react';
import { prettyPrintJson } from 'pretty-print-json';
import { I18n } from '@google-psat/i18n';

/**
 * Internal dependencies
 */
import RowContextMenuForARA from '../rowContextMenu';
import { useAttributionReporting } from '../../../../stateProviders';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';
import calculateFiltersForTrigger from '../utils/calculateFiltersForTriggers';

const TriggerRegistrations = () => {
  const [selectedJSON, setSelectedJSON] = useState<TriggerRegistration | null>(
    null
  );

  const { triggerRegistration } = useAttributionReporting(({ state }) => ({
    triggerRegistration: state.triggerRegistration,
  }));

  const rowContextMenuRef = useRef<React.ElementRef<
    typeof RowContextMenuForARA
  > | null>(null);

  const tableFilters = useMemo<TableFilter>(
    () => ({
      reportingOrigin: {
        title: 'Reporting Origin',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTrigger(
          triggerRegistration,
          'reportingOrigin'
        ),
      },
      destination: {
        title: 'Destination Sites',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTrigger(
          triggerRegistration,
          'destination'
        ),
      },
      time: {
        title: 'Registration Time',
        hasStaticFilterValues: true,
        filterValues: {
          Today: {
            selected: false,
          },
          Yesterday: {
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

            case 'Yesterday':
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
      eventLevel: {
        title: 'Event Level Result',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTrigger(
          triggerRegistration,
          'eventLevel'
        ),
      },
      aggregatable: {
        title: 'Aggregatable Result',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFiltersForTrigger(
          triggerRegistration,
          'aggregatable'
        ),
      },
    }),
    [triggerRegistration]
  );

  const tableColumns = useMemo<TableColumn[]>(
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
            data={triggerRegistration}
            tableColumns={tableColumns}
            tableSearchKeys={undefined}
            onRowContextMenu={
              rowContextMenuRef.current
                ? rowContextMenuRef.current?.onRowContextMenu
                : noop
            }
            onRowClick={(row) => setSelectedJSON(row as TriggerRegistration)}
            getRowObjectKey={(row: TableRow) =>
              (row.originalData as TriggerRegistration).index.toString()
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
      <RowContextMenuForARA ref={rowContextMenuRef} />
    </div>
  );
};

export default TriggerRegistrations;
