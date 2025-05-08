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
import { noop, type ErroredOutUrlsData } from '@google-psat/common';
import { I18n } from '@google-psat/i18n';
import {
  Table,
  TableProvider,
  type TableColumn,
  type InfoType,
  type TableRow,
  type TableFilter,
} from '@google-psat/design-system';

interface ErroredOutUrlsProps {
  erroredOutUrls: ErroredOutUrlsData[];
}

const ErroredOutUrls = ({ erroredOutUrls }: ErroredOutUrlsProps) => {
  const [selectedRow, setSelectedRow] = useState<ErroredOutUrlsData>();

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'URL',
        accessorKey: 'url',
        cell: (info: InfoType) => info,
        enableHiding: false,
      },
      {
        header: 'Error Description',
        accessorKey: 'errorMessage',
        cell: (info: InfoType) => info,
      },
      {
        header: 'Error Code',
        accessorKey: 'errorCode',
        cell: (info: InfoType) => (
          <span className="w-full flex justify-center">{info}</span>
        ),
      },
    ],
    []
  );

  const filters = useMemo<TableFilter>(() => ({}), []);

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
          data={erroredOutUrls}
          tableColumns={tableColumns}
          tableFilterData={filters}
          tableSearchKeys={['url']}
          tablePersistentSettingsKey="urlsWithIssues"
          onRowClick={(row) => {
            setSelectedRow(row as ErroredOutUrlsData);
          }}
          onRowContextMenu={noop}
          getRowObjectKey={(row: TableRow) => {
            return (row.originalData as ErroredOutUrlsData).url;
          }}
        >
          <Table hideFiltering={true} selectedKey={selectedRow?.url} />
        </TableProvider>
      </Resizable>
      <div className="flex-1 border border-gray-300 dark:border-quartz shadow-sm h-full min-w-[10rem]">
        {selectedRow ? (
          <div className="text-xs py-1 px-1.5">
            {selectedRow.url && (
              <>
                <p className="font-bold text-granite-gray dark:text-manatee mb-1 text-semibold flex items-center">
                  <span>Error Message</span>
                </p>
                <p className="mb-4 break-words text-outer-space-crayola dark:text-bright-gray">
                  {selectedRow.errorMessage}
                </p>
              </>
            )}
            <>
              <p className="font-bold text-granite-gray dark:text-manatee mb-1">
                Error code
              </p>
              <p className="mb-4 text-outer-space-crayola dark:text-bright-gray">
                {selectedRow?.errorCode || I18n.getMessage('noDescription')}
              </p>
            </>
            {selectedRow?.stackTrace && (
              <>
                <p className="font-bold text-granite-gray dark:text-manatee mb-1">
                  Stack trace
                </p>
                <p className="text-outer-space-crayola dark:text-bright-gray">
                  <pre>
                    <code
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedRow?.stackTrace ||
                          I18n.getMessage('noDescription'),
                      }}
                    />
                  </pre>
                </p>
              </>
            )}
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

export default ErroredOutUrls;
