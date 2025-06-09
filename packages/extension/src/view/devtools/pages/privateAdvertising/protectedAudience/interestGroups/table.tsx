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
  JsonView,
  ResizableTray,
  Table,
  TableProvider,
  type TableColumn,
  type TableData,
  type TableFilter,
  type TableRow,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import {
  noop,
  type InterestGroups as InterestGroupsType,
  type singleAuctionEvent,
} from '@google-psat/common';
import React, { useMemo, useState, useCallback } from 'react';

interface InterestGroupsProps {
  interestGroupDetails: InterestGroupsType[];
  highlightedInterestGroup?: {
    interestGroupName: string;
    interestGroupOwner: string;
    color: string;
  } | null;
  isEE?: boolean;
}

const IGTable = ({
  interestGroupDetails,
  highlightedInterestGroup,
  isEE = false,
}: InterestGroupsProps) => {
  const [selectedRow, setSelectedRow] = useState<TableData | null>(null);

  const [filterData, setFilterData] = useState(false);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Event Time',
        accessorKey: 'time',
        cell: (_, details) =>
          (details as singleAuctionEvent).formattedTime.toString(),
        enableHiding: false,
      },
      {
        header: 'Access Type',
        accessorKey: 'type',
        cell: (info) => info,
      },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: (info) => info,
      },
      {
        header: 'Owner',
        accessorKey: 'ownerOrigin',
        cell: (info) => {
          return new URL(info as string).hostname;
        },
      },
      {
        header: 'Expiration Time',
        accessorKey: 'details.expirationTime',
        cell: (info) => {
          if (!info) {
            return '';
          }

          return new Date(Number(info) * 1000).toISOString();
        },
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

  const modifiedInterestGroupDetails = useMemo(() => {
    if (!highlightedInterestGroup) {
      return interestGroupDetails;
    }

    return interestGroupDetails.map((interestGroup) => {
      const isHighlighted =
        interestGroup.name === highlightedInterestGroup.interestGroupName &&
        new URL(interestGroup?.ownerOrigin || '').host ===
          new URL(highlightedInterestGroup?.interestGroupOwner || '').host;

      return {
        ...interestGroup,
        highlighted: isHighlighted,
      };
    });
  }, [interestGroupDetails, highlightedInterestGroup]);

  const hasVerticalBar = useCallback((row: TableRow) => {
    return Boolean(row.originalData.highlighted);
  }, []);

  const getVerticalBarColorHash = useCallback(
    (row: TableRow) => {
      return row.originalData.highlighted
        ? highlightedInterestGroup?.color ?? ''
        : '';
    },
    [highlightedInterestGroup?.color]
  );

  const conditionalTableRowClassesHandler = useCallback(
    (row: TableRow, isRowFocused: boolean) => {
      const isHighlighted = row?.originalData?.highlighted;
      const tableRowClassName = isHighlighted
        ? isRowFocused
          ? 'bg-selection-yellow-dark dark:bg-selection-yellow-light text-black transition-colors'
          : 'bg-lavender-sky text-black dark:bg-midnight-slate dark:text-chinese-silver'
        : '';

      return tableRowClassName;
    },
    []
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFilterData(event.target.checked);
    },
    []
  );

  const topBarExtraInterface = useCallback(() => {
    if (isEE) {
      return <></>;
    }

    return (
      <div className="h-full flex items-center justify-center w-max gap-1">
        <div className="h-full w-px bg-american-silver dark:bg-quartz mr-2" />
        <div className="flex items-center justify-center w-max gap-1">
          <input
            onChange={handleChange}
            type="checkbox"
            id="showAllEvents"
            name="showAllEvents"
            value="Show All Events"
          />
          <label htmlFor="showAllEvents" className="text-xs leading-none">
            Show all events
          </label>
        </div>
      </div>
    );
  }, [handleChange, isEE]);

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
        trayId="interest-groups-table-bottom-tray"
      >
        <TableProvider
          data={
            filterData
              ? modifiedInterestGroupDetails
              : modifiedInterestGroupDetails.filter(
                  (event) => event.type === 'leave' || event.type === 'join'
                )
          }
          tableColumns={tableColumns}
          tableFilterData={tableFilters}
          tableSearchKeys={undefined}
          tablePersistentSettingsKey="interestGroupsTable"
          conditionalTableRowClassesHandler={conditionalTableRowClassesHandler}
          getVerticalBarColorHash={getVerticalBarColorHash}
          hasVerticalBar={hasVerticalBar}
          onRowClick={(row) => setSelectedRow(row as InterestGroupsType)}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return (
              ((row.originalData as InterestGroupsType).uniqueAuctionId ?? '') +
              (row.originalData as InterestGroupsType).time
            );
          }}
        >
          <Table
            extraInterfaceToTopBar={topBarExtraInterface}
            selectedKey={
              (selectedRow?.uniqueAuctionId ?? '') + String(selectedRow?.time)
            }
            hideSearch={true}
            shouldScroll
            minWidth="50rem"
          />
        </TableProvider>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            <JsonView src={selectedRow} />
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

export default IGTable;
