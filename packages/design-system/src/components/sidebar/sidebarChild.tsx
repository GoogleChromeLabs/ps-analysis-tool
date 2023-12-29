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
  isSidebarFocused: boolean;
  setIsSidebarFocused: React.Dispatch<boolean>;
  updateSelectedItemKey: (key: string | null) => void;
  onKeyNavigation: (
    event: React.KeyboardEvent<HTMLDivElement>,
    key: string | null
  ) => void;
  toggleDropdown: (action: boolean, key: string) => void;
  isKeyAncestor: (key: string) => boolean;
  isKeySelected: (key: string) => boolean;
  recursiveStackIndex?: number;
  visibleWidth?: number;
}

const SidebarChild = ({
  selectedItemKey,
  didUserInteract,
  setDidUserInteract,
  itemKey,
  sidebarItem,
  isSidebarFocused,
  setIsSidebarFocused,
  updateSelectedItemKey,
  onKeyNavigation,
  toggleDropdown,
  isKeyAncestor,
  isKeySelected,
  recursiveStackIndex = 0,
  visibleWidth,
}: SidebarItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isKeySelected(itemKey) && didUserInteract) {
      itemRef.current?.focus();
    }
  }, [
    didUserInteract,
    isKeySelected,
    itemKey,
    selectedItemKey,
    setIsSidebarFocused,
  ]);

  return (
    <>
      {/* SidebarItem */}
      <div
        ref={itemRef}
        tabIndex={0}
        title={sidebarItem.popupTitle}
        onClick={() => {
          updateSelectedItemKey(itemKey);
          setDidUserInteract(true);
          setIsSidebarFocused(true);
        }}
        onKeyDown={(event) => {
          onKeyNavigation(event, itemKey);
          setIsSidebarFocused(true);
        }}
        className={`relative w-full flex items-center py-0.5 outline-0 text-xs dark:text-bright-gray ${
          isKeySelected(itemKey)
            ? isSidebarFocused
              ? 'bg-royal-blue text-white dark:bg-medium-persian-blue dark:text-chinese-silver'
              : 'bg-gainsboro dark:bg-outer-space'
            : 'bg-white dark:bg-raisin-black'
        } cursor-pointer`}
        style={{ paddingLeft: recursiveStackIndex * 16 + 12 }}
      >
        {Object.keys(sidebarItem.children)?.length !== 0 && (
          <button
            onClick={() => {
              toggleDropdown(!sidebarItem.dropdownOpen, itemKey);
            }}
            className={`origin-center transition-transform scale-125 p-0.5 mr-1 ${
              !sidebarItem.dropdownOpen && '-rotate-90'
            }`}
          >
            <div className="pointer-events-none">
              {isKeyAncestor(itemKey) ||
              !isKeySelected(itemKey) ||
              !isSidebarFocused ? (
                <ArrowDown />
              ) : (
                <ArrowDownWhite />
              )}
            </div>
          </button>
        )}
        {sidebarItem.icon && sidebarItem.selectedIcon && (
          <div className="mr-1 pointer-events-none">
            {isKeySelected(itemKey) && isSidebarFocused ? (
              <>{sidebarItem.selectedIcon}</>
            ) : (
              <>{sidebarItem.icon}</>
            )}
          </div>
        )}
        <p className="whitespace-nowrap pr-1">{sidebarItem.title}</p>
        <div
          className="absolute"
          style={{
            left: visibleWidth ? visibleWidth - 35 : 0,
          }}
        >
          {sidebarItem.extraInterfaceToTitle}
        </div>
      </div>
      <>
        {Object.keys(sidebarItem.children)?.length !== 0 &&
          sidebarItem.dropdownOpen && (
            <>
              {Object.entries(sidebarItem.children).map(([childKey, child]) => (
                <React.Fragment key={childKey}>
                  <SidebarChild
                    selectedItemKey={selectedItemKey}
                    didUserInteract={didUserInteract}
                    setDidUserInteract={setDidUserInteract}
                    itemKey={childKey}
                    sidebarItem={child}
                    isSidebarFocused={isSidebarFocused}
                    setIsSidebarFocused={setIsSidebarFocused}
                    updateSelectedItemKey={updateSelectedItemKey}
                    onKeyNavigation={onKeyNavigation}
                    toggleDropdown={toggleDropdown}
                    isKeyAncestor={isKeyAncestor}
                    isKeySelected={isKeySelected}
                    recursiveStackIndex={recursiveStackIndex + 1}
                    visibleWidth={visibleWidth}
                  />
                </React.Fragment>
              ))}
            </>
          )}
      </>
    </>
  );
};

export default SidebarChild;
