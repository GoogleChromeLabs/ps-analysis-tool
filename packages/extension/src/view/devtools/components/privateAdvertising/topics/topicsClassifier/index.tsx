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
  TableProvider,
  type TableColumn,
  type TableRow,
  Table,
  type ClassificationResult,
  type TableData,
} from '@google-psat/design-system';
import { noop } from 'lodash-es';
import React, { useCallback, useMemo, useState } from 'react';

/**
 * Internal dependencies.
 */

const TopicsClassifier = () => {
  const [websites, setWebsites] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationErrors, setInputValidationErrors] = useState<string[]>([]);
  const [classificationResult, setClassificationResult] = useState<
    ClassificationResult[]
  >([]);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const handleClick = useCallback(async () => {
    const hosts = websites.split('\n');
    const preprocessedHosts: string[] = [];
    const inputValidationErrors: string[] = [];

    hosts.forEach((host) => {
      const trimmedHost = host.trim();
      if (trimmedHost === '') {
        return;
      }
      preprocessedHosts.push(trimmedHost);
    });

    preprocessedHosts.forEach((host) => {
      if (host.includes('/')) {
        inputValidationErrors.push(
          'Host "' + host + '" contains invalid character: "/"'
        );
      }
    });

    if (inputValidationErrors.length > 0) {
      setInputValidationErrors(inputValidationErrors);
    } else {
      const response = await fetch(
        'https://topics.privacysandbox.report/classify',
        {
          method: 'POST',
          body: JSON.stringify({
            domains: preprocessedHosts,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const jsonResponse = await response.json();
      setClassificationResult(jsonResponse);
    }
  }, [websites]);

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Host',
        accessorKey: 'domain',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Categories',
        accessorKey: 'categories',
        cell: (info) => (info as string[]).join(','),
      },
    ],
    []
  );

  const onRowClick = useCallback((data: TableData | null) => {
    if (!data) {
      return;
    }

    setSelectedKey((data as ClassificationResult).domain);
  }, []);

  const getRowObjectKey = useCallback(
    (row: TableRow) =>
      (row?.originalData as ClassificationResult).domain as string,
    []
  );

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 p-4 w-full flex flex-col">
        <textarea
          placeholder={`One host per line. For example: \n\ngoogle.com \nyoutube.com`}
          className="p-2.5 leading-5 border border-american-silver dark:border-quartz mb-3"
          cols={50}
          value={websites}
          onChange={(e) => setWebsites(e.target.value)}
          rows={5}
        />
        <button
          disabled={websites.length === 0}
          className="h-fit w-fit rounded-lg bg-gainsboro p-3"
          onClick={handleClick}
        >
          Classify
        </button>
      </div>
      {classificationResult?.length > 0 && (
        <div className="flex-1 w-full flex flex-col border border-american-silver dark:border-quartz">
          <TableProvider
            data={classificationResult}
            tableColumns={tableColumns}
            onRowClick={onRowClick}
            getRowObjectKey={getRowObjectKey}
            onRowContextMenu={noop}
          >
            <Table
              hideTableTopBar={true}
              selectedKey={selectedKey}
              hideFiltering={true}
            />
          </TableProvider>
        </div>
      )}
    </div>
  );
};

export default TopicsClassifier;
