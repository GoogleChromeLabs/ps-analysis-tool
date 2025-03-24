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
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { MenuOpenIcon } from '../../icons';
import SidebarChild from './sidebarChild';
import { useSidebar } from './useSidebar';

interface ExpandedSidebarProps {
  visibleWidth?: number;
}

const ExpandedSidebar = ({ visibleWidth }: ExpandedSidebarProps) => {
  const {
    sidebarItems,
    setIsSidebarFocused,
    toggleSidebarCollapse,
    isSidebarCollapsible,
    isSidebarFocused,
    isKeySelected,
  } = useSidebar(({ state, actions }) => ({
    sidebarItems: state.sidebarItems,
    setIsSidebarFocused: actions.setIsSidebarFocused,
    toggleSidebarCollapse: actions.toggleSidebarCollapse,
    isSidebarCollapsible: state.isSidebarCollapsible,
    isSidebarFocused: state.isSidebarFocused,
    isKeySelected: actions.isKeySelected,
  }));

  const [isResizing, setIsResizing] = useState(true);

  useEffect(() => {
    setIsResizing(true);

    setTimeout(() => {
      setIsResizing(false);
    }, 180);
  }, []);

  const [didUserInteract, setDidUserInteract] = useState(false);
  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarContainerRef.current &&
        !sidebarContainerRef.current?.contains(event.target as Node)
      ) {
        setIsSidebarFocused(false);
      }
    };

    globalThis?.document?.addEventListener('click', handleClickOutside);

    return () => {
      globalThis?.document?.removeEventListener('click', handleClickOutside);
    };
  }, [setIsSidebarFocused]);

  const isFirstElementSelected = useMemo(
    () => isKeySelected(Object.keys(sidebarItems)[0]),
    [isKeySelected, sidebarItems]
  );

  return (
    <div ref={sidebarContainerRef} className="min-w-fit h-full flex flex-col">
      {isSidebarCollapsible && !isResizing && (
        <button
          onClick={toggleSidebarCollapse}
          className="cursor-pointer hover:opacity-70 absolute right-0 z-20"
          title="Collapse Sidebar Menu"
        >
          <MenuOpenIcon
            className={classNames(
              'w-5 h-5 fill-granite-gray dark:fill-bright-gray',
              isFirstElementSelected && isSidebarFocused
                ? 'fill-white'
                : 'fill-granite-gray'
            )}
          />
        </button>
      )}
      {Object.entries(sidebarItems).map(([itemKey, sidebarItem]) => (
        <SidebarChild
          didUserInteract={didUserInteract}
          setDidUserInteract={setDidUserInteract}
          itemKey={itemKey}
          sidebarItem={sidebarItem}
          key={itemKey}
          visibleWidth={visibleWidth}
        />
      ))}
    </div>
  );
};

export default ExpandedSidebar;
