/*
 * Copyright 2023 Google LLC
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
import React, { PropsWithChildren, useEffect, useState } from 'react';
import classnames from 'classnames';

export type MenuData = Array<{
  name: string;
  link: string;
}>;

interface MenuBarProps {
  menuData: MenuData;
}

const MenuBar = ({ children, menuData }: PropsWithChildren<MenuBarProps>) => {
  const [selectedItem, setSelectedItem] = useState(menuData[0].link);

  useEffect(() => {
    const element = document.getElementById(selectedItem);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedItem]);

  return (
    <div data-testid="menu-bar">
      <nav className="fixed top-0 right-0 flex flex-col gap-4">
        {menuData.map((item, index) => (
          <div
            key={index}
            className={classnames('dark:text-bright-gray hover:opacity-70', {
              underline: selectedItem === item.link,
            })}
            onClick={() => setSelectedItem(item.link)}
          >
            {item.name}
          </div>
        ))}
      </nav>

      {children}
    </div>
  );
};

export default MenuBar;
