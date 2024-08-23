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

/**
 * Internal dependencies.
 */
import Link, { type MenuItem } from './link';

export interface SidebarMenuItem {
  title: string;
  menu: MenuItem[];
}

type SidebarMenu = {
  data: SidebarMenuItem[] | undefined;
  setCurrentSelectedPage: Dispatch<SetStateAction<string>>;
};

const Sidebar = ({ data, setCurrentSelectedPage }: SidebarMenu) => {
  return (
    <Resizable
      defaultSize={{ width: '220px', height: '100%' }}
      minWidth={'150px'}
      maxWidth={'90%'}
      enable={{
        right: true,
      }}
    >
      <div className="markdown-body wiki-sidebar w-full h-full overflow-auto border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz dark:bg-raisin-black p-5">
        {Boolean(data?.length) && (
          <ul>
            {data.map((topMenuItem) => {
              return (
                <li key={topMenuItem.title} className="mb-4">
                  <span className="font-semibold text-sm text-outer-space block mb-2 dark:text-bright-gray">
                    {topMenuItem.title}
                  </span>
                  <ul>
                    {topMenuItem.menu.map((menuItem) => {
                      return (
                        <li key={menuItem.name}>
                          <Link
                            item={menuItem}
                            setCurrentSelectedPage={setCurrentSelectedPage}
                          />
                          {Boolean(menuItem?.menu?.length) && (
                            <ul>
                              {menuItem?.menu.map((subMenuItem) => {
                                return (
                                  <li key={subMenuItem.name}>
                                    <Link
                                      item={subMenuItem}
                                      setCurrentSelectedPage={
                                        setCurrentSelectedPage
                                      }
                                    />
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
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
