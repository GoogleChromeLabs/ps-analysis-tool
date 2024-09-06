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
import React from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { useSidebar } from '../sidebar';
import { ChevronRight } from '../../icons';

interface BreadcrumbsProps {
  items: Array<{
    title: string;
    key: string;
  }>;
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const updateSelectedItemKey = useSidebar(
    ({ actions }) => actions.updateSelectedItemKey
  );

  return (
    <div className={classNames('w-full flex items-center h-fit')}>
      <div className="flex items-center">
        {items.map((item, index) => (
          <div
            key={item.key}
            onClick={() => updateSelectedItemKey(item.key)}
            className={classNames(
              'cursor-pointer hover:text-blue-500 hover:dark:text-blue-400 active:opacity-70 text-xs flex items-center text-raisin-black dark:text-bright-gray',
              {
                'font-bold': index === items.length - 1,
              }
            )}
          >
            {item.title}
            {index < items.length - 1 && (
              <span className="mx-2">
                <ChevronRight className="w-3 h-3" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Breadcrumbs;
