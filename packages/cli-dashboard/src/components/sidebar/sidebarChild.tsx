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
import type { SidebarItem } from './useSidebar';

interface SidebarItemProps {
  sidebarItem: SidebarItem;
  updateSelectedItemKey: (key: string | null) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

const SidebarChild = ({
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
        className={`w-full flex items-center pl-6 py-0.5 outline-0 text-sm ${
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
        {sidebarItem.icon && sidebarItem.selectedIcon && (
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
      <>
        {sidebarItem.children?.length !== 0 && isOpen && (
          <>
            {sidebarItem.children.map((child) => (
              <div
                key={child.key}
                className={`pl-6 ${
                  isKeySelected(child.key)
                    ? 'bg-royal-blue text-white'
                    : isKeyAncestor(child.key)
                    ? 'bg-gainsboro'
                    : 'bg-white'
                }`}
              >
                <SidebarChild
                  sidebarItem={child}
                  updateSelectedItemKey={updateSelectedItemKey}
                  isKeyAncestor={isKeyAncestor}
                  isKeySelected={isKeySelected}
                />
              </div>
            ))}
          </>
        )}
      </>
    </>
  );
};

export default SidebarChild;
