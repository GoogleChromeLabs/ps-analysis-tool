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
import React from 'react';
import {
  DevGuideIcon,
  Help,
  SIDEBAR_ITEMS_KEYS,
  useSidebar,
  WebStoriesIcon,
  WikiIcon,
} from '@google-psat/design-system';

export const ITEMS = [
  {
    name: 'Wiki',
    icon: WikiIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.WIKI,
    description:
      'Learn about the PSAT extension, its features, and usage through detailed documentation in the official Wiki.',
  },
  {
    name: 'Stories',
    icon: WebStoriesIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.EXPLORABLE_EXPLANATIONS,
    description:
      'Explore interactive web stories that simplify key concepts of the Privacy Sandbox API and its impact on the web.',
  },
  {
    name: 'Help Center',
    icon: Help,
    sidebarKey: SIDEBAR_ITEMS_KEYS.HELP_CENTER,
    description:
      'Find answers to common questions, troubleshooting guides, and official support at the Privacy Sandbox Help Center',
  },
  {
    name: 'Dev Site',
    icon: DevGuideIcon,
    sidebarKey: SIDEBAR_ITEMS_KEYS.DEV_SITE,
    description:
      'Access technical documentation, API references, and implementation guides on the Privacy Sandbox Developer Site',
  },
];

const ContentPanel = () => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  return (
    <div
      data-testid="learning-content"
      className="h-full w-full overflow-auto text-raisin-black dark:text-bright-gray px-2 pb-14"
    >
      <div className="min-w-[45.75rem]">
        <section>
          <h3 className="text-sm mb-2">Features</h3>
          <div className="flex gap-5 flex-wrap">
            {ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.name}
                  className="w-[366px] h-[auto] border border-chinese-silver px-3 py-4 rounded hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                  onClick={() => navigateTo(item.sidebarKey)}
                >
                  <div className="flex gap-2 justify-start mb-3">
                    <Icon width={20} height={20} className="fill-gray" />
                    <h4 className="text-sm">{item.name}</h4>
                  </div>
                  <p>{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContentPanel;
