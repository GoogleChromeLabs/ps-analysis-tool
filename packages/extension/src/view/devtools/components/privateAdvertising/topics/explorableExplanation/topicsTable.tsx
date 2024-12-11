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
import { noop } from '@google-psat/common';
import {
  Table,
  TableProvider,
  useTabs,
  type InfoType,
  type TableColumn,
} from '@google-psat/design-system';
import React, { useEffect, useMemo, useRef } from 'react';

export type TopicsTableType = {
  topicName: string;
  count: number;
  observedByContextDomains: string[];
};

interface TopicsTableProps {
  data: Record<number, TopicsTableType[]>;
  highlightAdTech: string;
  setHighlightAdTech: React.Dispatch<React.SetStateAction<string | null>>;
  topicsNavigator: (topic: string) => void;
}

const AdTechRow = ({
  info,
  highlightAdTech,
  setHighlightAdTech,
}: {
  info: string[];
  highlightAdTech: TopicsTableProps['highlightAdTech'];
  setHighlightAdTech: TopicsTableProps['setHighlightAdTech'];
}) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (highlightAdTech) {
      timeoutRef.current = setTimeout(() => {
        setHighlightAdTech(null);
      }, 2000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [highlightAdTech, setHighlightAdTech]);

  return (
    <div>
      {info.map((adTech, index) => (
        <React.Fragment key={index}>
          <span
            style={{
              backgroundColor:
                adTech === highlightAdTech ? 'yellow' : 'transparent',
            }}
          >
            {adTech}
          </span>
          {index !== info.length - 1 ? ' | ' : ''}
        </React.Fragment>
      ))}
    </div>
  );
};

const TopicsTable = ({
  data,
  highlightAdTech,
  setHighlightAdTech,
  topicsNavigator,
}: TopicsTableProps) => {
  const { activeTab } = useTabs(({ state }) => ({
    activeTab: state.activeTab,
  }));

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Topic Name',
        accessorKey: 'topicName',
        cell: (info: InfoType) => (
          <button
            className="hover:opacity-50"
            onClick={() => topicsNavigator(info as string)}
          >
            {(info as string).split('/').pop() ?? ''}
          </button>
        ),
        enableHiding: false,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Access Count',
        accessorKey: 'count',
        cell: (info: InfoType) => info,
        widthWeightagePercentage: 20,
      },
      {
        header: 'Observed-by context domains',
        accessorKey: 'observedByContextDomains',
        cell: (info: InfoType) => (
          <AdTechRow
            info={info as string[]}
            highlightAdTech={highlightAdTech}
            setHighlightAdTech={setHighlightAdTech}
          />
        ),
        widthWeightagePercentage: 60,
      },
    ],
    [highlightAdTech, setHighlightAdTech, topicsNavigator]
  );

  const tablePersistentSettingsKey = 'topicsTable';

  return (
    <TableProvider
      // @ts-ignore
      data={data[activeTab] ?? []}
      tableColumns={tableColumns}
      onRowClick={noop}
      onRowContextMenu={noop}
      getRowObjectKey={(row) => row.originalData.topicName}
      tablePersistentSettingsKey={tablePersistentSettingsKey}
    >
      <Table hideSearch hideFiltering selectedKey={''} hideTableTopBar />
    </TableProvider>
  );
};

export default TopicsTable;
