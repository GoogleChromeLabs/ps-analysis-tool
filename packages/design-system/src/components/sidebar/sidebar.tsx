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
import React, { useEffect, useRef, useState } from 'react';

/**
 * Internal dependencies.
 */
import SidebarChild from './sidebarChild';
import { useSidebar } from './useSidebar';

interface SidebarProps {
  visibleWidth?: number;
}

const Sidebar = ({ visibleWidth }: SidebarProps) => {
  const { sidebarItems, setIsSidebarFocused } = useSidebar(
    ({ state, actions }) => ({
      sidebarItems: state.sidebarItems,
      setIsSidebarFocused: actions.setIsSidebarFocused,
    })
  );

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

  return (
    <div
      className="w-full h-full overflow-auto border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz dark:bg-raisin-black"
      data-testid="sidebar"
    >
      <div ref={sidebarContainerRef} className="min-w-fit">
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
    </div>
  );
};

export default Sidebar;
