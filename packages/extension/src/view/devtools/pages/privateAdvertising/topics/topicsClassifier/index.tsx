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
  Button,
} from '@google-psat/design-system';
import { noop } from '@google-psat/common';
import React, { useCallback, useMemo, useState } from 'react';
/**
 * Internal dependency
 */
import { useTopicsClassifier } from '../../../../stateProviders';

type ClassificationResultIndex = ClassificationResult & {
  index: number;
};

const TopicsClassifier = () => {
  const {
    setWebsites,
    handleClassification,
    validationErrors,
    websites,
    classificationResult,
  } = useTopicsClassifier(({ state, actions }) => ({
    websites: state.websites,
    validationErrors: state.validationErrors,
    classificationResult: state.classificationResult,
    setWebsites: actions.setWebsites,
    handleClassification: actions.handleClassification,
  }));

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

  const tableColumns = useMemo<TableColumn[]>(
    () => [
      {
        header: 'Host',
        accessorKey: 'domain',
        cell: (info) => info,
        enableHiding: false,
      },
      {
        header: 'Topics',
        accessorKey: 'categories',
        cell: (info) => (
          <div>
            {((info as ClassificationResult['categories']) ?? []).map(
              ({ id, name }, index) => (
                <div
                  key={index}
                  className="p-1 text-xs hover:opacity-60 active:opacity-50 hover:underline cursor-pointer"
                  onClick={() => topicsNavigator(name)}
                >
                  {`${id}. ${name.split('/').pop()}`}
                </div>
              )
            )}
          </div>
        ),
        sortingComparator: (a, b) => {
          const aTopics = ((a as ClassificationResult['categories']) ?? [])
            .map((topic) => topic.name.split('/').pop())
            .join(', ');
          const bTopics = ((b as ClassificationResult['categories']) ?? [])
            .map((topic) => topic.name.split('/').pop())
            .join(', ');

          return aTopics.localeCompare(bTopics);
        },
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

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleClassification();
      }
    },
    [handleClassification]
  );

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex p-4 w-full flex-col gap-4">
        <textarea
          placeholder={`One host per line. For example: \ngoogle.com \nyoutube.com`}
          className="p-2 outline-none border border-gainsboro dark:border-quartz dark:bg-raisin-black dark:text-bright-gray text-outer-space-crayola text-xs leading-normal focus:border-bright-navy-blue focus:dark:border-medium-persian-blue"
          cols={50}
          value={websites}
          onChange={(e) => setWebsites(e.target.value)}
          rows={5}
          onKeyDown={onKeyDown}
        />
        <Button
          onClick={handleClassification}
          text={'Classify'}
          extraClasses="w-16 h-8 text-center justify-center text-xs"
        />
      </div>
      {validationErrors.length > 0 && (
        <div className="flex p-4 w-full flex-col">
          {validationErrors.map((error, index) => (
            <div
              key={index}
              className="flex items-center gap-2 w-full dark:bg-tomato-red bg-baby-pink m-0.25 px-2 py-1 rounded"
            >
              <CancelIcon className="w-4 h-4 dark:fill-blood-red fill-bright-red" />
              <div className="text-xs rounded-sm dark:text-bright-gray">
                {error}
              </div>
            </div>
          ))}
        </div>
      )}
      {classificationResult?.length > 0 && (
        <div className="flex-1 w-fit flex flex-col border border-american-silver dark:border-quartz border-t-0 border-l-0 mt-6">
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
