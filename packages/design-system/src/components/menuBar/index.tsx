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
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';

/**
 * Internal dependencies.
 */
import { isInCenter } from './utils';

export type MenuData = Array<{
  name: string;
  link: string;
}>;

interface MenuBarProps {
  menuData: MenuData;
  extraClasses?: string;
  scrollContainerId: string;
}

const MenuBar = ({
  menuData,
  extraClasses,
  scrollContainerId,
}: MenuBarProps) => {
  const [selectedItem, setSelectedItem] = useState<string>(menuData[0].link);
  const [isListenerDisabled, setIsListenerDisabled] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const element = document.getElementById(selectedItem);
    if (element) {
      element.scrollIntoView?.({ behavior: 'smooth' });
      timeout = setTimeout(() => {
        setIsListenerDisabled(false);
      }, 700);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [selectedItem]);

  useEffect(() => {
    const scrollContainer = document.getElementById(scrollContainerId);
    const firstItemLink = menuData[0].link;
    const lastItemLink = menuData[menuData.length - 1].link;

    const handleScroll = () => {
      if (isListenerDisabled || !scrollContainer) {
        return;
      }

      const distanceScrolled = scrollContainer.scrollTop;
      const maxScrollDistance =
        scrollContainer.scrollHeight - scrollContainer.clientHeight;

      menuData.forEach(({ link: id }) => {
        const section = document.getElementById(id);
        setSelectedItem((prev) => {
          if (scrollContainer?.scrollTop === 0) {
            return firstItemLink;
          } else if (section && isInCenter(section) && prev !== id) {
            return id;
          } else if (maxScrollDistance - distanceScrolled < 5) {
            return lastItemLink;
          }
          return prev;
        });
      });
    };

    scrollContainer?.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll);
    };
  }, [menuData, isListenerDisabled, scrollContainerId]);

  return (
    <nav
      data-testid="menu-bar"
      className={classnames(
        'fixed right-6 flex flex-col gap-4 z-10',
        extraClasses ? extraClasses : 'top-4'
      )}
    >
      {menuData.map((item, index) => (
        <div
          key={index}
          className={classnames(
            'relative w-3 h-3 rounded-full cursor-pointer hover:bg-baby-blue-eyes transition-all ease-in-out group',
            selectedItem === item.link
              ? 'bg-ultramarine-blue'
              : 'bg-bright-gray'
          )}
          onClick={() => {
            setIsListenerDisabled(true);
            setSelectedItem(item.link);
          }}
        >
          <div className="absolute -top-1/2 right-6 w-max px-3 py-1 rounded invisible text-sm text-white bg-ultramarine-blue group-hover:visible transition-all ease-in-out">
            {item.name}
            <div className="absolute w-2 h-2 bg-ultramarine-blue top-1/3 -right-1 transform rotate-45" />
          </div>
        </div>
      ))}
    </nav>
  );
};

export default MenuBar;
