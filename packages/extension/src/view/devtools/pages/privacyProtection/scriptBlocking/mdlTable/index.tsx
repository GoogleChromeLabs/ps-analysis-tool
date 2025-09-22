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
import {
  ProgressBar,
  type TableFilter,
  type TableColumn,
  Link,
  type InfoType,
} from '@google-psat/design-system';
import React, { useMemo, useState, useCallback } from 'react';
import type { MDLTableData } from '@google-psat/common';

/**
 * Internal dependencies
 */
import {
  useScriptBlocking,
  IMPACTED_BY_SCRIPT_BLOCKING,
} from '../../../../stateProviders';
import MdlCommonPanel from '../../mdlCommonPanel';
import Legend from './legend';

const titleMap = {
  'Entire Domain Blocked': 'Scope Complete',
  'Some URLs are Blocked': 'Scope Partial',
};

const MDLTable = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState<boolean>(true);
  const [preSetFilters, setPresetFilters] = useState<{
    [key: string]: Record<string, string[]>;
  }>({ filter: {} });
  const { uniqueResponseDomains, statistics, scriptBlockingData, isLoading } =
    useScriptBlocking(({ state }) => ({
      uniqueResponseDomains: state.uniqueResponseDomains,
      statistics: state.statistics,
      scriptBlockingData: state.scriptBlockingData,
      isLoading: state.isLoading,
    }));

  const checkbox = useCallback(
    () => (
      <label className="text-raisin-black dark:text-bright-gray flex items-center gap-2 hover:cursor-pointer">
        <input
          className="hover:cursor-pointer"
          type="checkbox"
          onChange={() => setShowOnlyHighlighted((prev) => !prev)}
          defaultChecked
        />
        <span className="whitespace-nowrap">Show Only blocked domains</span>
      </label>
    ),
    []
  );

  const tableData: MDLTableData[] = useMemo(() => {
    if (scriptBlockingData.length === 0) {
      return [];
    }

    const data: MDLTableData[] = [];

    scriptBlockingData
      .filter(
        (item) => item.scriptBlocking !== IMPACTED_BY_SCRIPT_BLOCKING.NONE
      )
      .forEach((item) => {
        let available = false;
        if (uniqueResponseDomains.includes(item.domain)) {
          available = true;
        }

        const canPush = showOnlyHighlighted ? available : true;

        if (canPush) {
          data.push({
            ...item,
            highlighted: available,
            highlightedClass:
              available &&
              item.scriptBlocking.startsWith('Some URLs are Blocked')
                ? 'bg-amber-100'
                : '',
          } as MDLTableData);
        }
      });

    return data.sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
  }, [uniqueResponseDomains, scriptBlockingData, showOnlyHighlighted]);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Domain',
        accessorKey: 'domain',
        cell: (info) => info,
        initialWidth: 100,
      },
      {
        header: 'Owner',
        accessorKey: 'owner',
        cell: (info) => {
          if (info === 'PSL Domain') {
            return (
              <Link
                href="https://en.wikipedia.org/wiki/Public_Suffix_List"
                target="_blank"
                rel="noopener noreferrer"
              >
                PSL Domain
              </Link>
            );
          }

          return info;
        },
        initialWidth: 100,
      },
      {
        header: 'Scope',
        accessorKey: 'scriptBlocking',
        cell: (info) => titleMap[info as keyof typeof titleMap].slice(6),
      },
    ],
    []
  );

  const calculateFilters = useCallback(
    (data: MDLTableData[]) => {
      const _filters: {
        [key: string]: {
          selected: boolean;
          description: string;
        };
      } = {};

      data.forEach((singleData) => {
        _filters[titleMap[singleData.scriptBlocking as keyof typeof titleMap]] =
          {
            selected: preSetFilters?.filter?.scriptBlocking?.includes(
              titleMap[singleData.scriptBlocking as keyof typeof titleMap]
            ),
            description: IMPACTED_BY_SCRIPT_BLOCKING[
              singleData.scriptBlocking as keyof typeof IMPACTED_BY_SCRIPT_BLOCKING
            ] as string,
          };
      });

      return _filters;
    },
    [preSetFilters?.filter?.scriptBlocking]
  );

  const filters = useMemo<TableFilter>(
    () => ({
      owner: {
        title: 'Owner',
      },
      scriptBlocking: {
        title: 'Scope',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters(tableData),
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'Scope Complete':
              return value === 'Entire Domain Blocked';
            case 'Scope Partial':
              return value === 'Some URLs are Blocked';
            default:
              return false;
          }
        },
      },
    }),
    [calculateFilters, tableData]
  );

  const stats = {
    site: [
      {
        title: 'Scope Complete',
        centerCount: statistics.localView.completelyBlockedDomains,
        color: '#F3AE4E',
        onClick: () =>
          setPresetFilters((prev) => ({
            ...prev,
            filter: {
              scriptBlocking: ['Scope Complete'],
            },
          })),
      },
      {
        title: 'Scope Partial',
        centerCount: statistics.localView.partiallyBlockedDomains,
        color: '#4C79F4',
        onClick: () =>
          setPresetFilters((prev) => ({
            ...prev,
            filter: {
              scriptBlocking: ['Scope Partial'],
            },
          })),
      },
    ],
    global: [
      {
        title: 'Scope Complete',
        centerCount: statistics.globalView.completelyBlockedDomains,
        color: '#F3AE4E',
      },
      {
        title: 'Scope Partial',
        centerCount: statistics.globalView.partiallyBlockedDomains,
        color: '#4C79F4',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ProgressBar additionalStyles="w-80 h-80" />
      </div>
    );
  }

  return (
    <MdlCommonPanel
      formedJson={null}
      tableColumns={tableColumns}
      tableSearchKeys={['domain', 'owner']}
      tableData={tableData}
      selectedKey={selectedKey ?? ''}
      onRowClick={(row) =>
        setSelectedKey((row as MDLTableData)?.domain || null)
      }
      extraInterfaceToTopBar={checkbox}
      filters={filters}
      stats={stats}
      showJson={false}
      bottomPanel={Legend}
      tab="scriptBlocking"
    />
  );
};

export default MDLTable;
