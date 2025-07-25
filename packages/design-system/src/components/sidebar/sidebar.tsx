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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { useSidebar } from './useSidebar';
import CollapsedSidebar from './collapsedSidebar';
import ExpandedSidebar from './expandedSidebar';

interface SidebarProps {
  visibleWidth?: number;
  shouldScrollToLatestItem?: boolean;
}

const Sidebar = ({
  visibleWidth,
  shouldScrollToLatestItem = false,
}: SidebarProps) => {
  const { isCollapsed } = useSidebar(({ state }) => ({
    isCollapsed: state.isCollapsed,
  }));

  return (
    <div
      className={classNames(
        'h-full border-r border-gray-300 dark:border-quartz relative transition-all duration-300 bg-lotion dark:bg-raisin-black',
        {
          'w-full overflow-auto': !isCollapsed,
        },
        {
          'w-10': isCollapsed,
        }
      )}
      data-testid="sidebar"
    >
      {isCollapsed ? (
        <CollapsedSidebar />
      ) : (
        <ExpandedSidebar
          shouldScrollToLatestItem={shouldScrollToLatestItem}
          visibleWidth={visibleWidth}
        />
      )}
    </div>
  );
};

export default Sidebar;
