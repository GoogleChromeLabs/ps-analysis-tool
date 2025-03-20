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
import React, { ComponentType, SVGProps } from 'react';

/**
 * Internal dependencies.
 */
import { SIDEBAR_ITEMS_KEYS, useSidebar } from '../sidebar';

type PinnedItem = {
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
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

type CardsPanelProps = {
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
}: CardsPanelProps) => {
  const navigateTo = useSidebar(({ actions }) => actions.updateSelectedItemKey);

  return (
    <div
      data-testid="cards-panel"
      className="h-full w-full overflow-auto text-raisin-black dark:text-bright-gray px-2 pb-14"
    >
      <div className="min-w-[45.75rem]">
        {pinnedItems && pinnedItems.length > 0 && (
          <section className="border-b border-hex-gray mb-5 pb-5">
            {hasTitle && <h3 className="text-base">Quick Access</h3>}
            <div className="flex gap-x-5 gap-y-4 flex-wrap mt-2">
              {pinnedItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="w-[366px] border-2 border-gray-400 px-3 py-4 flex gap-2 justify-start rounded-xl hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={() => navigateTo(item.sidebarKey)}
                  >
                    <Icon
                      width={22}
                      height={22}
                      className="fill-gray dark:fill-bright-gray"
                    />
                    <span className="text-base">{item.name}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}
        {featuredItems.length > 0 && (
          <section>
            {hasTitle && <h3 className="text-base">Features</h3>}
            <div className="flex gap-5 flex-wrap mt-2">
              {featuredItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.name}
                    className="w-[366px] rounded-xl border-2 border-privacy-blue px-3 py-4 hover:cursor-pointer hover:bg-light-gray dark:hover:bg-charleston-green hover:shadow hover:scale-[1.03] transition-all duration-150 ease-in-out"
                    onClick={() => navigateTo(item.sidebarKey)}
                  >
                    <div className="mb-3 flex items-center flex-col gap-2">
                      <Icon height={45} />
                      <h4 className="font-medium text-xl">{item.name}</h4>
                    </div>
                    <p className="text-sm text-center">{item.description}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-2 mt-4 justify-center">
                      {item.buttons &&
                        item.buttons.map((button) => (
                          <button
                            className="bg-cultured-grey dark:bg-transparent text-raisin-black dark:text-bright-gray  py-1.5 px-4 rounded border border-dark-grey text-xs hover:bg-light-gray hover:border-american-silver"
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
