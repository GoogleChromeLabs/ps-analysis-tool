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

type MDLTableProps = {
  type?: 'Observability' | 'Learning';
};

const MDLTable = ({ type = 'Observability' }: MDLTableProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
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
        if (type === 'Learning') {
          data.push({
            ...item,
          } as MDLTableData);
          return;
        }

        let available = false;
        if (uniqueResponseDomains.includes(item.domain)) {
          available = true;
        }

        if (available) {
          data.push({
            ...item,
          } as MDLTableData);
        }
      });

    return data;
  }, [uniqueResponseDomains, scriptBlockingData, type]);

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
        _filters[
          titleMap[singleData.scriptBlocking as keyof typeof titleMap].slice(6)
        ] = {
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
            case 'Complete':
              return value === 'Entire Domain Blocked';
            case 'Partial':
              return value === 'Some URLs are Blocked';
            default:
              return false;
          }
        },
      },
    }),
    [calculateFilters, tableData]
  );

  const stats = [
    {
      title: 'Domains',
      centerCount: statistics.localView.domains,
      color: '#25ACAD',
      tooltipText: 'All page domains',
    },
    {
      title: 'BDL',
      centerCount:
        statistics.localView.partiallyBlockedDomains +
        statistics.localView.completelyBlockedDomains,
      color: '#7D8471',
      tooltipText: 'Page domains in block list',
    },
    {
      title: 'Complete',
      centerCount: statistics.localView.completelyBlockedDomains,
      color: '#F3AE4E',
      tooltipText: 'Completely blocked domains',
      onClick: () =>
        setPresetFilters((prev) => ({
          ...prev,
          filter: {
            scriptBlocking: ['Complete'],
          },
        })),
    },
    {
      title: 'Partial',
      centerCount: statistics.localView.partiallyBlockedDomains,
      color: '#4C79F4',
      tooltipText: 'Partially blocked domains',
      onClick: () =>
        setPresetFilters((prev) => ({
          ...prev,
          filter: {
            scriptBlocking: ['Partial'],
          },
        })),
    },
  ];

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
      filters={filters}
      stats={type === 'Learning' ? null : stats}
      showJson={false}
      bottomPanel={Legend}
      tab="scriptBlocking"
    />
  );
};

export default MDLTable;
