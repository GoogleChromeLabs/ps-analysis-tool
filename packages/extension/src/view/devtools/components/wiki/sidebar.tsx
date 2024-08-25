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
import React, { type Dispatch, type SetStateAction } from 'react';
import { Resizable } from 're-resizable';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import type { MenuItemType } from './link';
import MenuItem from './menuItem';

export interface SidebarMenuItem {
  title: string;
  menu: MenuItemType[];
}

type SidebarMenuProps = {
  data?: SidebarMenuItem[];
  setCurrentSelectedPage: Dispatch<SetStateAction<string>>;
  setCurrentHash: Dispatch<SetStateAction<string | null>>;
  currentHash: string | null;
  currentSelectedPage: string;
};

const Sidebar = ({
  data,
  setCurrentSelectedPage,
  currentSelectedPage,
  setCurrentHash,
  currentHash,
}: SidebarMenuProps) => {
  const renderMenuItems = (menu: MenuItemType[]) => {
    return (
      <ul className="list-disc ml-3">
        {menu.map((menuItem) => (
          <MenuItem
            key={menuItem.name}
            menuItem={menuItem}
            setCurrentSelectedPage={setCurrentSelectedPage}
            currentSelectedPage={currentSelectedPage}
            setCurrentHash={setCurrentHash}
            currentHash={currentHash}
          >
            {menuItem?.menu &&
              menuItem.menu?.length > 0 &&
              renderMenuItems(menuItem.menu)}
          </MenuItem>
        ))}
      </ul>
    );
  };

  return (
    <Resizable
      defaultSize={{ width: '220px', height: '100%' }}
      minWidth="150px"
      maxWidth="90%"
      enable={{ right: true }}
    >
      <div className="markdown-body wiki-sidebar w-full h-full overflow-auto border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz dark:bg-raisin-black p-5">
        {data && data?.length > 0 && (
          <ul>
            {data.map((topMenuItem, index) => {
              const listClassNames = classNames(
                'font-semibold text-sm text-outer-space block mb-2 dark:text-bright-gray',
                {
                  'mt-4': index !== 0,
                }
              );

              return (
                <li key={topMenuItem.title}>
                  <span className={listClassNames}>{topMenuItem.title}</span>
                  {renderMenuItems(topMenuItem.menu)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Resizable>
  );
};

export default Sidebar;
