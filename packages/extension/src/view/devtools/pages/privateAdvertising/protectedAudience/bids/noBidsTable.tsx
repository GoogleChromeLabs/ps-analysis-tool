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

/**
 * Internal dependencies.
 */
import Placeholder from './placeholder';

interface NoBidsTableProps {
  setSelectedRow: React.Dispatch<
    React.SetStateAction<
      singleAuctionEvent | NoBidsType[keyof NoBidsType] | null
    >
  >;
  selectedRow: singleAuctionEvent | NoBidsType[keyof NoBidsType] | null;
  noBids: NoBidsType[keyof NoBidsType][];
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

  if (!noBids || noBids.length === 0) {
    return (
      <Placeholder showEvaluationPlaceholder={showEvaluationPlaceholder} />
    );
  }

  return (
    <TableProvider
      data={noBids}
      tableColumns={tableColumns}
      tableFilterData={tableFilters}
      tableSearchKeys={undefined}
      tablePersistentSettingsKey="bidsTable#nobids"
      onRowClick={(row) => {
        const _data = row;
        // Prebid noBids data has a different structure
        if (_data?.bidder) {
          delete _data.ownerOrigin;
        }

        setSelectedRow(_data as NoBidsType[keyof NoBidsType]);
      }}
      onRowContextMenu={noop}
      getRowObjectKey={(row: TableRow) => {
        return (
          row.originalData?.ownerOrigin +
          row.originalData?.adUnitCode +
          row.originalData?.uniqueAuctionId +
          row.originalData?.name
        );
      }}
    >
      <Table
        selectedKey={
          selectedRow?.ownerOrigin +
          (selectedRow?.adUnitCode || '') +
          selectedRow?.uniqueAuctionId +
          (selectedRow?.name || '')
        }
        minWidth="42rem"
        hideSearch={true}
      />
    </TableProvider>
  );
};

export default NoBidsTable;
