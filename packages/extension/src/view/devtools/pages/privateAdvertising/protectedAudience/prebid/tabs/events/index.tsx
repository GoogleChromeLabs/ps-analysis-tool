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
import { useState } from 'react';
import type { PrebidEvents } from '@google-psat/common';
/**
 * Internal dependencies
 */

import SingleErrorRow from './singleErrorRow';
import Header from './header';

type EventsPanelProps = {
  errorEvents: PrebidEvents['errorEvents'];
};
const Events = ({ errorEvents = [] }: EventsPanelProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedDropDownValues, setSelectedDropdownValues] = useState([
    'ALL',
    'WARNING',
    'INFO',
    'ERROR',
  ]);

  const filteredErrorEvents = () => {
    if (!searchValue && selectedDropDownValues.includes('ALL')) {
      return errorEvents;
    }

    let filteredEvents = errorEvents;

    if (searchValue) {
      filteredEvents = filteredEvents.filter((event) => {
        return Object.values(event.message)
          .map((value) =>
            typeof value === 'object' ? JSON.stringify(value) : value
          )
          .join(' ')
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
    }

    filteredEvents = filteredEvents.filter((event) => {
      return (
        (selectedDropDownValues.length > 0 &&
          selectedDropDownValues.includes(event.type)) ||
        selectedDropDownValues.includes('ALL')
      );
    });

    return filteredEvents;
  };

  return (
    <div className="flex flex-col border border-hex-gray dark:border-quartz mb-3 mx-4">
      <Header
        errorEvents={errorEvents}
        filteredErrorEvents={errorEvents}
        setSelectedDropdownValues={setSelectedDropdownValues}
        setSearchValue={setSearchValue}
        selectedDropDownValues={selectedDropDownValues}
        searchValue={searchValue}
      />
      {filteredErrorEvents().length > 0 && (
        <div className="h-px bg-gray-200 dark:bg-quartz mb-1" />
      )}
      <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-500 gap-3 px-4">
        {filteredErrorEvents().map((event, index) => {
          return (
            <SingleErrorRow
              key={index}
              message={Object.values(event.message)
                .map((value) =>
                  typeof value === 'object' ? JSON.stringify(value) : value
                )
                .join(' ')}
              time={event.time}
              type={event.type}
              additionalClasses={
                filteredErrorEvents.length === index + 1
                  ? 'border-b border-gray-200 dark:border-quartz'
                  : ''
              }
            />
          );
        })}
      </div>
    </div>
  );
};
export default Events;
