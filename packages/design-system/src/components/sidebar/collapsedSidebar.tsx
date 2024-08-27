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

/**
 * Internal dependencies.
 */
import { DoubleArrowIcon } from '../../icons';
import { useSidebar } from './useSidebar';
import classNames from 'classnames';

const CollapsedSidebar = () => {
  const {
    collapsedSidebarItems,
    toggleSidebarCollapse,
    updateSelectedItemKey,
    currentSelectedItemKey,
  } = useSidebar(({ state, actions }) => ({
    collapsedSidebarItems: state.collapsedSidebarItems,
    toggleSidebarCollapse: actions.toggleSidebarCollapse,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    currentSelectedItemKey: state.currentItemKey,
  }));

  return (
    <div className="w-12 h-full bg-bright-gray dark:bg-charleston-green flex flex-col justify-between items-center px-2 py-4 border-r border-gray-300 dark:border-quartz">
      <div />
      <button
        onClick={toggleSidebarCollapse}
        className="cursor-pointer hover:opacity-70"
      >
        <DoubleArrowIcon className="dark:fill-bright-gray fill-granite-gray w-6 h-6" />
      </button>
      <div className="flex flex-col gap-4">
        {Object.keys(collapsedSidebarItems?.footerElements || {}).map((key) => {
          const Icon = collapsedSidebarItems?.footerElements[key].icon.Element;

          if (Icon === undefined) {
            return null;
          }

          const props = collapsedSidebarItems?.footerElements[key].icon.props;

          return (
            <button
              key={key}
              className={classNames(
                'cursor-pointer hover:opacity-70 p-2 rounded-full',
                {
                  'bg-white dark:bg-raisin-black':
                    key === currentSelectedItemKey,
                }
              )}
              onClick={() => updateSelectedItemKey(key)}
            >
              <Icon className="w-5 h-5" {...props} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsedSidebar;
