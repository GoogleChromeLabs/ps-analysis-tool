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
import {
  ArrowDown,
  ArrowDownWhite,
  InfoIcon,
  useSidebar,
} from '@ps-analysis-tool/design-system';

/**
 * Internal dependencies.
 */
import type { SidebarItemValue } from './useSidebar';

interface SidebarItemProps {
  didUserInteract: boolean;
  setDidUserInteract: (didUserInteract: boolean) => void;
  itemKey: string;
  sidebarItem: SidebarItemValue;
  recursiveStackIndex?: number;
  visibleWidth?: number;
}

// eslint-disable-next-line complexity
const SidebarChild = ({
  didUserInteract,
  setDidUserInteract,
  itemKey,
  sidebarItem,
  recursiveStackIndex = 0,
  visibleWidth,
}: SidebarItemProps) => {
  const {
    selectedItemKey,
    isSidebarFocused,
    setIsSidebarFocused,
    updateSelectedItemKey,
    toggleDropdown,
    isKeyAncestor,
    isKeySelected,
    onKeyNavigation,
  } = useSidebar(({ state, actions }) => ({
    selectedItemKey: state.selectedItemKey,
    isSidebarFocused: state.isSidebarFocused,
    setIsSidebarFocused: actions.setIsSidebarFocused,
    updateSelectedItemKey: actions.updateSelectedItemKey,
    toggleDropdown: actions.toggleDropdown,
    isKeyAncestor: actions.isKeyAncestor,
    isKeySelected: actions.isKeySelected,
    onKeyNavigation: actions.onKeyNavigation,
  }));

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

  const SelectedIcon = sidebarItem.selectedIcon?.Element;
  const Icon = sidebarItem.icon?.Element;
  const ExtraInterfaceToTitle = sidebarItem.extraInterfaceToTitle?.Element;

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
        } cursor-pointer ${sidebarItem.isBlurred ? 'opacity-50' : ''}`}
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
            {isKeySelected(itemKey) && isSidebarFocused
              ? SelectedIcon && (
                  <SelectedIcon {...sidebarItem.selectedIcon.props} />
                )
              : Icon && <Icon {...sidebarItem.icon.props} />}
          </div>
        )}
        <p className="flex flex-row items-center justify-center whitespace-nowrap gap-x-1 pr-1">
          {sidebarItem.title}
          {sidebarItem.infoIconDescription ? (
            <span title={sidebarItem.infoIconDescription}>
              <InfoIcon
                className={`${
                  isKeySelected(itemKey) && isSidebarFocused
                    ? 'fill-white'
                    : 'fill-gray'
                }`}
              />
            </span>
          ) : null}
        </p>
        <div
          className="absolute"
          style={{
            left: visibleWidth ? visibleWidth - 35 : 0,
          }}
        >
          {ExtraInterfaceToTitle && (
            <ExtraInterfaceToTitle
              {...sidebarItem.extraInterfaceToTitle?.props}
            />
          )}
        </div>
      </div>
      {/* Sidebar item's children */}
      <>
        {Object.keys(sidebarItem.children)?.length !== 0 &&
          sidebarItem.dropdownOpen && (
            <>
              {Object.entries(sidebarItem.children).map(([childKey, child]) => (
                <React.Fragment key={childKey}>
                  <SidebarChild
                    didUserInteract={didUserInteract}
                    setDidUserInteract={setDidUserInteract}
                    itemKey={childKey}
                    sidebarItem={child}
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
