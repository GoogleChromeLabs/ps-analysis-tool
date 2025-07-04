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
  type TableColumn,
  TableProvider,
  Table,
  JsonView,
  type TableData,
  type PrebidConfigTableData,
  ResizableTray,
} from '@google-psat/design-system';
import { I18n } from '@google-psat/i18n';
import { noop } from 'lodash-es';
import { useState, useMemo, useCallback } from 'react';

type InstalledModulesPanelProps = {
  installedModules: string[];
};

type InstalledModulesTypes =
  | 'bidAdapters'
  | 'analyticsAdapters'
  | 'idSystems'
  | 'miscellaneous';

const InstalledModules = ({ installedModules }: InstalledModulesPanelProps) => {
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<
    InstalledModulesTypes | string
  >('');
  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Adapter Types',
        accessorKey: 'name',
        cell: (info) => info,
        enableHiding: false,
      },
    ],
    []
  );

  //This function calculates the adapters based on their name.
  const calculatedAdapters = useMemo(() => {
    const bidAdapters = installedModules
      .filter((module) => module.includes('BidAdapter'))
      .sort();

    const analyticsAdapters = installedModules
      .filter((module) => module.includes('AnalyticsAdapter'))
      .sort();

    const idSystems = installedModules
      .filter(
        (module) => module.includes('IdSystem') || module.includes('UserID')
      )
      .sort();

    const miscellaneous = installedModules
      .filter(
        (module) =>
          !module.includes('BidAdapter') &&
          !module.includes('AnalyticsAdapter') &&
          !module.includes('IdSystem')
      )
      .sort();

    return {
      bidAdapters,
      analyticsAdapters,
      idSystems,
      miscellaneous,
    };
  }, [installedModules]);

  const isRowSelected = useCallback(
    (data: TableData | null) => {
      const _data = data as {
        name: string;
        value: string | number | boolean;
        index: number;
      };

      if (!_data) {
        return true;
      }

      return _data.index.toString() === selectedKey;
    },
    [selectedKey]
  );

  return (
    <div className="w-[70%] h-full text-outer-space-crayola flex flex-col border-r border-american-silver dark:border-quartz">
      <ResizableTray
        defaultSize={{
          width: '100%',
          height: selectedRow ? '50%' : '90%',
        }}
        minHeight="15%"
        maxHeight="90%"
        enable={{
          bottom: true,
        }}
        trayId="installed-modules-table-bottom-tray"
      >
        <TableProvider
          data={[
            {
              name: 'Bid Adapters',
              value: 'bidAdapters',
              index: 0,
            },
            {
              name: 'Analytics Adapters',
              value: 'analyticsAdapters',
              index: 1,
            },
            {
              name: 'Identity Systems',
              value: 'idSystems',
              index: 2,
            },
            {
              name: 'Miscellaneous',
              value: 'miscellaneous',
              index: 3,
            },
          ]}
          tableColumns={tableColumns}
          isRowSelected={isRowSelected}
          onRowClick={(row) => {
            setSelectedKey(
              (row as PrebidConfigTableData)?.index.toString() ?? ''
            );
            setSelectedRow(
              (row as PrebidConfigTableData)?.value as InstalledModulesTypes
            );
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row) =>
            (row?.originalData as PrebidConfigTableData).index.toString()
          }
        >
          <Table
            hideTableTopBar={true}
            selectedKey={selectedKey}
            minWidth="70%"
            showOverflow={false}
          />
        </TableProvider>
      </ResizableTray>
      <div className="flex-1 text-raisin-black dark:text-bright-gray border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem] bg-white dark:bg-raisin-black overflow-auto">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            <JsonView
              src={
                calculatedAdapters[selectedRow as InstalledModulesTypes] ?? {}
              }
            />
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

export default InstalledModules;
