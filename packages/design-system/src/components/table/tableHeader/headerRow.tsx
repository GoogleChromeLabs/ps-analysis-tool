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
 * External dependencies.
 */
import React from 'react';
import { PreferenceDataValues } from '@cookie-analysis-tool/common';
/**
 * Internal dependencies.
 */
import HeaderCell from './headerCell';
import type { TableOutput } from '../useTable';
interface HeaderRowProps {
  table: TableOutput;
  setIsRowFocused: (state: boolean) => void;
  updatePreference: (
    key: string,
    callback: (prevStatePreference: {
      [key: string]: unknown;
    }) => PreferenceDataValues
  ) => void;
}

const HeaderRow = ({
  table,
  setIsRowFocused,
  updatePreference,
}: HeaderRowProps) => {
  return (
    <div className="bg-anti-flash-white dark:bg-charleston-green border-b border-american-silver dark:border-quartz divide-x divide-american-silver dark:divide-quartz flex">
      {table.columns?.map((cell, idx) => (
        <HeaderCell
          updatePreference={updatePreference}
          key={idx}
          index={idx}
          table={table}
          cell={cell}
          setIsRowFocused={setIsRowFocused}
        />
      ))}
    </div>
  );
};

export default HeaderRow;
