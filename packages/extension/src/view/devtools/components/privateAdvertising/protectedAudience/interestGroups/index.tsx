/*
 * Copyright 2024 Google LLC
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
import { Resizable } from 're-resizable';
import {
  Table,
  TableFilter,
  TableProvider,
  type TableColumn,
  type TableRow,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import {
  noop,
  type InterestGroups as InterestGroupsType,
} from '@google-psat/common';
import { prettyPrintJson } from 'pretty-print-json';

/**
 * Internal dependencies.
 */
import { useProtectedAudience } from '../../../../stateProviders';

const InterestGroups = () => {
  const [selectedRow, setSelectedRow] = useState<InterestGroupsType | null>(
    null
  );

  const { interestGroupDetails } = useProtectedAudience(({ state }) => ({
    interestGroupDetails: state.interestGroupDetails,
  }));

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'formattedTime',
        cell: (info) => info,
      },
      {
        header: 'Access Type',
        accessorKey: 'type',
        cell: (info) => info,
      },
      {
        header: 'Owner',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info,
      },
      {
        header: 'Expiration Time',
        accessorKey: 'details.expirationTime',
        cell: (info) => info,
      },
    ],
    []
  );

  const tableFilters = useMemo<TableFilter>(
    () => ({
      type: {
        title: 'Access Type',
        sortValues: true,
      },
      ownerOrigin: {
        title: 'Owner',
        sortValues: true,
      },
      name: {
        title: 'Name',
        sortValues: true,
      },
    }),
    []
  );

  if (!interestGroupDetails || interestGroupDetails.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-sm text-raisin-black dark:text-bright-gray">
          No interests group events recorded.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full text-outer-space-crayola mt-4 border-x border-t border-american-silver dark:border-quartz flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
      >
        <TableProvider
          data={interestGroupDetails}
          tableColumns={tableColumns}
          tableFilterData={tableFilters}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="interestGroupsTable"
          onRowClick={(row) => {
            setSelectedRow(row as InterestGroupsType);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return (
              ((row.originalData as InterestGroupsType).uniqueAuctionId ?? '') +
              (row.originalData as InterestGroupsType).time
            );
          }}
        >
          <Table
            selectedKey={
              (selectedRow?.uniqueAuctionId ?? '') + String(selectedRow?.time)
            }
            hideSearch={true}
          />
        </TableProvider>
      </Resizable>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            <pre>
              <div
                className="json-container"
                dangerouslySetInnerHTML={{
                  __html: prettyPrintJson.toHtml(selectedRow),
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

export default InterestGroups;
