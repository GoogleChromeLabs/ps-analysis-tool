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
import React, { useCallback } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { MenuOpenIcon } from '../../icons';
import { useSidebar } from './useSidebar';

const CollapsedSidebar = () => {
  const {
    collapsedSidebarItems,
    updateSelectedItemKey,
    currentSelectedItemKey,
    toggleSidebarCollapse,
  } = useSidebar(({ state, actions }) => ({
    collapsedSidebarItems: state.collapsedSidebarItems,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    currentSelectedItemKey: state.currentItemKey,
    toggleSidebarCollapse: actions.toggleSidebarCollapse,
  }));

  const handleFooterElementClick = useCallback(
    (e: React.MouseEvent, key: string) => {
      e.stopPropagation();
      e.preventDefault();

      updateSelectedItemKey(key);
    },
    [updateSelectedItemKey]
  );

  return (
    <div
      className={classNames(
        'flex flex-col justify-between items-center p-2 w-full h-full'
      )}
    >
      <button
        className="cursor-pointer hover:opacity-60"
        title="Expand Sidebar Menu"
        onClick={toggleSidebarCollapse}
      >
        <MenuOpenIcon className="dark:fill-bright-gray fill-granite-gray w-5 h-5 rotate-180" />
      </button>
      <div className="flex flex-col gap-4">
        {Object.keys(collapsedSidebarItems?.footerElements || {}).map((key) => {
          const Icon = collapsedSidebarItems?.footerElements[key].icon.Element;

          if (Icon === undefined) {
            return null;
          }

          const props = collapsedSidebarItems?.footerElements[key].icon.props;
          const title = collapsedSidebarItems?.footerElements[key].title;

          return (
            <button
              key={key}
              title={typeof title === 'function' ? title() : title}
              className={classNames(
                'cursor-pointer hover:opacity-70 p-1 rounded-full',
                {
                  'bg-white dark:bg-raisin-black':
                    key === currentSelectedItemKey,
                }
              )}
              onClick={(e) => handleFooterElementClick(e, key)}
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
