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
import { noop } from '@google-psat/common';
import React, { useCallback, useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import isValidURL from '../../../../../../utils/isValidURL';

type ClassificationResultIndex = ClassificationResult & {
  index: number;
};

const TopicsClassifier = () => {
  const [websites, setWebsites] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [validationErrors, setInputValidationErrors] = useState<string[]>([]);
  const [classificationResult, setClassificationResult] = useState<
    ClassificationResultIndex[]
  >([]);
  const [selectedKey, setSelectedKey] = useState<string>('');

  const handleClick = useCallback(async () => {
    const hosts = websites.split('\n');
    const preprocessedHosts: string[] = [];
    const inputValidationErrors: string[] = [];
    setInputValidationErrors([]);

    hosts.forEach((host) => {
      const trimmedHost = host.trim();
      if (trimmedHost === '') {
        return;
      }

      preprocessedHosts.push(trimmedHost);
    });

    preprocessedHosts.forEach((host) => {
      if (!isValidURL(host)) {
        inputValidationErrors.push('Host "' + host + '" is invalid.');
      } else {
        if (!new URL(host).hostname) {
          inputValidationErrors.push('Host "' + host + '" is invalid.');
        }
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

      let jsonResponse = await response.json();
      jsonResponse = jsonResponse.map(
        (res: ClassificationResult, index: number) => {
          return {
            ...res,
            index: index,
          };
        }
      );

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

    setSelectedKey(
      `
      ${(data as ClassificationResult).domain}
        ${(data as ClassificationResultIndex).index}
    `
    );
  }, []);

  const getRowObjectKey = useCallback((row: TableRow) => {
    return `
      ${(row?.originalData as ClassificationResult).domain}
        ${(row?.originalData as ClassificationResultIndex).index}
    `;
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex p-4 w-full flex flex-col">
        <textarea
          placeholder={`One host per line. For example: \ngoogle.com \nyoutube.com`}
          className="p-2.5 leading-5 border border-american-silver dark:border-quartz mb-3 cursor-text bg-white dark:bg-charleston-green text-raisin-black dark:text-bright-gray"
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
      {validationErrors.length > 0 && (
        <div className="flex p-4 w-full flex flex-col">
          {validationErrors.map((error, index) => (
            <div
              className="text-xs p-1 rounded-sm dark:bg-tomato-red bg-baby-pink dark:text-bright-gray font-medium"
              key={index}
            >
              {error}
            </div>
          ))}
        </div>
      )}
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
