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
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

/**
 * Internal dependencies
 */
import type { PrebidEvents } from '../../../../../../../../store';

type HeaderProps = {
  errorEvents: PrebidEvents['errorEvents'];
  setSelectedDropdownValues: Dispatch<SetStateAction<string[]>>;
  setSearchValue: Dispatch<SetStateAction<string>>;
  selectedDropDownValues: string[];
  searchValue: string;
};
const Header = ({ errorEvents }: HeaderProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [dropDown, setDropDown] = useState(['ALL', 'WARNING', 'INFO', 'ERROR']);

  const filteredErrorEvents = useMemo(() => {
    if (!searchValue && dropDown.includes('ALL')) {
      return errorEvents;
    }

    let filteredEvents = errorEvents;

    if (searchValue) {
      filteredEvents = errorEvents.filter((event) => {
        return Object.values(event.message).join(' ').includes(searchValue);
      });
    }

    filteredEvents = filteredEvents.filter((event) => {
      return (
        (dropDown.length > 0 && dropDown.includes(event.type)) ||
        dropDown.includes('ALL')
      );
    });

    return filteredEvents;
  }, [dropDown, errorEvents, searchValue]);

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

  const onChange = useCallback((options: string[]) => {
    setDropDown(options);
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row px-4 items-center gap-1.5 divide-x">
        <div className="w-[50%] h-full">
          <SearchInput
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
            onChange={onChange}
            selected={dropDown}
          />
        </div>
        <div className="w-max h-full flex flex-row gap-2 items-center px-1.5 text-raisin-black dark:text-bright-gray">
          <div>
            <span>{`${eventsCount.total} Issues`}</span>
          </div>
          <div className="h-full flex flex-row gap-1 items-center text-raisin-black dark:text-bright-gray">
            <Error />
            <span>{eventsCount.errors}</span>
          </div>
          <div className="h-full flex flex-row gap-1 items-center text-raisin-black dark:text-bright-gray">
            <WarningColored />
            <span>{eventsCount.warnings}</span>
          </div>
        </div>
        <div className="flex h-full items-center w-max px-1.5 text-raisin-black dark:text-bright-gray">
          <span>{errorEvents.length - filteredErrorEvents.length} hidden</span>
        </div>
      </div>
      <div className="h-px bg-gray-200 dark:bg-quartz mb-1" />
    </div>
  );
};
export default Header;
