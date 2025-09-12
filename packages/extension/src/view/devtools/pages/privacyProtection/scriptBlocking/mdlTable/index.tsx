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
} from '@google-psat/design-system';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import type { MDLTableData } from '@google-psat/common';

/**
 * Internal dependencies
 */
import { useScriptBlocking } from '../../../../stateProviders';
import MdlCommonPanel from '../../mdlCommonPanel';

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
  const { uniqueResponseDomains } = useScriptBlocking(({ state }) => ({
    uniqueResponseDomains: state.uniqueResponseDomains,
  }));

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
        <span className="whitespace-nowrap">Show only highlighted domains</span>
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
        header: 'Impacted by Script Blocking',
        accessorKey: 'scriptBlocking',
        cell: (info) => info,
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(
    () => ({
      owner: {
        title: 'Owner',
      },
      scriptBlocking: {
        title: 'Impacted by Script Blocking',
        hasStaticFilterValues: true,
        filterValues: {
          [IMPACTED_BY_SCRIPT_BLOCKING.PARTIAL]: {
            selected: false,
            description: IMPACTED_BY_SCRIPT_BLOCKING.PARTIAL,
          },
          [IMPACTED_BY_SCRIPT_BLOCKING.ENTIRE]: {
            selected: false,
            description: IMPACTED_BY_SCRIPT_BLOCKING.ENTIRE,
          },
        },
      },
    }),
    []
  );

  const stats = {
    site: [
      {
        title: 'Competely Blocked',
        centerCount: 5,
        color: '#F3AE4E',
      },
      {
        title: 'Partially Blocked',
        centerCount: 8,
        color: '#4C79F4',
      },
    ],
    global: [
      {
        title: 'Competely Blocked',
        centerCount: 1,
        color: '#F3AE4E',
      },
      {
        title: 'Partially Blocked',
        centerCount: 9,
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
      tableData={tableData}
      selectedKey={selectedKey}
      onRowClick={(row) =>
        setSelectedKey((row as MDLTableData)?.domain || null)
      }
      extraInterfaceToTopBar={checkbox}
      filters={filters}
      stats={stats}
    />
  );
};

export default MDLTable;
