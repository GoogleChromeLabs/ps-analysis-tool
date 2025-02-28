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
  CancelIcon,
  useTabs,
} from '@google-psat/design-system';
import { noop } from '@google-psat/common';
import React, { useCallback, useMemo, useState } from 'react';

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
  const { setStorage, setActiveTab } = useTabs(({ actions }) => ({
    setStorage: actions.setStorage,
    setActiveTab: actions.setActiveTab,
  }));

  const topicsNavigator = useCallback(
    (topic: string) => {
      setStorage(
        JSON.stringify({
          taxonomy: topic,
        }),
        2
      );

      setActiveTab(2);
    },
    [setActiveTab, setStorage]
  );

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
      const hostnameRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63}$/;
      if (!hostnameRegex.test(host)) {
        inputValidationErrors.push('Host "' + host + '" is invalid.');
      }
    });

    if (inputValidationErrors.length > 0) {
      setInputValidationErrors(inputValidationErrors);
      return;
    } else {
      try {
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

        jsonResponse.forEach((classifiedCategories: ClassificationResult) => {
          if (classifiedCategories?.error) {
            inputValidationErrors.push(classifiedCategories.error);
          }
        });
        setInputValidationErrors(inputValidationErrors);

        jsonResponse = jsonResponse.filter(
          (classifiedCategories: ClassificationResult) =>
            classifiedCategories?.categories
        );

        setClassificationResult(jsonResponse);
      } catch (err) {
        setInputValidationErrors(['Error: Failed to classify websites']);
      }
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
        cell: (info) => (
          <div>
            {(info as string[]).map((category, index) => (
              <div
                key={index}
                className="p-1 text-xs hover:opacity-60 active:opacity-50 hover:underline cursor-pointer"
                onClick={() => topicsNavigator(category)}
              >
                {category}
              </div>
            ))}
          </div>
        ),
      },
    ],
    [topicsNavigator]
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
      <div className="flex p-4 w-full flex-col">
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
        <div className="flex p-4 w-full flex-col">
          {validationErrors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 w-full dark:bg-tomato-red bg-baby-pink m-0.25 px-2 py-1 rounded"
            >
              <CancelIcon className="w-4 h-4 dark:fill-blood-red fill-bright-red" />
              <div className="text-sm rounded-sm dark:text-bright-gray">
                {error}
              </div>
            </div>
          ))}
        </div>
      )}
      {classificationResult?.length > 0 && (
        <div className="flex-1 w-full flex flex-col border border-american-silver dark:border-quartz overflow-auto">
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
