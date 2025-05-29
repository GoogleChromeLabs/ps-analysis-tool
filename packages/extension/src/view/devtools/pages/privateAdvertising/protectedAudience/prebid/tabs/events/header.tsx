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
  Error,
  MultiSelectDropDown,
  SearchInput,
  WarningColored,
} from '@google-psat/design-system';
import {
  useCallback,
  useMemo,
  type Dispatch,
  type SetStateAction,
} from 'react';

/**
 * Internal dependencies
 */
import type { PrebidEvents } from '../../../../../../../../store';

type HeaderProps = {
  errorEvents: PrebidEvents['errorEvents'];
  filteredErrorEvents: PrebidEvents['errorEvents'];
  setSelectedDropdownValues: Dispatch<SetStateAction<string[]>>;
  setSearchValue: Dispatch<SetStateAction<string>>;
  selectedDropDownValues: string[];
  searchValue: string;
};
const Header = ({
  errorEvents,
  filteredErrorEvents,
  setSelectedDropdownValues,
  setSearchValue,
  selectedDropDownValues,
  searchValue,
}: HeaderProps) => {
  const eventsCount = useMemo(() => {
    const counter = {
      warnings: 0,
      errors: 0,
      total: errorEvents.length,
    };

    errorEvents.forEach((event) => {
      if (event.type === 'WARNING') {
        counter.warnings += 1;
      }
      if (event.type === 'ERROR') {
        counter.errors += 1;
      }
    });

    return counter;
  }, [errorEvents]);

  const onChange = useCallback(
    (options: string[]) => {
      setSelectedDropdownValues(options);
    },
    [setSelectedDropdownValues]
  );

  return (
    <div
      className={`flex flex-row px-4 items-center gap-1.5 divide-x divide-gray-200 dark:divide-gray-500 py-1 ${
        filteredErrorEvents.length === 0 ? 'mb-1' : ''
      }`}
    >
      <div className="w-[50%] h-full">
        <SearchInput
          inputExtraClass="rounded-full"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          clearInput={() => {
            setSearchValue('');
          }}
        />
      </div>
      <div className="w-max h-full px-1.5">
        <MultiSelectDropDown
          options={[
            { value: 'ALL', label: 'Default levels' },
            { value: 'INFO', label: 'Info' },
            { value: 'WARNING', label: 'Warnings' },
            { value: 'ERROR', label: 'Errors' },
          ]}
          placeholder="Hide All"
          onChange={onChange}
          selected={selectedDropDownValues}
        />
      </div>
      <div className="w-max h-full flex flex-row gap-2 items-center px-1.5 text-raisin-black dark:text-bright-gray">
        <div>
          <span>{`${eventsCount.total} Issues`}</span>
        </div>
        <div className="h-full flex flex-row gap-1 items-center text-raisin-black dark:text-bright-gray">
          <Error />
          <span title={`${eventsCount.errors} errors`}>
            {eventsCount.errors}
          </span>
        </div>
        <div className="h-full flex flex-row gap-1 items-center text-raisin-black dark:text-bright-gray">
          <WarningColored />
          <span title={`${eventsCount.errors} warnings`}>
            {eventsCount.warnings}
          </span>
        </div>
      </div>
      <div className="flex h-full items-center w-max px-1.5 text-raisin-black dark:text-bright-gray">
        <span>{errorEvents.length - filteredErrorEvents.length} hidden</span>
      </div>
    </div>
  );
};
export default Header;
