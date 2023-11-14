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
import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowDownWhite } from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import type { SidebarItemValue } from './useSidebar';

interface SidebarItemProps {
  selectedItemKey: string | null;
  didUserInteract: boolean;
  setDidUserInteract: (didUserInteract: boolean) => void;
  itemKey: string;
  sidebarItem: SidebarItemValue;
  updateSelectedItemKey: (key: string | null) => void;
  onKeyNavigation: (
    event: React.KeyboardEvent<HTMLDivElement>,
    key: string | null
  ) => void;
  toggleDropdown: (action: boolean, key: string) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
}

const SidebarChild = ({
  selectedItemKey,
  didUserInteract,
  setDidUserInteract,
  itemKey,
  sidebarItem,
  updateSelectedItemKey,
  onKeyNavigation,
  toggleDropdown,
  isKeyAncestor,
  isKeySelected,
}: SidebarItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isKeySelected(itemKey) && didUserInteract) {
      itemRef.current?.focus();
    }
  }, [didUserInteract, isKeySelected, itemKey, selectedItemKey]);

  return (
    <>
      {/* SidebarItem */}
      <div
        ref={itemRef}
        tabIndex={0}
        onClick={() => {
          updateSelectedItemKey(itemKey);
          setDidUserInteract(true);
        }}
        onKeyDown={(event) => {
          onKeyNavigation(event, itemKey);
        }}
        className={`w-full flex items-center pl-3 py-0.5 outline-0 text-sm ${
          isKeySelected(itemKey)
            ? 'bg-royal-blue text-white'
            : isKeyAncestor(itemKey)
            ? 'bg-gainsboro'
            : 'bg-white'
        } cursor-pointer`}
      >
        {Object.keys(sidebarItem.children)?.length !== 0 && (
          <div
            onClick={() => {
              toggleDropdown(!sidebarItem.dropdownOpen, itemKey);
            }}
            className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
              !sidebarItem.dropdownOpen && '-rotate-90'
            }`}
          >
            {isKeyAncestor(itemKey) || !isKeySelected(itemKey) ? (
              <ArrowDown />
            ) : (
              <ArrowDownWhite />
            )}
          </div>
        )}
        {sidebarItem.icon && sidebarItem.selectedIcon && (
          <div className="mr-1">
            {isKeySelected(itemKey) ? (
              <>{sidebarItem.selectedIcon}</>
            ) : (
              <>{sidebarItem.icon}</>
            )}
          </div>
        )}
        <p className="whitespace-nowrap pr-1">{sidebarItem.title}</p>
      </div>
      <>
        {Object.keys(sidebarItem.children)?.length !== 0 &&
          sidebarItem.dropdownOpen && (
            <>
              {Object.entries(sidebarItem.children).map(([childKey, child]) => (
                <div
                  key={childKey}
                  className={`w-full pl-4 ${
                    isKeySelected(childKey)
                      ? 'bg-royal-blue text-white'
                      : isKeyAncestor(childKey)
                      ? 'bg-gainsboro'
                      : 'bg-white'
                  }`}
                >
                  <SidebarChild
                    selectedItemKey={selectedItemKey}
                    didUserInteract={didUserInteract}
                    setDidUserInteract={setDidUserInteract}
                    itemKey={childKey}
                    sidebarItem={child}
                    updateSelectedItemKey={updateSelectedItemKey}
                    onKeyNavigation={onKeyNavigation}
                    toggleDropdown={toggleDropdown}
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
