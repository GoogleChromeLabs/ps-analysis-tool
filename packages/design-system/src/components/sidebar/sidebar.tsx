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
import React from 'react';

/**
 * Internal dependencies.
 */
import SidebarChild from './sidebarChild';
import type { SidebarItems } from './useSidebar';

interface SidebarProps {
  sidebarItems: SidebarItems;
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
    <div className="w-full h-full overflow-auto border border-l-0 border-t-0 border-b-0 border-gray-300 dark:border-quartz pt-1">
      <div className="min-w-fit">
        {Object.entries(sidebarItems).map(([itemKey, sidebarItem]) => (
          <SidebarChild
            itemKey={itemKey}
            sidebarItem={sidebarItem}
            updateSelectedItemKey={updateSelectedItemKey}
            isKeyAncestor={isKeyAncestor}
            isKeySelected={isKeySelected}
            key={itemKey}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
