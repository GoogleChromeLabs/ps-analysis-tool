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
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type { MDLTableData } from '@google-psat/common';

/**
 * Internal dependencies
 */
import { useScriptBlocking } from '../../../../stateProviders';
import MdlCommonPanel from '../../mdlCommonPanel';
import Legend from './legend';

export const IMPACTED_BY_SCRIPT_BLOCKING = {
  NONE: 'Not Impacted By Script Blocking',
  PARTIAL: 'Some URLs are Blocked',
  ENTIRE: 'Entire Domain Blocked',
};

const DATA_URL =
  'https://raw.githubusercontent.com/GoogleChrome/ip-protection/refs/heads/main/Masked-Domain-List.md';

const MDLTable = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [showOnlyHighlighted, setShowOnlyHighlighted] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { uniqueResponseDomains, statistics } = useScriptBlocking(
    ({ state }) => ({
      uniqueResponseDomains: state.uniqueResponseDomains,
      statistics: state.statistics,
    })
  );

  const [initialTableData, setinitialTableData] = useState<
    { domain: string; owner: string; scriptBlocking: string }[]
  >([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const response = await fetch(DATA_URL);

      if (!response.ok) {
        setIsLoading(false);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();

      const lines = text
        .split('\n')
        .filter((line) => line.includes('|'))
        .slice(2);

      const mdlData = lines
        .map((line) => line.split('|').map((item) => item.trim()))
        .filter((item) => item[2] !== IMPACTED_BY_SCRIPT_BLOCKING.NONE);

      setinitialTableData(() => {
        const data = mdlData.map((item: string[]) => {
          let owner = item[1];

          if (item[1].includes('PSL Domain')) {
            owner = 'PSL Domain';
          }

          const scriptBlocking = item[2];

          return {
            domain: item[0],
            owner,
            scriptBlocking,
          };
        });

        setIsLoading(false);

        return data;
      });
    })();
  }, []);

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
    if (initialTableData.length === 0) {
      return [];
    }

    const data: MDLTableData[] = [];

    initialTableData.forEach((item) => {
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
            available && item.scriptBlocking.startsWith('Some URLs are Blocked')
              ? 'bg-amber-100'
              : '',
        } as MDLTableData);
      }
    });

    return data.sort((a, b) => Number(b.highlighted) - Number(a.highlighted));
  }, [uniqueResponseDomains, initialTableData, showOnlyHighlighted]);

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
        cell: (info) => info,
      },
    ],
    []
  );

  const calculateFilters = useCallback((data: MDLTableData[]) => {
    const _filters: {
      [key: string]: {
        selected: boolean;
        description: string;
      };
    } = {};

    const titleMap = {
      COMPLETE: 'Scope Complete',
      PARTIAL: 'Scope Partial',
    };

    data.forEach((singleData) => {
      _filters[titleMap[singleData.scriptBlocking as keyof typeof titleMap]] = {
        selected: false,
        description: IMPACTED_BY_SCRIPT_BLOCKING[
          singleData.scriptBlocking as keyof typeof IMPACTED_BY_SCRIPT_BLOCKING
        ] as string,
      };
    });

    return _filters;
  }, []);

  const filters = useMemo<TableFilter>(
    () => ({
      owner: {
        title: 'Owner',
      },
      scriptBlocking: {
        title: 'Impacted by Script Blocking',
        hasStaticFilterValues: true,
        hasPrecalculatedFilterValues: true,
        filterValues: calculateFilters(tableData),
        comparator: (value: InfoType, filterValue: string) => {
          switch (filterValue) {
            case 'COMPLETE':
              return value === 'COMPLETE';
            case 'PARTIAL':
              return value === 'PARTIAL';
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
      },
      {
        title: 'Scope Partial',
        centerCount: statistics.localView.partiallyBlockedDomains,
        color: '#4C79F4',
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
