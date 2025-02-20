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
import React, { useMemo, useState } from 'react';
import {
  noop,
  type singleAuctionEvent,
  type SourcesRegistration,
} from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableRow,
  type TableColumn,
} from '@google-psat/design-system';
import { Resizable } from 're-resizable';

/**
 * Internal dependencies.
 */
import { useAttributionReporting } from '../../../../stateProviders/attributionReporting';
import calculateRegistrationDate from '../utils/calculateRegistrationDate';

const calculateExpiryDate = (registrationTime: number, expiryTime: number) => {
  const expiryTimestamp = registrationTime + expiryTime; // Add expiry duration
  return calculateRegistrationDate(expiryTimestamp);
};

const ActiveSources = () => {
  const [selectedJSON, setSelectedJSON] = useState<SourcesRegistration | null>(
    null
  );

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Source Event ID',
        accessorKey: 'sourceEventId',
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
        accessorKey: 'destination',
        cell: (info) => (info as string[])?.join(' '),
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
          calculateRegistrationDate((details as singleAuctionEvent)?.time),
        enableHiding: false,
        widthWeightagePercentage: 12,
      },
      {
        header: 'Expiry',
        accessorKey: 'expiry',
        cell: (info, details) => {
          return calculateExpiryDate(
            (details as SourcesRegistration)?.time,
            Number(info)
          );
        },
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

  const { sourcesRegistration } = useAttributionReporting(({ state }) => ({
    sourcesRegistration: state.sourcesRegistration,
  }));

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
    </div>
  );
};

export default ActiveSources;
