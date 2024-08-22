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

interface MenuItem {
  name: string;
  link?: string;
  menu?: MenuItem[];
}

interface LinkProps {
  item: MenuItem;
}

export interface SidebarMenuItem {
  title: string;
  menu: MenuItem[];
}

type SidebarMenu = {
  data: SidebarMenuItem[] | undefined;
};

const Link = ({ item }: LinkProps) => {
  const fileName = item?.link ? '' : item.name.replace(' ', '-') + '.md';

  return (
    <a
      href={item?.link ? item.link : '#'}
      target={item?.link ? '__blank' : '_self'}
      data-file-name={fileName}
    >
      {item.name}
    </a>
  );
};

const Sidebar = ({ data }: SidebarMenu) => {
  if (!data?.length) {
    return null;
  }

  return (
    <div className="markdown-body wiki-sidebar border-r border-gray-300 dark:border-quartz">
      <ul>
        {data.map((topMenuItem) => {
          return (
            <li key={topMenuItem.title} className="mb-4">
              <span className="font-semibold">{topMenuItem.title}</span>
              <ul>
                {topMenuItem.menu.map((menuItem) => {
                  return (
                    <li key={menuItem.name}>
                      <Link item={menuItem} />
                      {menuItem?.menu?.length && (
                        <ul>
                          {menuItem?.menu.map((subMenuItem) => {
                            return (
                              <li key={subMenuItem.name}>
                                <Link item={subMenuItem} />
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
    </div>
  );
};

export default Sidebar;
