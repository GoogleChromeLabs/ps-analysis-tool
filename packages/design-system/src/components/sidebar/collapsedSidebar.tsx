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
import { useSidebar, type SidebarItemValue } from './useSidebar';

const CollapsedSidebar = () => {
  const {
    collapsedSidebarItems,
    updateSelectedItemKey,
    currentSelectedItemKey,
    toggleSidebarCollapse,
    sidebarItems,
    selectedItemKey,
  } = useSidebar(({ state, actions }) => ({
    collapsedSidebarItems: state.collapsedSidebarItems,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    currentSelectedItemKey: state.currentItemKey,
    toggleSidebarCollapse: actions.toggleSidebarCollapse,
    sidebarItems: state.sidebarItems,
    selectedItemKey: state.selectedItemKey,
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
      <div className="flex flex-col gap-2 justify-center items-center">
        <button
          className="cursor-pointer hover:opacity-60"
          title="Expand Sidebar Menu"
          onClick={toggleSidebarCollapse}
        >
          <MenuOpenIcon className="dark:fill-bright-gray fill-granite-gray w-5 h-5 rotate-180" />
        </button>
        {Object.keys(sidebarItems).map((itemKey) => {
          if (
            Object.keys(collapsedSidebarItems?.footerElements || {}).includes(
              itemKey
            )
          ) {
            return null;
          }

          const isCurrent = itemKey === selectedItemKey;
          const sidebarItem = sidebarItems[itemKey] as SidebarItemValue;
          const icon = sidebarItem.icon || null;
          const Icon = icon?.Element || null;
          const props = icon?.props || {};
          const title =
            typeof sidebarItem.title === 'function'
              ? sidebarItem.title()
              : sidebarItem.title;

          const buttonClassNames = classNames({
            'cursor-default! opacity-40': isCurrent,
            'hover:opacity-60': !isCurrent,
          });

          return (
            <button
              key={title}
              title={title}
              className={buttonClassNames}
              onClick={() => updateSelectedItemKey(itemKey)}
            >
              {Icon && <Icon {...props} />}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        {Object.keys(collapsedSidebarItems?.footerElements || {}).map((key) => {
          const Icon = collapsedSidebarItems?.footerElements[key].icon.Element;

          if (Icon === undefined) {
            return null;
          }

          const props = collapsedSidebarItems?.footerElements[key].icon.props;
          const title = collapsedSidebarItems?.footerElements[key].title;
          const isCurrent = key === currentSelectedItemKey;

          return (
            <button
              key={key}
              title={typeof title === 'function' ? title() : title}
              className={classNames('rounded-full p-1', {
                'opacity-70 cursor-auto dark:opacity-40': isCurrent,
                'hover:opacity-70': !isCurrent,
              })}
              onClick={(e) => handleFooterElementClick(e, key)}
            >
              <Icon
                width="20"
                height="20"
                className="dark:fill-bright-gray fill-granite-gray"
                {...props}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CollapsedSidebar;
