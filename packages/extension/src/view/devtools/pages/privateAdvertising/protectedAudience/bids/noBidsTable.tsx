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
import {
  noop,
  type NoBidsType,
  type singleAuctionEvent,
} from '@google-psat/common';
import {
  Table,
  TableProvider,
  type TableColumn,
  type TableFilter,
  type TableRow,
} from '@google-psat/design-system';
import React, { useMemo } from 'react';
import EvaluationEnvironment from '../evaluationEnvironment';

interface NoBidsTableProps {
  setSelectedRow: React.Dispatch<
    React.SetStateAction<
      singleAuctionEvent | NoBidsType[keyof NoBidsType] | null
    >
  >;
  selectedRow: singleAuctionEvent | NoBidsType[keyof NoBidsType] | null;
  noBids: NoBidsType;
  showEvaluationPlaceholder?: boolean;
}

const NoBidsTable = ({
  noBids,
  setSelectedRow,
  selectedRow,
  showEvaluationPlaceholder,
}: NoBidsTableProps) => {
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Bidder',
        accessorKey: 'ownerOrigin',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Ad Unit Code',
        accessorKey: 'adUnitCode',
        cell: (info) => info,
      },
    ],
    []
  );

  const tableFilters = useMemo<TableFilter>(
    () => ({
      ownerOrigin: {
        title: 'Bidder',
        sortValues: true,
        useGenericPersistenceKey: true,
      },
      adUnitCode: {
        title: 'Ad Unit Code',
        sortValues: true,
        useGenericPersistenceKey: true,
      },
    }),
    []
  );

  if (!noBids || Object.keys(noBids).length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <p className="text-lg text-raisin-black dark:text-bright-gray">
          No bids data was recorded.
        </p>
        {showEvaluationPlaceholder && (
          <EvaluationEnvironment text="Please setup the <a>evaluation environment</a> before analyzing the bids if you haven’t already." />
        )}
      </div>
    );
  }

  return (
    <TableProvider
      data={Object.values(noBids)}
      tableColumns={tableColumns}
      tableFilterData={tableFilters}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="bidsTable#nobids"
      onRowClick={(row) => {
        setSelectedRow(row as NoBidsType[keyof NoBidsType]);
      }}
      onRowContextMenu={noop}
      getRowObjectKey={(row: TableRow) => {
        return (
          row.originalData?.ownerOrigin +
          row.originalData?.adUnitCode +
          row.originalData?.uniqueAuctionId
        );
      }}
    >
      <Table
        selectedKey={
          selectedRow?.ownerOrigin +
          (selectedRow?.adUnitCode || '') +
          selectedRow?.uniqueAuctionId
        }
        minWidth="42rem"
        hideSearch={true}
      />
    </TableProvider>
  );
};

export default NoBidsTable;
