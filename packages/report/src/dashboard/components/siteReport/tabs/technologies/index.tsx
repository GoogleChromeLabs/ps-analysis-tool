/*
 * Copyright 2023 Google LLC
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
import { useMemo, useState } from 'react';
import { Resizable } from 're-resizable';
import { noop, type TechnologyData } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  Table,
  TableProvider,
  type TableColumn,
  type InfoType,
  type TableRow,
  type TableFilter,
} from '@google-psat/design-system';
/**
 * Internal dependencies
 */

import { useContentStore } from '../../stateProviders/contentStore';

interface TechnologiesProps {
  selectedSite: string | null;
}

const Technologies = ({ selectedSite }: TechnologiesProps) => {
  const data = useContentStore(({ state }) => state.technologies || []);

  const [selectedRow, setSelectedRow] = useState<TechnologyData>();

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: I18n.getMessage('name'),
        accessorKey: 'name',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: I18n.getMessage('description'),
        accessorKey: 'description',
        cell: (info: InfoType) => info,
      },
      {
        header: I18n.getMessage('confidence'),
        accessorKey: 'confidence',
        cell: (info: InfoType) => (
          <span className="w-full flex justify-center">{info + '%'}</span>
        ),
      },
      {
        header: I18n.getMessage('website'),
        accessorKey: 'website',
        cell: (info: InfoType) => info,
      },
      {
        header: I18n.getMessage('category'),
        accessorKey: 'categories',
        cell: (info: InfoType) =>
          (info as TechnologyData['categories']).map((i) => i.name).join(' | '),
        sortingComparator: (a: InfoType, b: InfoType) => {
          const aCategories =
            (a as TechnologyData['categories'])
              ?.map((i) => i.name)
              .join(' | ') || '';
          const bCategories =
            (b as TechnologyData['categories'])
              ?.map((i) => i.name)
              .join(' | ') || '';

          return aCategories.localeCompare(bCategories);
        },
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(() => ({}), []);

  const searchKeys = useMemo<string[]>(() => ['name', 'website'], []);

  const tablePersistentSettingsKey = useMemo<string>(() => {
    if (selectedSite) {
      return `technologyListing#${selectedSite}`;
    }

    return 'technologyListing';
  }, [selectedSite]);

  return (
    <div className="w-full h-full text-outer-space-crayola border-x border-american-silver dark:border-quartz flex flex-col">
      <Resizable
        defaultSize={{
          width: '100%',
          height: '80%',
        }}
        minHeight="6%"
        maxHeight="95%"
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
        }}
        className="h-full flex"
      >
        <TableProvider
          data={data}
          tableColumns={tableColumns}
          tableFilterData={filters}
          tableSearchKeys={searchKeys}
          tablePersistentSettingsKey={tablePersistentSettingsKey}
          onRowClick={(row) => {
            setSelectedRow(row as TechnologyData);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return (row.originalData as TechnologyData).slug;
          }}
        >
          <Table hideFiltering={true} selectedKey={selectedRow?.slug} />
        </TableProvider>
      </Resizable>
      <div className="flex-1 border border-gray-300 dark:border-quartz shadow h-full min-w-[10rem]">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            {selectedRow.name && (
              <>
                <p className="font-bold text-granite-gray dark:text-manatee mb-1 text-semibold flex items-center">
                  <span>{I18n.getMessage('technologyDetails')}</span>
                </p>
                <p className="mb-4 break-words text-outer-space-crayola dark:text-bright-gray">
                  {selectedRow.name}
                </p>
              </>
            )}
            <>
              <p className="font-bold text-granite-gray dark:text-manatee mb-1">
                {I18n.getMessage('description')}
              </p>
              <p className="text-outer-space-crayola dark:text-bright-gray">
                {selectedRow?.description || I18n.getMessage('noDescription')}
              </p>
            </>
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

export default Technologies;
