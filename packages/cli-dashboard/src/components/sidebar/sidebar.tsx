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
import React, { useState } from 'react';
import { ArrowDown, ArrowDownWhite } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import type { SidebarItem } from '.';

interface SidebarProps {
  sidebarItems: SidebarItem[];
  updateSelectedItemKey: (key: string | null) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

const Sidebar = ({
  sidebarItems,
  updateSelectedItemKey,
  isKeyAncestor,
  isKeySelected,
}: SidebarProps) => {
  return (
    <div className="flex flex-col">
      {sidebarItems.map((sidebarItem) => (
        <SidebarItem
          sidebarItem={sidebarItem}
          updateSelectedItemKey={updateSelectedItemKey}
          isKeyAncestor={isKeyAncestor}
          isKeySelected={isKeySelected}
          key={sidebarItem.key}
        />
      ))}
    </div>
  );
};

interface SidebarItemProps {
  sidebarItem: SidebarItem;
  updateSelectedItemKey: (key: string | null) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

const SidebarItem = ({
  sidebarItem,
  updateSelectedItemKey,
  isKeyAncestor,
  isKeySelected,
}: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => {
          updateSelectedItemKey(sidebarItem.key);
        }}
        className={`w-full flex items-center pl-6 py-0.5 outline-0 ${
          isKeySelected(sidebarItem.key)
            ? 'bg-royal-blue text-white'
            : isKeyAncestor(sidebarItem.key)
            ? 'bg-gainsboro'
            : 'bg-white'
        } cursor-pointer`}
      >
        {sidebarItem.children?.length !== 0 && (
          <div
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
              !isOpen && '-rotate-90'
            }`}
          >
            {isKeyAncestor(sidebarItem.key) ||
            !isKeySelected(sidebarItem.key) ? (
              <ArrowDown />
            ) : (
              <ArrowDownWhite />
            )}
          </div>
        )}
        {sidebarItem.icon && (
          <div className="mr-1">
            {isKeySelected(sidebarItem.key) ? (
              <>{sidebarItem.selectedIcon}</>
            ) : (
              <>{sidebarItem.icon}</>
            )}
          </div>
        )}
        <p>{sidebarItem.title}</p>
      </div>
      <div>
        {sidebarItem.children?.length !== 0 && isOpen && (
          <>
            {sidebarItem.children.map((child) => (
              <SidebarItem
                sidebarItem={child}
                updateSelectedItemKey={updateSelectedItemKey}
                isKeyAncestor={isKeyAncestor}
                isKeySelected={isKeySelected}
                key={child.key}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;
