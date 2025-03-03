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
import classNames from 'classnames';

/**
 * Internal dependencies.
 */
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '../sidebar';

type PinnedItem = {
  name: string;
  icon: React.ComponentType<{
    width: number;
    height: number;
    className?: string;
  }>;
  sidebarKey: SIDEBAR_ITEMS_KEYS;
};

type FeatureItem = PinnedItem & {
  description: string;
  colorClasses?: {
    heading?: string;
  };
  buttons?: {
    name: string;
    sidebarKey: SIDEBAR_ITEMS_KEYS;
  }[];
};

type Props = {
  pinnedItems?: PinnedItem[];
  featuredItems: FeatureItem[];
  hasTitle?: boolean;
  onFeaturedButtonClick: (
    event: React.MouseEvent,
    sidebarKey: SIDEBAR_ITEMS_KEYS
  ) => void;
};

const CardsPanel = ({
  pinnedItems,
  featuredItems,
  hasTitle = true,
  onFeaturedButtonClick,
}: Props) => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  return (
    <div
      data-testid="cards-panel"
      className="h-full w-full overflow-auto text-raisin-black dark:text-bright-gray px-2 pb-14"
    >
      <div className="min-w-[45.75rem]">
        {pinnedItems && pinnedItems.length > 0 && (
          <section className="border-b border-hex-gray mb-5 pb-5">
            {hasTitle && <h3 className="text-sm mb-2">Pinned</h3>}
            <div className="flex gap-x-5 gap-y-4 flex-wrap">
              {pinnedItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="w-[366px] border border-chinese-silver px-3 py-4 flex gap-2 justify-start rounded hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={() => navigateTo(item.sidebarKey)}
                  >
                    <Icon width={20} height={20} className="fill-gray" />
                    <span className="text-sm">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {featuredItems.length > 0 && (
          <section>
            {hasTitle && <h3 className="text-sm mb-2">Features</h3>}
            <div className="flex gap-5 flex-wrap">
              {featuredItems.map((item) => {
                const Icon = item.icon;
                const headingClasses = classNames(
                  'text-sm',
                  item?.colorClasses?.heading ? item?.colorClasses?.heading : ''
                );

                return (
                  <div
                    key={item.name}
                    className="w-[366px] border border-chinese-silver px-3 py-4 rounded hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={() => navigateTo(item.sidebarKey)}
                  >
                    <div className="flex gap-2 justify-start mb-3">
                      <Icon width={20} height={20} className="fill-gray" />
                      <h4 className={headingClasses}>{item.name}</h4>
                    </div>
                    <p>{item.description}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-2 mt-2">
                      {item.buttons &&
                        item.buttons.map((button) => (
                          <button
                            className="bg-cultured-grey text-raisin-black py-1 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
                            key={button.name}
                            onClick={(event) =>
                              onFeaturedButtonClick(event, button.sidebarKey)
                            }
                          >
                            {button.name}
                          </button>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default CardsPanel;
